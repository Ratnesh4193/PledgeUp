// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.9;
 
contract ProjectFactory {
    
    uint public totalProjects;

    struct ShortProject {
        string title;
        uint minimumContribution;
        address manager;
        address projectAddress;
        string imageLink;
        uint targetAmount;
        string category;
    }
    ShortProject [] public deployedProjects;

    function createProject(string memory title, uint minimumContribution, uint targetAmount, string memory description, string memory targetDate, string memory imageLink, string memory category) public {
        address newProject = address(new Project(msg.sender, title, minimumContribution, targetAmount, description, targetDate, imageLink, category));
        
        ShortProject storage newShortProject = deployedProjects.push(); 
        newShortProject.title=title;
        newShortProject.minimumContribution=minimumContribution;
        newShortProject.manager=msg.sender;
        newShortProject.projectAddress=newProject;
        newShortProject.imageLink=imageLink;
        newShortProject.targetAmount=targetAmount;
        newShortProject.category=category;

        totalProjects++;
    }
 
    function getDeployedProjects() public view returns (ShortProject[] memory) {
        ShortProject[] memory result = new ShortProject[](deployedProjects.length);
        uint i = 0;
        for (uint id=0;i<deployedProjects.length;id++) {
            result[i] = deployedProjects[id];
            i++;
        }
        return result;
    }
}
 
contract Project {
    address public manager;
    string public title;
    uint public targetAmount;
    uint public backersCount=0;
    string public description;
    string public targetDate;
    string public imageLink;
    uint public fundingReceived=0;
    uint public pendingRequests=0;
    uint public finalizedRequests=0;
    string public category;
    uint public minimumContribution;
    
    mapping(address => bool) public backers;
 
    struct Request {
        string description;
        uint amount;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
 
    constructor (address managerInput, string memory titleInput, uint minimumContributionInput, uint targetAmountInput, string memory descriptionInput, string memory targetDateInput, string memory imageLinkInput, string memory categoryInput) {
        
        manager = managerInput;
        title = titleInput;
        minimumContribution = minimumContributionInput;
        targetAmount = targetAmountInput;
        description = descriptionInput;
        targetDate = targetDateInput;
        imageLink = imageLinkInput;
        category = categoryInput;

    }
 
    function contribute() public payable {
        require(msg.value > minimumContribution);
        require(backers[msg.sender] == false);
 
        backers[msg.sender] = true;
        backersCount++;
        fundingReceived+=msg.value;
    }
 
    function createRequest(string memory descriptionInput, uint amountInput, address recipientInput) public restricted {
        Request storage newRequest = requests.push(); 
        newRequest.description = descriptionInput;
        newRequest.amount= amountInput;
        newRequest.recipient= recipientInput;
        newRequest.complete= false;
        newRequest.approvalCount= 0;

        pendingRequests++;
    }
 
    function approveRequest(uint index) public {
        Request storage request = requests[index];
 
        require(backers[msg.sender]);
        require(!request.approvals[msg.sender]);
 
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
 
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
 
        require(request.approvalCount*2 > backersCount);
        require(!request.complete);
        require(request.amount<=address(this).balance);
 
        payable(request.recipient).transfer(request.amount);
        request.complete = true;
        finalizedRequests++;
        pendingRequests--;
    }
    
    function getSummary() public view returns (
      address, uint, string memory, string memory, string memory, uint, uint, uint, string memory, string memory, uint, uint
      ) {
        return (
            manager,
            address(this).balance,
            title,
            description,
            category,
            targetAmount,
            minimumContribution,
            backersCount,
            targetDate,
            imageLink,
            fundingReceived,
            pendingRequests
        );
    }
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}   