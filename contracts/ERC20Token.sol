pragma solidity ^0.4.23;

import "./Burnable.sol";

contract ERC20Token is Burnable {

    string public name;
    string public symbol;
    uint8 public decimals;
    

    constructor() public {
        name = "Truffle Test Token";
        symbol = "TTK";
        decimals = 8;
        _totalSupply = 100 * 10**uint(decimals);
        balances[owner] = _totalSupply;
        emit Transfer(address(0), owner, _totalSupply);
    }

    function () public payable {
        revert();
    }
    
}
