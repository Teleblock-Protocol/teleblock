const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const path = require('path');
const Blockchain = require('./blockchain'); // Instancia de la blockchain local
const os = require('os'); // Para obtener la IP del validador automáticamente
const sqlite3 = require('sqlite3').verbose(); // Conexión a SQLite

const blockchain = new Blockchain();
const app = express();
const port = 4000;

app.use(bodyParser.json());

// Dirección de la billetera del validador
const validatorWalletAddress = '5d145d96a14dd6e0c0b61d2dbf64817b07340aa1';

// Ruta para devolver la dirección del validador
app.get('/wallet', (req, res) => {
    console.log(`Request received in /wallet`);
    res.json({ address: validatorWalletAddress });
});

// Ruta para obtener la dirección de wallet del validador
app.get('/address', (req, res) => {
    console.log(`Request received in /address`);
    res.json({ address: validatorWalletAddress });
});

// Obtener la IP del validador automáticamente
function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1'; // Usar localhost si no se encuentra la IP
}

const validatorHost = getLocalIPAddress(); // Obtener la IP del validador

// Abrir o crear la base de datos SQLite
const db = new sqlite3.Database('./blockchainDB.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});




// Función para insertar un bloque en la base de datos
async function insertBlockToDB(block) {
    try {
        const blockData = JSON.stringify(block.data); // Convertir los datos del bloque a JSON
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO blocks (block_index, hash, previousHash, data, timestamp) VALUES (?, ?, ?, ?, ?)`,
                [block.index, block.hash, block.previousHash, blockData, block.timestamp],
                function (err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            console.log(`The block with index ${block.index} o hash ${block.hash} already exists in the database. Avoiding duplicate insertions.`);
                            return resolve(); // Evitar rechazar la promesa si ya existe
                        }
                        console.error('Error inserting block into database:', err.message);
                        return reject(err);
                    }
                    console.log('Block successfully inserted into the database.');
                    resolve();
                }
            );
        });
    } catch (error) {
        console.error('Error inserting block into database:', error.message);
    }
}

// 1. Conexión al nodo principal
const mainNodeUrl = 'ws://node.rhabits.io:5002';
const ws = new WebSocket(mainNodeUrl);

// WebSocket para conectarse al nodo principal
ws.on('open', () => {
    console.log('Connected to the main node.');
    console.log(`Host received in registerNewValidator: ${validatorHost}`);
    const message = { 
        type: 'registerNewValidator', 
        walletAddress: validatorWalletAddress,
        validatorHostip: validatorHost // Enviar la IP del validador
    };
    console.log(`Enviando solicitud de registro de validador: ${JSON.stringify(message)}`);
    ws.send(JSON.stringify(message));  // Enviar la solicitud de registro
});

ws.on('message', async (data) => {
    const message = JSON.parse(data);
    console.log('Message received from the main node:', message);

    // Si se recibe la blockchain completa
    if (message.type === 'fullBlockchain') {
        console.log('Full Blockchain Received:', message.chain);
        blockchain.chain = message.chain;

        // Insertar todos los bloques recibidos en la base de datos
        for (const block of message.chain) {
            await insertBlockToDB(block);
        }
        console.log('Blockchain updated in the database.');
    }

    // Si se recibe un nuevo bloque
    if (message.type === 'newBlock') {
        console.log('New block received:', message.block);
        // Validar y agregar el bloque a la blockchain local
        const validationResult = await blockchain.validateAndAddBlock(message.block);
        if (validationResult.success) {
            console.log('Block valid and added to the blockchain.');
            // Insertar el bloque validado en la base de datos
            await insertBlockToDB(message.block);
        } else {
            console.log('Error in block validation:', validationResult.message);
        }
    }
});

ws.on('close', () => {
    console.log('Connection to main node closed.');
});

ws.on('error', (error) => {
    console.error('WebSocket connection error:', error);
});

// 2. Iniciar servidor WebSocket para aceptar conexiones entrantes en el validador
const wss = new WebSocket.Server({ port: 5002 });

wss.on('connection', (ws) => {
    console.log('New client connected to validator WebSocket.');

    ws.on('message', async (message) => {
        const data = JSON.parse(message);
        console.log('Message received and converted:', data);

        if (data.type === 'validateBlock') {
            const block = data.block;

            if (!block || !block.index) {
                console.log('Undefined or invalid block.');
                ws.send(JSON.stringify({ success: false, message: 'Undefined or invalid block.' }));
            } else {
                console.log('Block received for validation:', JSON.stringify(block, null, 2));

                // Validar el bloque
                const validationResult = await blockchain.validateAndAddBlock(block);
                if (validationResult.success) {
                    console.log('Block received for validation:');
                    await insertBlockToDB(block); // Insertar el bloque validado en la base de datos
                    ws.send(JSON.stringify({ success: true, message: 'Block validated successfully' }));
                } else {
                    console.log('Error in block validation:', validationResult.message);
                    ws.send(JSON.stringify({ success: false, message: validationResult.message }));
                }
            }
        }
    });

    ws.on('close', () => {
        console.log('Connection closed with the client.');
    });

    ws.on('error', (error) => {
        console.error('Validator WebSocket connection failed:', error);
    });
});

console.log('WebSocket server listening on port 5002');

// 3. Ruta /validate para validar bloques entrantes desde otros nodos
app.post('/validate', async (req, res) => {
    const block = req.body.block;

    if (!block) {
        return res.status(400).json({ success: false, message: 'Block not provided' });
    }

    try {
        // Validar y agregar el bloque a la blockchain
        const validationResult = await blockchain.validateAndAddBlock(block);

        if (validationResult.success) {
            // Insertar el bloque validado en la base de datos
            await insertBlockToDB(block);
            res.json({ success: true, message: 'Block validated successfully' });
        } else {
            res.json({ success: false, message: validationResult.message });
        }
    } catch (error) {
        console.error('Block validated successfully', error);
        res.status(500).json({ success: false, message: 'Internal error validating block' });
    }
});

// Iniciar servidor HTTPS en el validador
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'llave.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certifi.crt'))
};

https.createServer(sslOptions, app).listen(port, () => {
    console.log(`HTTPS server listening on port ${port}`);
});
