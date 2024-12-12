const crypto = require('crypto');
const elliptic = require('elliptic');


const ec = new elliptic.ec('secp256k1');


function encryptMessage(sessionKey) {
    const iv = crypto.randomBytes(16); 
    const groupKey = crypto.randomBytes(32).toString('base64'); 
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(sessionKey, 'hex'), iv);
    let encrypted = cipher.update(groupKey, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return { encrypted, iv: iv.toString('base64'), groupKey }; 
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


async function createGroup() {
    const privateKeyHex = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //Private key of the group creator
    const adminAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //Address of the group creator
    const publicKeyAdmin = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; //Group creator public key
    const groupName = 'Blockchain TeleBlock';  //Group Name
 
   
    const sessionKey = crypto.randomBytes(32).toString('hex'); 

   
    const { encrypted: encryptedKey, iv, groupKey } = encryptMessage(sessionKey);

    
    const sharedSecretAdmin = deriveSharedSecret(publicKeyAdmin, privateKeyHex);


    const encryptedKeyGroup = encryptSessionKey(sharedSecretAdmin, sessionKey);

    
    const messageToSign = `${adminAddress}|${groupName}|${encryptedKeyGroup}`;
    const signatureMessage = signMessage(privateKeyHex, messageToSign);

    const result = {
        "groupAddress": adminAddress,  
        "groupName": groupName,
        "adminAddress": adminAddress,
        "encrypteIv": iv,               
        "encryptedKey": encryptedKeyGroup, 
        "signatureMessage": signatureMessage
    };

    console.log('Resultado final:', JSON.stringify(result, null, 2));
}

// Ejecutar la función principal
createGroup().catch(console.error);
