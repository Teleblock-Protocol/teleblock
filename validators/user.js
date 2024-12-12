const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const db = new sqlite3.Database('./blockchainDB.sqlite', (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');

       
        // Crear tabla de bloques si no existe
        db.run(`
            CREATE TABLE IF NOT EXISTS blocks (
                block_index INTEGER PRIMARY KEY AUTOINCREMENT,
                previousHash TEXT,
                timestamp INTEGER,
                data TEXT,
                hash TEXT,
                is_validated INTEGER DEFAULT 0  -- 0: No validado, 1: Validado
            )
        `, (err) => {
            if (err) {
                console.error('Error al crear la tabla de bloques:', err.message);
            }
        });

    



db.run(`
CREATE TABLE IF NOT EXISTS group_encryptedKeys (
    key_id INTEGER PRIMARY KEY AUTOINCREMENT,
    groupAddress TEXT NOT NULL,
    memberAddress TEXT NOT NULL,
    encryptedKeys TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    messageId INTEGER NOT NULL,  -- Nueva columna que referenciará la tabla
    FOREIGN KEY (groupAddress) REFERENCES group_messages(groupAddress)
)
`, (err) => {
    if (err) {
        console.error('Error al crear la tabla de llaves cifradas del grupo:', err.message);
    } else {
        console.log('Tabla de llaves cifradas del grupo creada con éxito.');
    }
});


        
        db.run(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                senderAddress TEXT NOT NULL,
                receiverAddress TEXT NOT NULL,
                encryptedMessage TEXT NOT NULL,
                encryptedKey TEXT NOT NULL,
                encrypteIv TEXT NOT NULL,
                signature TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                hash TEXT NOT NULL,
                previousHash TEXT NOT NULL 
            )
        `, (err) => {
            if (err) {
                console.error('Error al crear la tabla de mensajes:', err.message);
            }
        });
    }
});



class User {
  



  

    static getUser(walletAddress) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT walletAddress, name, publicKey, balance FROM users WHERE walletAddress = ?',
                [walletAddress],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return reject(new Error('Usuario no encontrado'));

                    row.balance = parseFloat(row.balance.toFixed(8));
                    resolve(row);
                }
            );
        });
    }


    static updateUserBalance(walletAddress, newBalance) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET balance = ? WHERE walletAddress = ?',
                [parseFloat(newBalance.toFixed(8)), walletAddress],
                function (err) {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });
    }

   

    static closeDB() {
        return new Promise((resolve, reject) => {
            db.close((err) => {
                if (err) {
                    return reject(err);
                }
                console.log('Conexión a la base de datos SQLite cerrada.');
                resolve();
            });
        });
    }
}





module.exports = {
    db, 
    getUser: User.getUser,
    updateUserBalance: User.updateUserBalance
    
    
};
