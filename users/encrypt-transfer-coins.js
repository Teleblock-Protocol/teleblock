const elliptic = require('elliptic');
const crypto = require('crypto');


const EC = elliptic.ec;
const ec = new EC('secp256k1');

async function sha256(message) {
    return crypto.createHash('sha256').update(message).digest();
}


async function signTransaction(privateKeyHex, senderAddress, receiverAddress, amount) {
    console.log('--- Iniciando firma de transacción ---');

    
    if (!/^[0-9a-fA-F]{64}$/.test(privateKeyHex)) {
        throw new Error("La clave privada debe ser un valor hexadecimal de 64 caracteres.");
    }

 
    if (isNaN(amount) || amount <= 0) {
        throw new Error("El monto debe ser un número positivo.");
    }

    const transactionMessage = `${senderAddress}:${receiverAddress}:${amount.toFixed(8)}`;
    console.log('Mensaje a firmar:', transactionMessage);

    try {
    
        const keyPair = ec.keyFromPrivate(privateKeyHex);

        const hash = await sha256(transactionMessage);
        console.log('Hash del mensaje:', hash.toString('hex'));

       
        const signature = keyPair.sign(hash);

       
        const r = signature.r.toString('hex');
        const s = signature.s.toString('hex');

        const rBuffer = new Uint8Array(32);
        const sBuffer = new Uint8Array(32);

        rBuffer.set(Uint8Array.from(r.padStart(64, '0').match(/.{1,2}/g).map(byte => parseInt(byte, 16))));
        sBuffer.set(Uint8Array.from(s.padStart(64, '0').match(/.{1,2}/g).map(byte => parseInt(byte, 16))));

        
        if (rBuffer.length !== 32 || sBuffer.length !== 32) {
            throw new Error('Las partes de la firma r y s no tienen 32 bytes.');
        }

        
        const derSignature = new Uint8Array(64);
        derSignature.set(rBuffer, 0);
        derSignature.set(sBuffer, 32);

        // Convertir la firma a base64
        const signatureBase64 = Buffer.from(derSignature).toString('base64');
        console.log('Firma generada en Base64:', signatureBase64);

        return {
            senderAddress,
            receiverAddress,
            amount: amount.toFixed(8),
            signature: signatureBase64,
        };
    } catch (error) {
        console.error('Error al firmar la transacción:', error.message);
        throw error;
    }
}

// Función para ejecutar la firma
(async () => {
    try {
        
        const privateKeyHex = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Senders private key
        const senderAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //Senders address
        const receiverAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //receiver
        const amount = 2.00000000;

        // Firmar la transacción
        const result = await signTransaction(privateKeyHex, senderAddress, receiverAddress, amount);

        console.log('--- Detalles de la Transacción Firmada ---');
        console.log(`Sender Address: ${result.senderAddress}`);
        console.log(`Receiver Address: ${result.receiverAddress}`);
        console.log(`Amount: ${result.amount}`);
        console.log(`Signature: ${result.signature}`);
    } catch (error) {
        console.error('Error en la firma:', error.message);
    }
})();
