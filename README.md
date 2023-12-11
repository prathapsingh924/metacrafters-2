# Metacrafters ATM React App

## Overview

Welcome to the Metacrafters ATM React app! This application allows users to interact with a smart contract deployed on the Ethereum blockchain using the MetaMask wallet. Users can connect their MetaMask wallet, view their account balance, deposit and withdraw funds, and confirm transactions with a password.

## Getting Started

To run the app locally, follow these steps:

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/


## Usage

### Connecting MetaMask Wallet

1. Make sure you have the MetaMask extension installed in your browser.

2. Click the "Connect your Metamask wallet" button to connect your MetaMask wallet to the app.

### Viewing Account Information

- Once connected, you can view your Ethereum account address and current balance on the main screen.

### Depositing Funds

- Click the "Deposit 100 ETH" button to initiate a deposit of 100 ETH. Confirm the transaction with your MetaMask wallet.

- A confirmation modal will appear, asking you to enter your password to proceed with the deposit. Enter your password and click "Confirm" to complete the transaction.

### Withdrawing Funds

- Click the "Withdraw 100 ETH" button to initiate a withdrawal of 100 ETH. Confirm the transaction with your MetaMask wallet.

- A confirmation modal will appear, asking you to enter your password to proceed with the withdrawal. Enter your password and click "Confirm" to complete the transaction.

### Password Confirmation

- For both deposit and withdrawal transactions, a password confirmation modal will appear. Enter your password and click "Confirm" to proceed with the transaction. If the password is incorrect, the transaction will be canceled.

## Additional Information

- The smart contract address and ABI (Application Binary Interface) are predefined in the code. Update them if necessary.

- Make sure to replace the placeholder password "prathap" with your actual password in the `checkPassword` function.

- The app uses the [ethers.js](https://docs.ethers.io/v5/) library to interact with the Ethereum blockchain.

## Dependencies

- React
- ethers.js
- MetaMask

## Author 

Prathap Singh

p19982102@gmail.com
