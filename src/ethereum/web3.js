import Web3 from "web3";
let web3;
console.log(Window.web3);
if (window.web3 !== undefined) {
  web3 = new Web3(window.web3.currentProvider);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/ad38a519efd04371b5e1dc45843d733c"
  );
  web3 = new Web3(provider);
}
export default web3;
