# 🗳️ E-Voting Using Blockchain

A secure, transparent, and decentralized electronic voting system leveraging **Blockchain** technology. Built using **Hardhat**, **Solidity**, and **MetaMask**, this project ensures the integrity and privacy of every vote cast.

---

## 🚀 Features

- ✅ Voter Authentication via Wallet
- 🔐 Smart Contract-Driven Voting
- 📊 Real-Time, Tamper-Proof Vote Counting
- 🧾 Immutable Ledger with Blockchain
- 🌐 User-Friendly Web Interface

---

## 🛠️ Tech Stack

| Layer          | Technology                     |
|----------------|--------------------------------|
| Frontend       | HTML, CSS, JavaScript / React  |
| Smart Contract | Solidity                       |
| Blockchain     | Hardhat (Local Ethereum Node)  |
| Wallet         | MetaMask                       |
| Deployment     | Hardhat CLI                    |

---

## 📁 Project Structure
e-voting-blockchain/
├── contracts/ # Solidity Smart Contracts
├── scripts/ # Deployment scripts
├── frontend/ # Frontend code (HTML/CSS/JS or React)
├── test/ # Smart Contract tests
├── hardhat.config.js # Hardhat Configuration
├── package.json # Project Metadata
└── README.md # Documentation

---

## ⚙️ Setup Instructions

### 1. 📦 Install Prerequisites

- [Node.js](https://nodejs.org/)
- [Hardhat](https://hardhat.org/)
- [MetaMask](https://metamask.io/) (Browser extension)

### 2. 🚀 Clone the Repository

```bash
git clone https://github.com/arnav418/E-Voting-using-Blockchain.git
cd main
```
### 3. Install Dependencies
```bash
npm install
```
### 4. ⚙️ Run Local Ethereum Node
```bash
npx hardhat node
```
### 5. Connect MetaMask to Hardhat
- Open MetaMask → Add New Network
- Network Name: Hardhat
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Import one of the private keys shown in the Hardhat node terminal
  
### 6. Deploy Smart Contract 
- Open a new terminal
```bash
npx hardhat run scripts/deploy.js --network localhost
```
### 7. Run the Frontend
- Run Through Live Server in Vs Code.


