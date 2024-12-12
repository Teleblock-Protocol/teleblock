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

// To register a new validator just add the wallet 
//address and upon connection you will become a validator.
const validatorWalletAddress = 'address-validator';


app.get('/wallet', (req, res) => {
    console.log(`Request received in /wallet`);
    res.json({ address: validatorWalletAddress });
});


app.get('/address', (req, res) => {
    console.log(`Request received in /address`);
    res.json({ address: validatorWalletAddress });
});


function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1'; 
}

const validatorHost = getLocalIPAddress();

// Abrir o crear la base de datos SQLite
const db = new sqlite3.Database('./blockchainDB.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});





async function insertBlockToDB(block) {
    try {
        const blockData = JSON.stringify(block.data); 
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO blocks (block_index, hash, previousHash, data, timestamp) VALUES (?, ?, ?, ?, ?)`,
                [block.index, block.hash, block.previousHash, blockData, block.timestamp],
                function (err) {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            console.log(`The block with index ${block.index} o hash ${block.hash} already exists in the database. Avoiding duplicate insertions.`);
                            return resolve(); 
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


const mainNodeUrl = 'ws://server.teleblock.net:5002';
const ws = new WebSocket(mainNodeUrl);


ws.on('open', () => {
    console.log('Connected to the main node.');
    console.log(`Host received in registerNewValidator: ${validatorHost}`);
    const message = { 
        type: 'registerNewValidator', 
        walletAddress: validatorWalletAddress,
        validatorHostip: validatorHost 
    };
    console.log(`Enviando solicitud de registro de validador: ${JSON.stringify(message)}`);
    ws.send(JSON.stringify(message));  
});

ws.on('message', async (data) => {
    const message = JSON.parse(data);
    console.log('Message received from the main node:', message);

    
    if (message.type === 'fullBlockchain') {
        console.log('Full Blockchain Received:', message.chain);
        blockchain.chain = message.chain;

        
        for (const block of message.chain) {
            await insertBlockToDB(block);
        }
        console.log('Blockchain updated in the database.');
    }

   
    if (message.type === 'newBlock') {
        console.log('New block received:', message.block);
        
        const validationResult = await blockchain.validateAndAddBlock(message.block);
        if (validationResult.success) {
            console.log('Block valid and added to the blockchain.');
            
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


app.post('/validate', async (req, res) => {
    const block = req.body.block;

    if (!block) {
        return res.status(400).json({ success: false, message: 'Block not provided' });
    }

    try {
       
        const validationResult = await blockchain.validateAndAddBlock(block);

        if (validationResult.success) {
           
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


//Add the key and certificate of the domain where the validator is hosted

const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'llave.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certifi.crt'))
};

https.createServer(sslOptions, app).listen(port, () => {
    console.log(`HTTPS server listening on port ${port}`);
});
