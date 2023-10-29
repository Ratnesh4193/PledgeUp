import web3 from "./web3Default";
import ProjectFactory from "./build/ProjectFactory.json";

console.log(process.env.REACT_APP_DEPLOYED_FACTORY_ADDRESS);
const instance = new web3.eth.Contract(
  ProjectFactory.abi,
  process.env.REACT_APP_DEPLOYED_FACTORY_ADDRESS
);

export default instance;
