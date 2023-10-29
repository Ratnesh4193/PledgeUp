import web3 from "./web3";
import ProjectFactory from "./build/ProjectFactory.json";
console.log("FACTORY.JS Window.web3", window.web3);
const instance = new web3.eth.Contract(
  ProjectFactory.abi,
  process.env.REACT_APP_DEPLOYED_FACTORY_ADDRESS
);

export default instance;
