const elliptic = require('elliptic');
const crypto = require('crypto');


const ec = new elliptic.ec('secp256k1');


function encryptMessage(message, sessionKey) {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv('aes-256-cbc', sessionKey, iv);
    let encrypted = cipher.update(message, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return { encrypted, iv: iv.toString('base64') }; 
}


function signMessage(privateKeyHex, message) {
    const keyPair = ec.keyFromPrivate(privateKeyHex);
    const hash = crypto.createHash('sha256').update(message).digest();
    const signature = keyPair.sign(hash);
    const r = signature.r.toString('hex').padStart(64, '0');
    const s = signature.s.toString('hex').padStart(64, '0');
    const derSignature = Buffer.concat([Buffer.from(r, 'hex'), Buffer.from(s, 'hex')]);
    return derSignature.toString('base64'); // Firma en base64
}


function deriveSharedSecret(publicKeyHex, privateKeyHex) {
    const publicKey = ec.keyFromPublic(publicKeyHex, 'hex').getPublic();
    const privateKey = ec.keyFromPrivate(privateKeyHex, 'hex');
    const sharedSecret = privateKey.derive(publicKey); 
    return crypto.createHash('sha256').update(sharedSecret.toString(16)).digest().slice(0, 32); 
}

function encryptSessionKey(sharedSecret, sessionKey) {
    const cipher = crypto.createCipheriv('aes-256-cbc', sharedSecret, Buffer.alloc(16, 0)); 
    let encryptedKey = cipher.update(sessionKey, 'utf8', 'base64');
    encryptedKey += cipher.final('base64');
    return encryptedKey;
}

// Función principal
async function main() {
    const privateKeyHex = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //Private key of the message creator
    const senderAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //Address of the message creator
    const publicKeySender = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //Public key of the message creator
    const publicKeyReceiver = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';//Public key who receives the message
    const receiverAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  //Address that receives the message
    const messageContent = 'Welcome to Teleblock.';

    // Generar una clave de sesión aleatoria
    const sessionKey = crypto.randomBytes(32).toString('hex'); // Clave de 256 bits para AES

    // Cifrar el mensaje con AES usando la clave de sesión
    const { encrypted: encryptedMessage, iv } = encryptMessage(messageContent, Buffer.from(sessionKey, 'hex'));

    // Firmar el mensaje cifrado
    const transactionMessage = `${senderAddress}|${receiverAddress}|${encryptedMessage}`;
    const signatureMessage = signMessage(privateKeyHex, transactionMessage);

    // Derivar el secreto compartido para el receptor
    const sharedSecretReceiver = deriveSharedSecret(publicKeyReceiver, privateKeyHex);

    // Cifrar la clave de sesión para el receptor
    const encryptedKeyReceiver = encryptSessionKey(sharedSecretReceiver, sessionKey);

    // Derivar el secreto compartido para el remitente
    const sharedSecretSender = deriveSharedSecret(publicKeySender, privateKeyHex);

    // Cifrar la clave de sesión para el remitente
    const encryptedKeySender = encryptSessionKey(sharedSecretSender, sessionKey);

    console.log('Mensaje cifrado:', encryptedMessage);
    console.log('IV:', iv);
    console.log('Clave de sesión cifrada para el receptor:', encryptedKeyReceiver);
    console.log('Clave de sesión cifrada para el remitente:', encryptedKeySender);
    console.log('Firma del mensaje:', signatureMessage);

    // Mostrar resultados
    const result = {
        "senderAddress": senderAddress,
        "receiverAddress": receiverAddress,
        "encryptedMessage": encryptedMessage,
        "encrypteIv": iv,
        "encryptedKey": encryptedKeyReceiver,
        "encryptedKeyForSender": encryptedKeySender,
        "signatureMessage": signatureMessage
    };

    console.log('Resultado final:', JSON.stringify(result, null, 2));
}

// Ejecutar la función principal
main().catch(console.error);


