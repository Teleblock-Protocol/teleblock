const crypto = require('crypto');
const elliptic = require('elliptic');


const ec = new elliptic.ec('secp256k1');


const groupIv = crypto.randomBytes(16); 

function encryptMessage(message, sessionKey) {
    const iv = Buffer.from(groupIv, 'base64'); 
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(sessionKey, 'hex'), iv);
    let encrypted = cipher.update(message, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return { encryptedMessage: encrypted, iv: groupIv }; 
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


function deriveSharedSecret(publicKeyMemberHex, privateKeySenderHex) {
    const publicKey = ec.keyFromPublic(publicKeyMemberHex, 'hex').getPublic();
    const privateKey = ec.keyFromPrivate(privateKeySenderHex, 'hex');
    const sharedSecret = privateKey.derive(publicKey);  
    return crypto.createHash('sha256').update(sharedSecret.toString(16)).digest().slice(0, 32); 
}


function encryptSessionKey(sharedSecret, sessionKey) {
    const cipher = crypto.createCipheriv('aes-256-cbc', sharedSecret, Buffer.alloc(16, 0)); 
    let encryptedKey = cipher.update(sessionKey, 'utf8', 'base64');
    encryptedKey += cipher.final('base64');
    return encryptedKey;
}


async function sendMessageToGroup() {
    const privateKeyHex = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Sender's private key
    const senderAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Sender address
    const groupAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Group address
    const membersPublicKeys = [
        { address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', publicKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' }, // Public keys and sender addresses
      
        
    ]; 
    const message = 'Este es un mensaje cifrado para el grupo Blockchain TeleBlock.'; // Message to send

   
    const sessionKey = crypto.randomBytes(32).toString('hex');

    
    const { encryptedMessage } = encryptMessage(message, sessionKey);

    const encryptedKeys = {};

    // Cifrar la clave de sesión para cada miembro del grupo
    for (const member of membersPublicKeys) {
        const sharedSecret = deriveSharedSecret(member.publicKey, privateKeyHex); 
        const encryptedKey = encryptSessionKey(sharedSecret, sessionKey); 
        encryptedKeys[member.address] = encryptedKey; 
    }

    // Firmar el mensaje
    const messageToSign = `${senderAddress}|${groupAddress}|${encryptedMessage}`;
    const signatureMessage = signMessage(privateKeyHex, messageToSign);

    
    const result = {
        "senderAddress": senderAddress,  
        "groupAddress": groupAddress,    
        "encryptedMessage": encryptedMessage,  
        "encryptedKeys": encryptedKeys,
        "encrypteIv": groupIv,               
        "signatureMessage": signatureMessage 
    };

    console.log('Mensaje cifrado para el grupo:', JSON.stringify(result, null, 2));

    return result;
}

// Ejecutar la función principal para enviar el mensaje
sendMessageToGroup().catch(console.error);
