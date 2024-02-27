require("dotenv").config();
const ethers = require("ethers");

const NUM_TESTS = 10;

const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const RPC_URL =
  process.env.RPC_URL ?? `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;
const ARBITRUM_USDC_ADDRESS = "0xaf88d065e77c8cc2239327c5edb3a432268e5831";
const ARBITRUM_CHAIN_ID = 42161;

(async () => {
  // Set up.
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const usdcIntf = new ethers.Interface([
    "function totalSupply() external view returns (uint256)",
    "event Transfer(address,address,uint256)",
  ]);
  const usdc = new ethers.Contract(ARBITRUM_USDC_ADDRESS, usdcIntf, provider);
  const latestBlock = await provider.getBlockNumber("latest");

  // Sanity check with a test function call.
  const totalSupply = await usdc.totalSupply();
  console.log({ totalSupply: totalSupply.toString() });

  // Run a few timing tests.
  const timingResults = [];
  const dataResults = [];
  let timingSum = 0;
  for (let i = 0; i < NUM_TESTS; i++) {
    const start = Date.now();

    // Do the thing being timed.
    //
    // Here we query random USDC transfers from Arbitrum.
    // We want to pick a block range that typically results in a non-zero
    // number of logs, but not too many logs.
    const BLOCK_RANGE = 100;
    const logs = await queryRandomUsdcTransfers(usdc, latestBlock, BLOCK_RANGE);
    dataResults.push(logs.length);

    const timeElapsed = Date.now() - start;
    timingResults.push(timeElapsed);
    timingSum += timeElapsed;
  }

  // Print out results.
  const averageTime = timingSum / timingResults.length;
  console.log(`Data: [${dataResults}]`);
  console.log(`Times: [${timingResults}]`);
  console.log(`Average time: ${averageTime.toFixed(2)} ms`);
})().catch(console.error);

async function queryRandomUsdcTransfers(usdc, latestBlock, blockRange) {
  const fromBlock = Math.floor(Math.random() * (latestBlock - blockRange));
  const toBlock = fromBlock + blockRange;
  const filter = usdc.filters.Transfer();
  const logs = await usdc.queryFilter(filter, fromBlock, toBlock);
  return logs;
}
