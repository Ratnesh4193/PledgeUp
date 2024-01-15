const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const compiledFactory = require("./build/ProjectFactory.json");

let provider = new HDWalletProvider({
  mnemonic: {
    phrase:
      "foot push oblige assault play ladder spirit spy month fire tennis box",
  },
  providerOrUrl:
    "https://sepolia.infura.io/v3/ad38a519efd04371b5e1dc45843d733c",
  chainId: 42,
});

// const web3 = new Web3(provider);

// const deploy = async () => {
//   const accounts = await web3.eth.getAccounts();

//   console.log('Attempting to deploy from account', accounts[0]);

//   const result = await new web3.eth.Contract(
//     JSON.parse(compiledFactory.interface)
//   )
//     .deploy({ data: compiledFactory.bytecode })
//     .send({ gas: '1400000', from: accounts[0] });

//   console.log('Contract deployed to', result.options.address);
//   provider.engine.stop();
// };
// deploy();
