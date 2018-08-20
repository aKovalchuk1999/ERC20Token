pragma solidity ^0.4.23;

import "./Ownable.sol";

contract StandartToken is Ownable {
    
    uint public _totalSupply;
    
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
    

    function balanceOf(address _account) public view returns (uint balance) {
        return balances[_account];
    }

    function totalSupply() public view returns(uint) {
        return _totalSupply;
    }

    event Transfer(address indexed from, address indexed to, uint tokens);
    function transfer(address to, uint tokens) public returns (bool success) {
       if (balances[msg.sender] >= tokens && tokens > 0) {
            balances[msg.sender] -= tokens;
            balances[to] += tokens;
            emit Transfer(msg.sender, to, tokens);
            return true;
        } else { return false; }
    }

    event Approval(address indexed from, address indexed to, uint tokens);
    function approve(address to, uint tokens) public returns (bool success) {
        allowed[msg.sender][to] = tokens;
        emit Approval(msg.sender, to, tokens);
        return true;
    }

    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        if (balances[from] >= tokens && allowed[from][msg.sender] >= tokens &&
                tokens > 0 && balances[to] + tokens > balances[to]) {
            balances[from] -= tokens;
            allowed[from][msg.sender] -= tokens;
            balances[to] += tokens;
            emit Transfer(from, to, tokens);
            return true;
        } else { return false; }
        
    }

    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
}