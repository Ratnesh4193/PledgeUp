import Web3 from "web3";
const web3 = new Web3(window.web3.currentProvider);
window.addEventListener("load", async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
    } catch (error) {}
  } else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    const provider = new Web3.providers.HttpProvider(
      "https://sepolia.infura.io/v3/ad38a519efd04371b5e1dc45843d733c"
    );
    web3 = new Web3(provider);
  }
});
export default web3;
