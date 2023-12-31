const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../src/ethereum/build/ProjectFactory.json");
const compiledProject = require("../src/ethereum/build/Project.json");

let accounts;
let factory;
let projectAddress;
let project;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "10000000" });

  await factory.methods
    .createProject(
      "title",
      100,
      1000,
      "description",
      "targetDate",
      "imageLink",
      "category1"
    )
    .send({
      from: accounts[0],
      gas: "10000000 ",
    });

  const newProject = await factory.methods.getDeployedProjects().call();
  projectAddress = newProject[0]["projectAddress"];
  project = await new web3.eth.Contract(compiledProject.abi, projectAddress);
});

describe("Projects", () => {
  it("deploys a factory and a project", async () => {
    assert.ok(factory.options.address);
    assert.ok(project.options.address);
    const data = await factory.methods.deployedProjects(0).call();
  });
  // it("marks caller as the project manager", async () => {
  //   const manager = await project.methods.manager().call();
  //   assert.equal(accounts[0], manager);
  // });
  // it("allows people to contribute money and marks them as approvers", async () => {
  //   await project.methods.contribute().send({
  //     value: "200",
  //     from: accounts[1],
  //     gas: "10000000 ",
  //   });
  //   const isContributor = await project.methods.backers(accounts[1]).call();
  //   assert(isContributor);
  // });
  // it("requires a minimum contribution", async () => {
  //   try {
  //     await project.methods.contribute().send({
  //       value: "5",
  //       from: accounts[1],
  //       gas: "10000000 ",
  //     });
  //     assert(false);
  //   } catch (err) {
  //     assert(err);
  //   }
  // });
  // it("allows a manager to make a payment request", async () => {
  //   await project.methods
  //     .createRequest("Buy batteries", "100", accounts[1])
  //     .send({
  //       from: accounts[0],
  //       gas: "10000000 ",
  //     });
  //   const request = await project.methods.requests(0).call();
  //   assert.equal("Buy batteries", request.description);
  // });
  // it("processes requests", async () => {
  //   await project.methods.contribute().send({
  //     from: accounts[0],
  //     value: web3.utils.toWei("10", "ether"),
  //     gas: "10000000 ",
  //   });
  //   await project.methods
  //     .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
  //     .send({ from: accounts[0], gas: "10000000 " });
  //   await project.methods.approveRequest(0).send({
  //     from: accounts[0],
  //     gas: "10000000 ",
  //   });
  //   await project.methods.finalizeRequest(0).send({
  //     from: accounts[0],
  //     gas: "10000000 ",
  //   });
  //   let balance = await web3.eth.getBalance(accounts[1]);
  //   balance = web3.utils.fromWei(balance, "ether");
  //   balance = parseFloat(balance);
  //   assert(balance > 104);
  // });
  // it("fetch project list", async () => {
  //   const newProjectList = await factory.methods.getDeployedProjects().call();
  //   console.log(newProjectList);
  // });
});
