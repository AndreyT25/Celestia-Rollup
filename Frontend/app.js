const ethermint = {
    id: 9000,
    name: 'Ethermint',
    network: 'ethermint',
    nativeCurrency: {
        decimals: 18,
        name: 'Ethermint',
        symbol: 'aphoton',
    },
    rpcUrls: {
        default: {
            http: ['http://207.244.225.191:8545/'],
        },
    },
    testnet: true,
};

async function connectWallet() {
    if (window.ethereum) {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });

            // Set the MetaMask provider
            const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
            window.provider = metamaskProvider;

            return true;
        } catch (error) {
            console.error('User rejected connection or network change:', error);
            return false;
        }
    } else {
        alert('Please install MetaMask or another web3 provider.');
        return false;
    }
}

function displayTransaction(tx) {
    const transactionListElement = document.getElementById('transactionList');
    const transactionElement = document.createElement('div');
    transactionElement.textContent = `Transaction: ${tx.hash}`;
    transactionListElement.appendChild(transactionElement);
}

function displayTransaction1(tx) {
    const transactionListElement = document.getElementById('transactionList1');
    const transactionElement = document.createElement('div');
    transactionElement.textContent = `Transaction: ${tx.transactionHash}`;
    transactionListElement.appendChild(transactionElement);
}

async function pollGameLostEvents(contract, fromBlock) {
    const accounts = await window.provider.listAccounts();
    const eventFilter = contract.filters.GameLost(accounts[0]);
    const events = await contract.queryFilter(eventFilter, fromBlock, 'latest');

    // Filter events based on the user's account
    const userEvents = events.filter(event => event.args && event.args.player === accounts[0]);

    userEvents.forEach((event) => {
        console.log("GameLost event:", event);

        // Display a message when the game is lost
        const messageElement = document.getElementById('message');
        messageElement.textContent = `You lost! The secret number was ${event.args.secretNumber}.`;
        messageElement.classList.remove('won-message');
        messageElement.classList.add('lost-message');
        
        const eventSpinner = document.getElementById('eventSpinner');
        eventSpinner.style.display = 'none';
    });

    return userEvents.length > 0 ? userEvents[userEvents.length - 1].blockNumber + 1 : fromBlock;
}

async function pollGameWonEvents(contract, fromBlock) {
    const accounts = await window.provider.listAccounts();
    const eventFilter = contract.filters.GameWon(accounts[0]);
    const events = await contract.queryFilter(eventFilter, fromBlock, 'latest');

    // Filter events based on the user's account
    const userEvents = events.filter(event => event.args && event.args.winner === accounts[0]);

    userEvents.forEach((event) => {
        console.log("GameWon event:", event);

        // Display a message when the game is won
        const messageElement = document.getElementById('message');
        messageElement.textContent = `You won! The reward is ${ethers.utils.formatEther(event.args.reward)} ETH.`;
        messageElement.classList.remove('lost-message');
        messageElement.classList.add('won-message');
        
        const eventSpinner = document.getElementById('eventSpinner');
        eventSpinner.style.display = 'none';
    });

    return userEvents.length > 0 ? userEvents[userEvents.length - 1].blockNumber + 1 : fromBlock;
}


function startPollingGameWonEvents(contract, fromBlock, interval = 10000) {
    setInterval(async () => {
        fromBlock = await pollGameWonEvents(contract, fromBlock);
    }, interval);
}

function startPollingGameLostEvents(contract, fromBlock, interval = 10000) {
    setInterval(async () => {
        fromBlock = await pollGameLostEvents(contract, fromBlock);
    }, interval);
}

async function loadABI(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load ABI file: ${path}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading ABI:', error);
    }
}

