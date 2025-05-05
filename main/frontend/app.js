const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update with deployed contract address
let contractABI;
let provider;
let signer;
let contract;
let userAddress;
let logoutTimer; // Timer for auto logout

// Load contract ABI
async function loadABI() {
    try {
        const response = await fetch('./ElectionABI.json');
        contractABI = await response.json();
        console.log("✅ ABI Loaded Successfully.");
    } catch (error) {
        console.error("❌ Failed to load ABI:", error);
        alert("Failed to load contract ABI. Check if the file exists.");
    }
}

// Initialize contract
async function initContract() {
    if (!window.ethereum) {
        alert("❌ Please install MetaMask!");
        return;
    }

    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();

        if (!contractABI) {
            await loadABI();
        }

        contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log("✅ Contract Initialized:", contract);

        await checkIfVoted(); // Check if user already voted
        await checkDuplicateLogin(); // Check for duplicate login attempt
    } catch (error) {
        console.error("❌ Contract initialization error:", error);
        alert("Failed to initialize contract. Check console for details.");
    }
}

// Connect wallet and initialize contract
async function connectWallet() {
    await initContract();
    if (contract) {
        console.log("✅ Connected to wallet successfully.");
        document.getElementById("walletAddress").innerText = `Current-Wallet-Address: ${userAddress}`;
        await loadCandidates();

        // Start the auto-logout timer (5 minutes)
        startLogoutTimer(1 * 60);
    }
}

// Load Candidates & Check if user has voted
async function loadCandidates() {
    try {
        const candidateCountBN = await contract.candidatesCount();
        const candidateCount = candidateCountBN.toNumber(); // Convert BigNumber to integer
        const candidatesList = document.getElementById("candidatesList");
        candidatesList.innerHTML = "";

        for (let i = 1; i <= candidateCount; i++) {
            const candidate = await contract.candidates(i);
            const li = document.createElement("li");

            li.innerHTML = `${candidate.name} 
                <button id="voteBtn${candidate.id.toNumber()}" onclick="vote(${candidate.id.toNumber()})">Vote</button>`;

            candidatesList.appendChild(li);
        }

        await checkIfVoted(); // Disable vote button if user has already voted
    } catch (error) {
        console.error("❌ Error loading candidates:", error);
        alert("Failed to load candidates. Make sure the contract is deployed correctly.");
    }
}

// ✅ Check if user has already voted
async function checkIfVoted() {
    try {
        const hasVoted = await contract.hasUserVoted(userAddress); // ✅ Updated function name
        if (hasVoted) {
            document.querySelectorAll("button[id^='voteBtn']").forEach(button => {
                button.disabled = true;
                button.innerText = "Already Voted";
                button.style.background = "#aaa";
            });
            console.log("⚠️ User has already voted.");
        }
    } catch (error) {
        console.error("❌ Error checking vote status:", error);
    }
}

// ✅ Check if user attempts to log in again
async function checkDuplicateLogin() {
    try {
        const hasVoted = await contract.hasUserVoted(userAddress);
        if (hasVoted) {
            await contract.logDuplicateLogin(userAddress);
            console.warn("⚠️ Duplicate login attempt recorded for:", userAddress);
        }
    } catch (error) {
        console.error("❌ Error logging duplicate login:", error);
    }
}

// Vote for a candidate
async function vote(candidateId) {
    if (!contract) {
        alert("❌ Contract not initialized properly.");
        return;
    }

    try {
        console.log(`🗳️ Voting for candidate ID: ${candidateId}...`);
        const button = document.getElementById(`voteBtn${candidateId}`);
        if (button) {
            button.innerText = "Voting...";
            button.disabled = true;
        }

        const tx = await contract.vote(candidateId);
        await tx.wait(); // Wait for the transaction to be mined

        alert("✅ Vote cast successfully!");
        
        // Stop timer and log out immediately
        clearInterval(logoutTimer);
        logout();
    } catch (error) {
        console.error("❌ Error voting:", error);
        alert("Failed to cast vote. Check console for details.");
    }
}

// ✅ Implement Voting Timer (Auto Logout)
function startLogoutTimer(durationInSeconds) {
    let timeLeft = durationInSeconds;

    if (logoutTimer) {
        clearInterval(logoutTimer);
    }

    updateTimerDisplay(timeLeft);

    logoutTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(logoutTimer);
            alert("⏳ Time's up! You have been logged out.");
            logout();
        }
    }, 1000);
}

// ✅ Update Timer Display
function updateTimerDisplay(timeLeft) {
    const timerElement = document.getElementById("timerDisplay");
    if (timerElement) {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerElement.innerText = `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
}

// Logout function
async function logout() {
    alert("✅ You have been logged out!");
    clearInterval(logoutTimer);
    window.location.href = "/auth.html"; // Redirect to login page
}

// Attach event listeners
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("logoutBtn").addEventListener("click", logout);

// Load ABI before initializing
loadABI();
