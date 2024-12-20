const Block = require('./block');
const { getUser, updateUserBalance } = require('./user');
const fs = require('fs');
const crypto = require('crypto'); 
const { ec } = require('elliptic'); 

class Blockchain {
    constructor() {
        if (!Blockchain.instance) {
            this.chain = this.loadBlockchain();

            
            if (this.chain.length === 0) {
                this.chain.push(this.createGenesisBlock());
            }

            Blockchain.instance = this; 
        }

        return Blockchain.instance;
    }

   
    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0");
    }

    
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    
    calculateHash(block) {
        const { index, previousHash, timestamp, data } = block;
        console.log(`Calculando hash con datos: ${index} ${previousHash} ${timestamp} ${JSON.stringify(data)}`);
        const blockString = `${index}${previousHash}${timestamp}${JSON.stringify(data)}`;
        return crypto.createHash('sha256').update(blockString).digest('hex');
    }

    
    async validateAndAddBlock(block) {
    try {
       
        if (this.chain.some(b => b.index === block.index)) {
            console.log(`El bloque con índice ${block.index} ya existe en la cadena.`);
            return { success: false, message: 'El bloque ya existe en la cadena' };
        }

        const previousBlock = this.getLatestBlock();

        
        if (block.index !== previousBlock.index + 1) {
            console.error('Índice del bloque no válido:', block.index, 'Expected:', previousBlock.index + 1);
            return { success: false, message: 'El índice del bloque es incorrecto' };
        }

        if (block.previousHash !== previousBlock.hash) {
            console.error('Hash del bloque anterior no coincide:', block.previousHash, 'Expected:', previousBlock.hash);
            return { success: false, message: 'El hash del bloque anterior no coincide' };
        }

        const recalculatedHash = this.calculateHash(block);
        if (block.hash !== recalculatedHash) {
            console.error('El hash del bloque es incorrecto:', block.hash, 'Expected:', recalculatedHash);
            return { success: false, message: 'El hash del bloque es incorrecto' };
        }

        console.log('Bloque validado correctamente. Agregando a la cadena.');
        this.chain.push(block);
        this.saveBlockchain();

        return { success: true, message: 'Bloque válido y añadido a la cadena' };
    } catch (error) {
        console.error('Error al validar y agregar el bloque:', error);
        return { success: false, message: 'Error al validar el bloque' };
    }
}

    saveBlockchain() {
        try {
            fs.writeFileSync('blockchain.json', JSON.stringify(this.chain, null, 2));
        } catch (error) {
            console.error('Error al guardar la blockchain:', error);
        }
    }

   
    loadBlockchain() {
        try {
            if (fs.existsSync('blockchain.json')) {
                const data = JSON.parse(fs.readFileSync('blockchain.json', 'utf-8'));
                return Array.isArray(data) ? data : [];
            } else {
                return []; 
            }
        } catch (error) {
            console.error('Error al cargar la blockchain:', error);
            return [];
        }
    }
}

module.exports = Blockchain;
