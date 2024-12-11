const crypto = require('crypto');
const secp256k1 = require('secp256k1'); // Asegúrate de tener este paquete instalado

class Block {
    constructor(index, timestamp, data, previousHash = '', signature = '') {
        this.index = index; // Índice del bloque dentro de la blockchain
        this.timestamp = timestamp; // Marca temporal del bloque
        this.data = data; // Información almacenada en el bloque (transacciones, mensajes, etc.)
        this.previousHash = previousHash; // Hash del bloque anterior
        this.signature = signature; // Firma del bloque
        this.hash = this.calculateHash(); // Hash actual del bloque, calculado a partir de los datos
    }

    // Función para calcular el hash del bloque basado en su contenido
    calculateHash() {
        const blockData = this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash;
        return crypto.createHash('sha256').update(blockData).digest('hex');
    }

    // Método opcional para validar la integridad del bloque
    isValid() {
        return this.hash === this.calculateHash();
    }

    // Método para firmar el bloque con la clave privada
    sign(privateKey) {
        const messageHash = this.calculateHash(); // Calcula el hash del bloque
        const signatureObj = secp256k1.sign(Buffer.from(messageHash, 'hex'), privateKey);
        this.signature = signatureObj.toDER('hex'); // Almacena la firma en formato DER
    }

    // Método para verificar la firma del bloque
    static verify(publicKey, block) {
        const messageHash = block.calculateHash(); // Obtiene el hash del bloque
        return secp256k1.verify(Buffer.from(messageHash, 'hex'), Buffer.from(block.signature, 'hex'), publicKey);
    }
}

module.exports = Block;
