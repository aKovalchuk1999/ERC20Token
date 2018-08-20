pragma solidity ^0.4.23;

import "./Mintable.sol";

contract Burnable is Mintable {
    
    event Burn(address indexed burner, uint indexed value);
    function burn(uint _value) public returns (bool success) {
        if(_value > 0 && _value <= balances[msg.sender]){
             balances[msg.sender] -= _value;
             _totalSupply -= _value;
             emit Burn(msg.sender, _value);
             return true;
        } else { return false; }
    }
   
}