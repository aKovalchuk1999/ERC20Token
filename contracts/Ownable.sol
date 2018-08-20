pragma solidity ^0.4.23;

contract Ownable {
    
    address public owner;
    
     modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    constructor() public {
        owner = msg.sender;
    }

    event TransferOwnership(address indexed _from, address indexed _to);
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0));
        owner = _newOwner;
        emit TransferOwnership(msg.sender, _newOwner);
    }
}