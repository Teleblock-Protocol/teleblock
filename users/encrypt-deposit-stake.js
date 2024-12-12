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
    return derSignature.toString('base64'); 
}


async function signStakeDeposit() {
    const privateKeyHexUser = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Private key of the staking user
    const walletAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // User's wallet address
    const stakeAmount = 1;  // Amount of stake to deposit
    const stakeWallet = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // Stake or validator wallet address

    
    const messageToSign = `${walletAddress}|${stakeAmount}|${stakeWallet}`;
    const signatureMessage = signMessage(privateKeyHexUser, messageToSign);

    
    const result = {
        "walletAddress": walletAddress,
        "stakeAmount": stakeAmount,
        "stakeWallet": stakeWallet,
        "signature": signatureMessage
    };

    console.log('Resultado final (firma de depósito de stake):', JSON.stringify(result, null, 2));
}

// Ejecutar la función principal
signStakeDeposit().catch(console.error);
