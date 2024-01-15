import Web3 from "web3";
let web3;
if (window.web3 !== undefined) {
  console.log("MetaMask Account present");
  web3 = new Web3(window.web3.currentProvider);
} else {
  const provider = new Web3.providers.HttpProvider(
    process.env.REACT_APP_SEPOLIA
  );
  web3 = new Web3(provider);
  console.log("No MetaMask Account present. Please install metamask.");
  console.log(process.env.REACT_APP_SEPOLIA);
  console.log(web3);
}
export default web3;
