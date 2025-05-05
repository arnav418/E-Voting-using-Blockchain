// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Election {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) private hasVoted; 
    address[] public repeatLoginAttempts; // Store second-time login attempts
    uint public candidatesCount;

    event VotedEvent(address indexed voter, uint indexed candidateId);
    event DuplicateLoginAttempt(address indexed voter);

    constructor() {
        addCandidate("Candidate-1");
        addCandidate("Candidate-2");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted!"); 
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = true; 

        emit VotedEvent(msg.sender, _candidateId); 
    }

    // ✅ Function to check if a voter has already voted
    function hasUserVoted(address _voter) public view returns (bool) {
        return hasVoted[_voter];
    }

    // ✅ Function to log and track users who try to vote again
    function logDuplicateLogin(address _voter) public {
        require(hasVoted[_voter], "User has not voted yet!"); 
        repeatLoginAttempts.push(_voter);
        emit DuplicateLoginAttempt(_voter);
    }

    // ✅ Function to get list of repeat login attempts
    function getRepeatLoginAttempts() public view returns (address[] memory) {
        return repeatLoginAttempts;
    }
}
