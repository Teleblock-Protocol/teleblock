const crypto = require('crypto');
const elliptic = require('elliptic');


const ec = new elliptic.ec('secp256k1');


function signMessage(privateKeyHex, message) {
    const keyPair = ec.keyFromPrivate(privateKeyHex);
    const hash = crypto.createHash('sha256').update(message).digest();
    const signature = keyPair.sign(hash);
    const r = signature.r.toString('hex').padStart(64, '0');
    const s = signature.s.toString('hex').padStart(64, '0');
    const derSignature = Buffer.concat([Buffer.from(r, 'hex'), Buffer.from(s, 'hex')]);
    return derSignature.toString('base64'); // Firma en base64
}


async function updateMemberToAdmin() {
    const privateKeyHexAdmin = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // Admins private key
    const adminAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // Admin address

    const memberAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // Address of the member who will become an administrator
    const groupAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // Group address

    
    if (groupAddress === memberAddress) {
        console.error('Error: Las direcciones de grupo y miembro no pueden ser iguales.');
        return;
    }

    
    const messageToSign = `${groupAddress}|${memberAddress}|${adminAddress}`;
    const signatureMessage = signMessage(privateKeyHexAdmin, messageToSign);

    const result = {
        "adminAddress": adminAddress,  
        "groupAddress": groupAddress,
        "newAdminAddress": memberAddress,
        "signatureMessage": signatureMessage,
       
    };

    console.log('Resultado final (actualizar a administrador):', JSON.stringify(result, null, 2));
}

// Ejecutar la función principal
updateMemberToAdmin().catch(console.error);
