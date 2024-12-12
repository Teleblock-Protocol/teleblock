const crypto = require('crypto');
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

// Función para generar una llave de sesión aleatoria
function generateSessionKey() {
    return crypto.randomBytes(32); // 256 bits
}

// Función para cifrar el contenido del post
function encryptPost(postContent, sessionKey) {
    const iv = crypto.randomBytes(16); // IV de 16 bytes
    const cipher = crypto.createCipheriv('aes-256-cbc', sessionKey, iv);
    let encrypted = cipher.update(postContent, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return { encrypted, iv: iv.toString('base64') };
}

function signPost(privateKeyHex, postMessage) {
    const keyPair = ec.keyFromPrivate(privateKeyHex);
    const hash = crypto.createHash('sha256').update(postMessage).digest();
    const signature = keyPair.sign(hash);

    // Imprimir valores intermedios
    console.log("Hash del mensaje:", hash.toString('hex'));
    console.log("Firma (r):", signature.r.toString(16).padStart(64, '0'));
    console.log("Firma (s):", signature.s.toString(16).padStart(64, '0'));

    // Crear la firma completa
    const rBuffer = Buffer.from(signature.r.toString(16).padStart(64, '0'), 'hex');
    const sBuffer = Buffer.from(signature.s.toString(16).padStart(64, '0'), 'hex');
    const signatureBuffer = Buffer.concat([rBuffer, sBuffer]);

    console.log("Firma completa (base64):", signatureBuffer.toString('base64'));
    return signatureBuffer.toString('base64');
}

// Procesar argumentos de la línea de comandos
const args = process.argv.slice(2);
const [privateKeyHex, senderAddress, postContent] = args;

if (!privateKeyHex || !senderAddress || !postContent) {
    console.error('Faltan parámetros: privateKeyHex, senderAddress, postContent');
    process.exit(1);
}

// Generar llave de sesión y cifrar contenido
const sessionKey = generateSessionKey();
const { encrypted, iv } = encryptPost(postContent, sessionKey);

// Crear mensaje para firmar (Usando el formato esperado en el nodo)
const postAddress = "0x000000000000000000000000000000000000post";
const postMessage = `${senderAddress}|${postAddress}|${encrypted}`;
const signaturePost = signPost(privateKeyHex, postMessage);

// Resultado
const result = {
    senderAddress,
    encryptedPost: encrypted,
    encrypteIv: iv,
    signaturePost,
    sessionKey: sessionKey.toString('base64') // Solo para descifrar
};

// Imprimir resultado en formato JSON
console.log(JSON.stringify(result));
