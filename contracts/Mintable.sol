pragma solidity ^0.4.23;

import "./StandartToken.sol";

contract Mintable is StandartToken {
    
    bool public mintingFinished = false;
    
    event MintFinished();
    
    
    event Mint(address indexed to, uint256 amount);
    function mint(address _to, uint256 _amount) public onlyOwner returns (bool) {
        if(_amount > 0 && _to != address(0) && !mintingFinished){
            _totalSupply += _amount;
            balances[_to] += _amount;
            emit Mint(_to, _amount);
            return true;
        }else { return false; }
        
    }
    
    function finishMinting() public onlyOwner returns (bool) {
        mintingFinished = !mintingFinished;
        emit MintFinished();
        return true;
    }
}