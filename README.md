

![Tele_block_negro_blanco](https://github.com/user-attachments/assets/7318ae8e-0e32-48c7-9aa2-d9a836efae18)



# TeleBlock Protocol

## Overview
TeleBlock is a decentralized messaging and digital transaction protocol based on blockchain, designed to provide security, privacy, and censorship resistance. This system enables users to send encrypted messages, perform digital coin transfers, and participate as validators to secure the network.

## Key Features
- **Encrypted Messaging**: Messages are protected through end-to-end encryption.
- **Proof-of-Stake (PoS)**: Efficient validation system based on coin staking.
- **Dynamic Rewards**: Incentives for both validators and users.
- **Open API**: Easy integration for developers.
- **Censorship Resistance**: Decentralized network with distributed nodes.

## Project Structure
The repository contains the following main components:

### validators Folder
Files for users who wish to operate as validators:
- `block_validadores.js`: Manages blocks and logic for validating new blocks in the blockchain.
- `blockchain_validadores.js`: Implements the blockchain, including validation and block storage.
- `index_validadores.js`: Entry point for setting up and running the validator node.
- `user_validadores.js`: Handles validator data, including staking and rewards.

### users Folder
Files for users interacting with the blockchain:
- `decrypt-message-user.js`: Logic for decrypting received messages.
- `encrypt-deposit-stake-user.js`: Functionality for staking coins.
- `encrypt-make-group-user.js`: Creation of encrypted messaging groups.
- `encrypt-message-user.js`: Encrypts messages for sending through the blockchain.
- `encrypt-transfer-coins-user.js`: Facilitates coin transfers between users.

### Main File
- `README.md`: General project documentation.

## Technical Details

### Validator Rewards
Validator rewards are dynamically calculated based on the number of validated blocks and recent network activity. This approach incentivizes active participation while controlling inflation.

Related File: `block_validadores.js`

### User Rewards
Users receive native coin rewards for sending messages. Rewards progressively decrease based on recent user activity to ensure economic sustainability.

Related File: `encrypt-message-user.js`

### Security
- **Encrypted Messages**: Using asymmetric cryptography, messages are encrypted with the recipient's public key and can only be decrypted with their private key.
- **Digital Signatures**: Transactions are signed by users to ensure authenticity.

### Proof-of-Stake Validation
TeleBlock uses the Proof-of-Stake model to select validators based on the number of staked coins. This eliminates the high energy consumption associated with Proof-of-Work.

## Installation

1. **Clone the repository**:
bash
   git clone https://github.com/Teleblock-Protocol/teleblock.git

cd teleblock
npm install



### What to do with this content?

1. **Copy all the content** from # TeleBlock Protocol to mailto:support@mail.teleblock.net.
2. **Paste the content** into a file named README.md in your GitHub repository, or any .md file you prefer.
3. **Save the changes**, and GitHub will automatically render this file with the correct format when you access the repository.

With this, you will have the complete documentation, including installation, usage, contributions, license, and contact in your README.md file.

## Contact

For questions, issues, or suggestions, you can open an issue on the repository or contact us at [support@mail.teleblock.net](mailto:support@mail.teleblock.net).
 



# TeleBlock API Documentation

Esta documentación detalla los endpoints disponibles en la API de TeleBlock para desarrolladores.

---

## Endpoints Disponibles

### **POST** `/registerUser`
Registra un nuevo usuario en el sistema.

#### **Request Body**:
```json
{
    "name": "User"
}
```

#### **Response**:
```json
{
    "success": true,
    "user": {
        "walletAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "publicKey": "04xxxxxxxxxxxxxxxxxxxxxxxxxxxeeee2c3exxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1",
        "privateKey": "2xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "balance": "0.00000000",
        "mnemonic": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

---

### **POST** `/sendMessage`
Envía un mensaje cifrado a otro usuario.

#### **Request Body**:
```json
{
  "senderAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "receiverAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "encryptedMessage": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "encrypteIv": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "encryptedKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "encryptedKeyForSender": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "signatureMessage": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

#### **Response**:
```json
{
    "success": true,
    "message": "Message sent successfully and reward received: Message sent and added to the blockchain. Sender reward: 0.0001101, Validator reward: 0.0042525",
    "hash": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

---

### **POST** `/sendMessageToGroup`
Envía un mensaje cifrado a un grupo.

#### **Request Body**:
```json
{
  "senderAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "groupAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "encryptedMessage": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "encryptedKeys": {
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  },
  "encrypteIv": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "signatureMessage": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

---

### **POST** `/transferCoins`
Transfiere monedas entre usuarios.

#### **Request Body**:
```json
{
  "senderAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "receiverAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "amount": 0.04000000,
  "signature": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

#### **Response**:
```json
{
    "success": true,
    "message": "Transaction completed and block added to the blockchain",
    "block": {
        "index": 1236,
        "timestamp": 1733971344475,
        "data": {
            "type": "transfer",
            "sender": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "recipient": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "amount": "0.04000000",
            "signature": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "validator": {
                "address": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "stake": 295.6675,
                "host": "xxxxxxxxxxxxxxxxxxxx"
            },
            "validatorReward": 0.055
        },
        "previousHash": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "hash": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

---

### **POST** `/burnCoins`
Quema una cantidad específica de monedas.

#### **Request Body**:
```json
{
  "senderAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "amount": 0.00100000,
  "signature": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

#### **Response**:
```json
{
    "success": true,
    "message": "Burning completed and block added to the blockchain.",
    "block": {
        "index": 1234,
        "timestamp": 1733970596296,
        "data": {
            "type": "burn",
            "sender": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "recipient": "0x000000000000000000000000000000000000dead",
            "amount": "0.00100000",
            "signature": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "validator": {
                "address": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "stake": 295.5575,
                "host": "xxxxxxxxxxxxxxxxxxxx"
            },
            "validatorReward": 0.055
        },
        "previousHash": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "hash": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

---

### **POST** `/sendPost`
Envía un post cifrado a la blockchain.

#### **Request Body**:
```json
{
  "senderAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "encryptedPost": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "encryptedKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "encrypteIv": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "signatureMessage": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

---

### **GET** `/getuser/:walletAddress`
Obtiene la información de un usuario por su dirección de wallet.

#### **Response**:
```json
{
    "success": true,
    "user": {
        "walletAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "name": "xxxxxxxx",
        "publicKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "balance": "1.35166139"
    }
}
```

---

### **GET** `/getmessagesbetween/:senderAddress/:receiverAddress`
Obtiene los mensajes entre dos direcciones.

---

### **GET** `/getValidators`
Obtiene la lista de validadores.

#### **Response**:
```json
{
    "success": true,
    "validators": [
        {
            "address": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "ip": "xxxxxxxxxxxxxxxxxxxx",
            "stake": "859.07500000"
        },
        {
            "address": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "ip": "xxxxxxxxxxxxxxxxxxxx",
            "stake": "347.30250000"
        }
    ]
}
```

---

### **GET** `/getLastBlocks`
Obtiene los últimos bloques.

#### **Response**:
```json
{
    "success": true,
    "blocks": [
        {
            "index": 2648,
            "timestamp": 1736028677919,
            "data": {
                "type": "burn",
                "sender": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "recipient": "0x000000000000000000000000000000000000dead",
                "amount": "0.00010000",
                "signature": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "validator": {
                    "address": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                    "stake": 357.4275,
                    "host": "xxxxxxxxxxxxxxxxxxxx"
                },
                "validatorReward": 0.045
            },
            "previousHash": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "hash": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        }
    ]
}
```

---

### **GET** `/getValidator/:walletAddress`
Obtiene la información de un validador por su dirección de wallet.

#### **Response**:
```json
{
    "success": true,
    "validator": {
        "walletAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "stake": "359.16054000"
    }
}
```

---

### **POST** `/createGroup`
Crea un nuevo grupo.

#### **Request Body**:
```json
{
  "groupAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "groupName": "Blockchain TeleBlock",
  "adminAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "encrypteIv": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "encryptedKey": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "signatureMessage": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

---

### **POST** `/addMemberToGroup`
Añade un miembro a un grupo existente.

#### **Request Body**:
```json
{
  "adminAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "groupAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "memberAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "signatureMessage": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

---

### **POST** `/unstake`
Retira el stake de un validador.

#### **Request Body**:
```json
{
  "stakeWallet": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "stakeAmount": 859,
  "walletAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "signature": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

#### **Response**:
```json
{
    "success": true,
    "message": "Stake retirado exitosamente. Nuevo balance: 959.46",
    "block": {
        "index": 2408,
        "timestamp": 1735451111172,
        "data": {
            "type": "unstake",
            "walletAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "stakeAmount": "859.00000000",
            "stakeWallet": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "validator": {
                "address": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "stake": 347.3025,
                "host": "xxxxxxxxxxxxxxxxxxxx"
            },
            "validatorReward": 0.045,
            "newStake": "0.07500000"
        },
        "previousHash": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "hash": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```

---

### **POST** `/stake`
Añade un stake al sistema.

#### **Request Body**:
```json
{
  "walletAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "stakeAmount": 1,
  "stakeWallet": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "signature": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

---

### **POST** `/addAdminToGroup`
Añade un administrador a un grupo existente.

#### **Request Body**:
```json
{
  "adminAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "groupAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "newAdminAddress": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "signatureMessage": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## Usage Example

### Signing a Transaction

```javascript
(async () => {
    try {
        const privateKeyHex = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        const senderAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        const receiverAddress = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        const amount = 2.00000000;

        const result = await signTransaction(privateKeyHex, senderAddress, receiverAddress, amount);

        console.log(`Sender Address: ${result.senderAddress}`);
        console.log(`Receiver Address: ${result.receiverAddress}`);
        console.log(`Amount: ${result.amount}`);
        console.log(`Signature: ${result.signature}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();

```