window.addEventListener('load', async () => {
  console.log('Window loaded');

  const abiPath = 'GuessTheNumber.json';
  const abi = await loadABI(abiPath);
  console.log('ABI loaded:', abi);

  const contractAddress = '0x62239de6dffc90171ad557cac328938a9e37f22d';
  
  document.getElementById('message').textContent = '';

  connectWalletBtn.addEventListener('click', async () => {
    const messageElement = document.getElementById('message');
    
    const isConnected = await connectWallet();

    if (isConnected) {
        console.log('Ethereum found');

        await ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.provider.listAccounts();
        console.log('Accounts:', accounts);
        const guessTheNumberContract = new ethers.Contract(contractAddress, abi.abi, window.provider);

        const walletAddressElement = document.getElementById('walletAddress');
        walletAddressElement.textContent = accounts[0];

        // Get the current block number after the user has connected their wallet
        const currentBlock = await window.provider.getBlockNumber();

        startPollingGameWonEvents(guessTheNumberContract, currentBlock);
        startPollingGameLostEvents(guessTheNumberContract, currentBlock);
    } else {
        alert('Please install MetaMask or another web3 provider.');
    }
});

   document.getElementById('claimFreeTokensBtn').addEventListener('click', async () => {
   document.getElementById('spinner2').style.display = 'block';
  console.log('Claim Free Tokens button clicked');
  const tokenReceiverInput = document.getElementById('tokenReceiverInput');
  const recipient = tokenReceiverInput.value;

  if (!recipient || recipient.length !== 42) {
      alert('Please enter a valid Ethereum address.');
      return;
  }
  
  async function requestTokens(recipient, amount) {
  const response = await fetch('http://207.244.225.191:3003/sendTokens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipient, amount }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('Something went wrong!');
  }
}

requestTokens(recipient, "10").then(data => {
    console.log("Transaction successful, receipt:", data.receipt);
    document.getElementById('spinner2').style.display = 'none';
    const tx = data.receipt;
    displayTransaction1(tx);
  }).catch(error => {
    console.error("Error:", error);
    document.getElementById('spinner2').style.display = 'none';
  });
});

document.getElementById('message').textContent = '';

  document.getElementById('startGameBtn').addEventListener('click', async () => {
    const transactionListElement = document.getElementById('transactionList');
    transactionListElement.innerHTML = '';
    const messageElement = document.getElementById('message');
    messageElement.textContent = '';
    document.getElementById('spinner').style.display = 'block';
    const eventSpinner = document.getElementById('eventSpinner');
    eventSpinner.style.display = 'block';
    console.log('Start Game button clicked');

    if (!window.provider || !(await window.provider.listAccounts()).length) {
        alert('Please connect your wallet first.');
        document.getElementById('spinner').style.display = 'none';
        eventSpinner.style.display = 'none';
        return;
    }

    const betAmountInput = document.getElementById('betInput');
    const guessInput1 = document.getElementById('guessInput1');
    const guessInput2 = document.getElementById('guessInput2');
    const guessInput3 = document.getElementById('guessInput3');

    if (betAmountInput.value === "" || guessInput1.value === "" || guessInput2.value === "" || guessInput3.value === "") {
        alert('Please enter a valid bet amount and guesses.');
        document.getElementById('spinner').style.display = 'none';
        eventSpinner.style.display = 'none';
        return;
    }

    const betAmount = ethers.utils.parseEther(betAmountInput.value);
    const guess1 = parseInt(guessInput1.value);
    const guess2 = parseInt(guessInput2.value);
    const guess3 = parseInt(guessInput3.value);

    try {
        const signer = window.provider.getSigner();
        const guessTheNumberContract = new ethers.Contract(contractAddress, abi.abi, signer);
        const nonce = await signer.getTransactionCount();
        const tx = await guessTheNumberContract.startGame(betAmount, guess1, guess2, guess3, {
            value: betAmount,
            gasLimit: 10000000,
            nonce
        });
        
        await tx.wait();
       
        document.getElementById('spinner').style.display = 'none';
        
        

        console.log('Transaction:', tx);
        displayTransaction(tx);
        
    } catch (error) {
        console.error(error);
        document.getElementById('spinner').style.display = 'none';
    }
    betAmountInput.value = '';
    guessInput1.value = '';
    guessInput2.value = '';
    guessInput3.value = '';

 });
});
