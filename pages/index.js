import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, setPassword }) => {
  const [enteredPassword, setEnteredPassword] = useState('');

  const handleConfirm = async () => {
    setPassword(enteredPassword);
    onConfirm();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Action</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={enteredPassword}
          onChange={(e) => setEnteredPassword(e.target.value)}
        />
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [password, setPassword] = useState('');
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [showDepositConfirmation, setShowDepositConfirmation] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts[0]);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts[0]);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      setShowDepositConfirmation(true);
    }
  };

  const withdraw = async () => {
    if (atm) {
      setShowWithdrawConfirmation(true);
    }
  };

  const executeWithdraw = async () => {
    let tx = await atm.withdraw(100); // Updated to withdraw 100 ETH
    await tx.wait();
    getBalance();
  };

  const confirmWithdrawal = async () => {
    setShowWithdrawConfirmation(false);
    const isPasswordCorrect = await checkPassword(password);
    if (isPasswordCorrect) {
      await executeWithdraw();
    } else {
      alert("Incorrect password. Withdrawal canceled.");
    }
  };

  const executeDeposit = async () => {
    let tx = await atm.deposit(100); // Updated to deposit 100 ETH
    await tx.wait();
    getBalance();
  };

  const confirmDeposit = async () => {
    setShowDepositConfirmation(false);
    const isPasswordCorrect = await checkPassword(password);
    if (isPasswordCorrect) {
      await executeDeposit();
    } else {
      alert("Incorrect password. Deposit canceled.");
    }
  };

  const checkPassword = async (enteredPassword) => {
    const correctPassword = "prathap"; // Replace 'prathap' with your actual password
    return enteredPassword === correctPassword;
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 100 ETH</button>
        <button onClick={withdraw}>Withdraw 100 ETH</button>

        <ConfirmationModal
          isOpen={showDepositConfirmation}
          onClose={() => setShowDepositConfirmation(false)}
          onConfirm={confirmDeposit}
          setPassword={setPassword}
        />

        <ConfirmationModal
          isOpen={showWithdrawConfirmation}
          onClose={() => setShowWithdrawConfirmation(false)}
          onConfirm={confirmWithdrawal}
          setPassword={setPassword}
        />
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: navy; // Set background color to navy blue
          color: white; // Set text color to white for better visibility
        }
        /* Add your CSS styles here */
        .modal {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5); // Semi-transparent black overlay
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </main>
  );
}
