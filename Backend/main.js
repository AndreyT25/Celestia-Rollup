const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("YOUR PROVIDER URL");
const web3 = new Web3(provider);

const sender = "WALLET ADDRESS";
const privateKey = "YOUR PRIVATE KEY";

async function sendTestTokens(recipient, amount) {
  const nonce = await web3.eth.getTransactionCount(sender);
  const gasPrice = await web3.eth.getGasPrice();
  const txParams = {
    to: recipient,
    value: web3.utils.toWei(amount, 'ether'),
    gas: 21000,
    gasPrice: gasPrice,
    nonce: nonce
  };

  const signedTx = await web3.eth.accounts.signTransaction(txParams, privateKey);
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return txReceipt;
}

sendTestTokens("0x8B8224AF3E73B2006F902ecd7f909A5977E1aC93", "10").then(txReceipt => {
  console.log("Transaction successful, receipt:", txReceipt);
}).catch(error => {
  console.error("Error:", error);
});

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post('/sendTokens', async (req, res) => {
  const recipient = req.body.recipient;
  const amount = req.body.amount;

  try {
    const txReceipt = await sendTestTokens(recipient, amount);
    res.json({ success: true, receipt: txReceipt });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
  }
});

app.listen(3003, () => {
  console.log('API server listening on port 3003');
});
