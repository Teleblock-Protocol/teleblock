const elliptic = require('elliptic');
const crypto = require('crypto');


const ec = new elliptic.ec('secp256k1');


function signBurnTransaction(privateKeyHex, senderAddress, burnAmount) {
    console.log('--- Firmando transacción de quema ---');

  // Special direction for burning
    const burnAddress = '0x000000000000000000000000000000000000dead';

   
    const messageToSign = `${senderAddress}:${burnAddress}:${burnAmount.toFixed(8)}`;
    console.log('Mensaje a firmar:', messageToSign);

   
    const keyPair = ec.keyFromPrivate(privateKeyHex, 'hex');

   
    const messageHash = crypto.createHash('sha256').update(messageToSign).digest(); 
    console.log('Hash del mensaje:', messageHash.toString('hex'));

    // Generar la firma
    const signature = keyPair.sign(messageHash);

    // Combinar R y S en formato crudo
    const r = signature.r.toArrayLike(Buffer, 'be', 32);
    const s = signature.s.toArrayLike(Buffer, 'be', 32); 
    const rawSignature = Buffer.concat([r, s]); 

    return rawSignature.toString('base64'); 
}

// Ejemplo de uso
const privateKeyHex = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //Private key of the address to burn
const senderAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Address to burn coins
const burnAmount = 0.001;

try {
    const signature = signBurnTransaction(privateKeyHex, senderAddress, burnAmount);
    console.log('Firma generada (Base64):', signature);

    console.log('--- Parámetros para la transacción ---');
    console.log(`Sender Address: ${senderAddress}`);
    console.log(`Burn Amount: ${burnAmount.toFixed(8)}`);
    console.log(`Signature: ${signature}`);
} catch (error) {
    console.error('Error al firmar la transacción de quema:', error.message);
}
