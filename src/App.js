import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);

function TransactionReceipt({ txHash, isVisible }) {
  const [tx, setTx] = useState(null);

  useEffect(() => {
    async function getTransaction() {
      const txData = await alchemy.core.getTransactionReceipt(txHash);
      setTx(txData);
    }

    if (txHash && isVisible) {
      getTransaction();
    }
  }, [txHash, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="transaction-receipt">
      <p>Transaction Hash: {txHash}</p>
      {tx ? (
        <>
          <p>To Address: {tx.to}</p>
          <p>From Address: {tx.from}</p>
          <p>Contract Created?: {tx.contractAddress}</p>
          <p>Gas Used: {tx.gasUsed.toString()}</p>
          <p>Value: {tx.effectiveGasPrice.toString()}</p>
        </>
      ) : (
        <p>Loading transaction data...</p>
      )}
    </div>
  );
}

function TransactionList({ transactions }) {
  const [expandedTx, setExpandedTx] = useState(null);

  const toggleExpand = (txHash) => {
    if (expandedTx === txHash) {
      setExpandedTx(null);
    } else {
      setExpandedTx(txHash);
    }
  };
  return (
    <ul>
      {transactions.map((tx, index) => (
        <li key={index}>
          <span onClick={() => toggleExpand(tx)}>Transaction Hash: {tx}</span>
          <TransactionReceipt txHash={tx} isVisible={expandedTx === tx} />
        </li>
      ))}
    </ul>
  );
}

function BlockAttributes({ blockNumber }) {
  const [block, setBlock] = useState(null);

  useEffect(() => {
    async function getBlock() {
      const blockData = await alchemy.core.getBlock(blockNumber);
      setBlock(blockData);
    }

    if (blockNumber) {
      getBlock();
    }
  }, [blockNumber]);

  return (
    <div>
      <p>Block Number: {blockNumber}</p>
      {block ? (
        <>
          <p>Hash: {block.hash}</p>
          <p>Parent Hash: {block.parentHash}</p>
          <p>Timestamp: {block.timestamp}</p>
          <p>Number of Transactions: {block.transactions.length}</p>
          <h3>Transactions:</h3>
          <TransactionList transactions={block.transactions} />
        </>
      ) : (
        <p>Loading block data...</p>
      )}
    </div>
  );
}

function App() {
  const [blockNumber, setBlockNumber] = useState(null);

  useEffect(() => {
    async function getBlockNumber() {
      const latestBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(latestBlockNumber);
    }

    getBlockNumber();
  }, []);

  return (
    <div className="App">
      <h1>The Latest Block Number: {blockNumber}</h1>
      <h2>Block Attributes</h2>
      <BlockAttributes blockNumber={blockNumber} />
    </div>
  );
}

export default App;
