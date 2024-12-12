const crypto = require('crypto');
const secp256k1 = require('secp256k1'); 

class Block {
    constructor(index, timestamp, data, previousHash = '', signature = '') {
        this.index = index; 
        this.timestamp = timestamp; 
        this.data = data; 
        this.previousHash = previousHash; 
        this.signature = signature; 
        this.hash = this.calculateHash(); 
    }

   
    calculateHash() {
        const blockData = this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash;
        return crypto.createHash('sha256').update(blockData).digest('hex');
    }

    
    isValid() {
        return this.hash === this.calculateHash();
    }

    
    sign(privateKey) {
        const messageHash = this.calculateHash(); 
        const signatureObj = secp256k1.sign(Buffer.from(messageHash, 'hex'), privateKey);
        this.signature = signatureObj.toDER('hex'); 
    }

    
    static verify(publicKey, block) {
        const messageHash = block.calculateHash(); 
        return secp256k1.verify(Buffer.from(messageHash, 'hex'), Buffer.from(block.signature, 'hex'), publicKey);
    }
}

module.exports = Block;
