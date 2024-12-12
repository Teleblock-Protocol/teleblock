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


async function signStakeWithdrawal() {
    const privateKeyHexStake = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // Private key of the stake/validator account
    const stakeWallet = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // Stake or validator wallet address
    const walletAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';  // Address of the user requesting the withdrawal
    const stakeAmount = 100.5;  // Amount of stake to withdraw

   
    const messageToSign = `${stakeWallet}|${stakeAmount}|${walletAddress}`;
    const signatureMessage = signMessage(privateKeyHexStake, messageToSign);

    const result = {
        "stakeWallet": stakeWallet,  
        "stakeAmount": stakeAmount,
        "walletAddress": walletAddress,  
        "signature": signatureMessage
    };

    console.log('Resultado final (firma de retiro de stake):', JSON.stringify(result, null, 2));
}

// Ejecutar la función principal
signStakeWithdrawal().catch(console.error);
