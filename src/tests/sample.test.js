const {ethers} = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const signer = provider.get;

test('Check the result of 5 + 2', () => {
  expect(5 + 2).toBe(7);
});
