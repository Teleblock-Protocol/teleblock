const elliptic = require('elliptic');
const crypto = require('crypto');


const ec = new elliptic.ec('secp256k1');


function deriveSharedSecret(privateKeyHex, publicKeyHex) {
    console.log('Derivando el secreto compartido...');
    const privateKey = ec.keyFromPrivate(privateKeyHex, 'hex');
    const publicKey = ec.keyFromPublic(publicKeyHex, 'hex').getPublic();
    const sharedSecret = privateKey.derive(publicKey);
    const sharedSecretHash = crypto.createHash('sha256').update(sharedSecret.toString(16)).digest().slice(0, 32); 
    console.log('Secreto compartido derivado:', sharedSecretHash.toString('hex'));
    return sharedSecretHash;
}


function decryptSessionKey(sharedSecret, encryptedKeyBase64) {
    console.log('Descifrando la clave de sesión...');
    const encryptedKey = Buffer.from(encryptedKeyBase64, 'base64');
    console.log('Clave cifrada en binario:', encryptedKey.toString('hex'));

    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', sharedSecret, Buffer.alloc(16, 0)); 
        let decryptedKey = decipher.update(encryptedKey, 'base64', 'utf8');
        decryptedKey += decipher.final('utf8');
        console.log('Clave de sesión descifrada:', decryptedKey);
        return decryptedKey;
    } catch (error) {
        console.error('Error al descifrar la clave de sesión:', error.message);
        throw error; 
    }
}


function decryptWithAES(encryptedDataBase64, sessionKey, ivBase64) {
    console.log('Iniciando descifrado AES...');
    console.log('Clave de sesión:', sessionKey);
    console.log('IV en Base64:', ivBase64);

    const encryptedData = Buffer.from(encryptedDataBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');

    console.log('IV en binario:', iv.toString('hex'));

    if (iv.length !== 16) {
        throw new Error('Invalid IV length. IV must be 16 bytes for AES-256-CBC.');
    }

    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(sessionKey, 'hex'), iv);
        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        console.log('Mensaje descifrado exitosamente:', decrypted);
        return decrypted;
    } catch (error) {
        console.error('Error al desencriptar el mensaje:', error.message);
        throw error; 
    }
}

// Main function to decrypt the message
function main() {
    console.log('--- Starting decryption process ---');
    const privateKeyHex = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Private key of the receiver
    const publicKeySenderHex = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Senders public key
    const encryptedKeyBase64 = '/NDwQnDk299a+4eaTH+OPn81aSXG3H3Vsr8ekzpV20WXs0MV0='; // Base64 encrypted session key
    const ivBase64 = 'QxAf0tVRrbyo0K+fGK1Bhg=='; // Unencrypted IV (base64)
    const encryptedMessageBase64 = 'EPiaKc01fxy5Mxvr3uVmq4YMiFLIeJoPtkSDJtNItosZp4fKBHnBQOsUOz'; // Base64 encrypted message

    try {
        // Derivar el secreto compartido
        const sharedSecretReceiver = deriveSharedSecret(privateKeyHex, publicKeySenderHex);

        // Descifrar la clave de sesión
        const sessionKey = decryptSessionKey(sharedSecretReceiver, encryptedKeyBase64);

        // Descifrar el mensaje con AES-256-CBC
        const decryptedMessage = decryptWithAES(encryptedMessageBase64, sessionKey, ivBase64);
        console.log('Mensaje desencriptado:', decryptedMessage);
    } catch (error) {
        console.error('Error al desencriptar el mensaje:', error.message);
    }
}

// Ejecutar la función principal
main();
