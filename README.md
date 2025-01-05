

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

javascript
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

