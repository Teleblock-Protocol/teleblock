

![Tele_block_negro](https://github.com/user-attachments/assets/9a58f81e-8e5b-4a81-b6e5-97f322fed737)



TeleBlock Protocol

Overview

TeleBlock is a decentralized messaging and digital transaction protocol based on blockchain, designed to provide security, privacy, and censorship resistance. 
This system enables users to send encrypted messages, perform digital coin transfers, and participate as validators to secure the network.

Key Features

Encrypted Messaging: Messages are protected through end-to-end encryption.

Proof-of-Stake (PoS): Efficient validation system based on coin staking.

Dynamic Rewards: Incentives for both validators and users.

Open API: Easy integration for developers.

Censorship Resistance: Decentralized network with distributed nodes.

Project Structure

The repository contains the following main components:

validators Folder

Files for users who wish to operate as validators:

block_validadores.js: Manages blocks and logic for validating new blocks in the blockchain.

blockchain_validadores.js: Implements the blockchain, including validation and block storage.

index_validadores.js: Entry point for setting up and running the validator node.

user_validadores.js: Handles validator data, including staking and rewards.

users Folder

Files for users interacting with the blockchain:

decrypt-message-user.js: Logic for decrypting received messages.

encrypt-deposit-stake-user.js: Functionality for staking coins.

encrypt-make-group-user.js: Creation of encrypted messaging groups.

encrypt-message-user.js: Encrypts messages for sending through the blockchain.

encrypt-transfer-coins-user.js: Facilitates coin transfers between users.

Main File

README.md: General project documentation.

Technical Details

Validator Rewards

Validator rewards are dynamically calculated based on the number of validated blocks and recent network activity. 
This approach incentivizes active participation while controlling inflation.

Related File: block_validadores.js

User Rewards

Users receive native coin rewards for sending messages. Rewards progressively decrease based on recent user activity to ensure economic sustainability.

Related File: encrypt-message-user.js

Security

Encrypted Messages: Using asymmetric cryptography, messages are encrypted with the recipient's public key and can only be decrypted with their private key.

Digital Signatures: Transactions are signed by users to ensure authenticity.

Proof-of-Stake Validation

TeleBlock uses the Proof-of-Stake model to select validators based on the number of staked coins. This eliminates the high energy consumption associated with Proof-of-Work.

Usage Example

Signing a Transaction

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

Installation

Clone the repository:

git clone https://github.com/Teleblock-Protocol/teleblock.git

Navigate to the directory:

cd teleblock

Install dependencies:

npm install

Contributions

TeleBlock is an open-source project. If you want to contribute, fork the repository, make your changes, and submit a pull request. Please follow the contribution guidelines described in the CONTRIBUTING.md file.

License

This project is licensed under the MIT License. See the LICENSE file for more details.

Contact

For questions, issues, or suggestions, you can open an issue on the repository or contact us at support@teleblock.me.
