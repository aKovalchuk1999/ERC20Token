var ERC20Token = artifacts.require("./ERC20Token.sol");

contract('ERC20Token', function(accounts) {

  it("Total supply...", function(){
    var neededTokenSupply = 100 * Math.pow(10,8);
    return ERC20Token.deployed().then(function(instance){
      return instance.totalSupply.call();
    }).then(function(tokensAmount){
      assert.equal(tokensAmount.valueOf(), neededTokenSupply, "Total Supply isn't 100!!");
    });
  });

//--------------------------------------------------------------------------------------------------------------------------------

  it("Owner balance after deploying...", function() {
    var neededBalance = 100 * Math.pow(10,8);
    return ERC20Token.deployed().then(function(instance) {
      return instance.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), neededBalance, "100 wasn't in the owner account");
    });
  });

//--------------------------------------------------------------------------------------------------------------------------------

  it("Transfer tokens...", function() {
    var inst;
    var senderAccount = accounts[0];
    var recipientAccount = accounts[1];
    var senderStartBalance;
    var recipientStartBalance;
    var senderEndingBalance;
    var recipientEndingBalance;
    var amount = 20 * Math.pow(10,8);
    return ERC20Token.deployed().then(function(instance) {
      inst = instance;
      return inst.balanceOf.call(senderAccount);
    }).then(function(balance) {
      senderStartBalance = balance.toNumber();
      return inst.balanceOf.call(recipientAccount);
    }).then(function(balance) {
      recipientStartBalance = balance.toNumber();
      return inst.transfer(recipientAccount, amount, {from: senderAccount});
    }).then(function() {
      return inst.balanceOf.call(senderAccount);
    }).then(function(balance) {
      senderEndingBalance = balance.toNumber();
      return inst.balanceOf.call(recipientAccount);
    }).then(function(balance) {
      recipientEndingBalance = balance.toNumber();
      assert.equal(senderEndingBalance, senderStartBalance - amount, "!!!Amount of transfered tokens are not correctly!!!");
      assert.equal(recipientEndingBalance, recipientStartBalance + amount, "!!!Amount of transfered tokens are not correctly!!!");
    });
  });

//--------------------------------------------------------------------------------------------------------------------------------

it("Approve and transferFrom functions...", function(){
    var inst;
    var allowanceAcc = accounts[0];
    var receiverAcc = accounts[1];
    var sendingAcc = accounts[2];

    var allowanceAccStartBalance;
    var allowanceAccEndBalance;

    var receiverAccStartBalance;
    var receiverAccEndBalance;

    var senderAccStartBalance;
    var senderAccEndBalance;

    var allowanceAmount = 20 * Math.pow(10, 8);
    var sendAmount = 10 * Math.pow(10, 8);

    var startAllowanceAmount;
    var endAllowanceAmount;

    return ERC20Token.deployed().then(function(instance){
      inst = instance;
      return inst.balanceOf.call(allowanceAcc);
    }).then(function(balance){
      allowanceAccStartBalance = balance.toNumber();
      return inst.balanceOf.call(receiverAcc);
    }).then(function(balance){
      receiverAccStartBalance = balance.toNumber();
      return inst.balanceOf.call(sendingAcc)
    }).then(function(balance){
      senderAccStartBalance = balance.toNumber();
      return inst.approve(sendingAcc, allowanceAmount, {from: allowanceAcc});
    }).then(function(){
      return inst.allowance.call(allowanceAcc, sendingAcc);
    }).then(function(remaining){
      startAllowanceAmount = remaining.toNumber();
      return inst.transferFrom(allowanceAcc, receiverAcc, sendAmount, {from: sendingAcc});
    }).then(function(){
      return inst.balanceOf.call(allowanceAcc);
    }).then(function(balance){
      allowanceAccEndBalance = balance.toNumber();
      return inst.balanceOf.call(receiverAcc);
    }).then(function(balance){
      receiverAccEndBalance = balance.toNumber();
      return inst.balanceOf.call(sendingAcc);
    }).then(function(balance){
      senderAccEndBalance = balance.toNumber();
      return inst.allowance.call(allowanceAcc, sendingAcc);
    }).then(function(remaining){
      endAllowanceAmount = remaining.toNumber();
      assert.equal(allowanceAccEndBalance, allowanceAccStartBalance - sendAmount, "!!! Error! Amount of sent tokens from allowance account isn't correctly !!!");
      assert.equal(receiverAccEndBalance, receiverAccStartBalance + sendAmount, "!!! Error! Amount of received tokens to receiver account isn't correctly !!!");
      assert.equal(senderAccStartBalance, senderAccEndBalance, "!!! Amount of tokens in sending account has changed !!!");
      assert.equal(endAllowanceAmount, sendAmount, "!!! Error in remaining amount of tokens !!!");
    });
  });  

//--------------------------------------------------------------------------------------------------------------------------------

  it("Minting tokens...", async() => {
    let ownerAccount = accounts[0];
    let anotherAccount = accounts[1];

    let mintingAmount = 10 * Math.pow(10, 8);

    let instance = await ERC20Token.deployed();
    let inst = instance;

    let temp1 = await inst.balanceOf.call(anotherAccount);
    let startBalance = temp1.toNumber(); 
    await inst.mint(anotherAccount, mintingAmount, {from: ownerAccount});

    let temp2 = await inst.balanceOf.call(anotherAccount);
    let endBalance = temp2.toNumber();

    assert.equal(startBalance + mintingAmount, endBalance, "!!! Minting failed !!!");
  });


  it("Minting tokens2...", async() => {
    let ownerAccount = accounts[0];

    let instance = await ERC20Token.deployed();
    let inst = instance;

    let mintingAmount = 10 * Math.pow(10, 8);

    var result = await inst.mint.call(ownerAccount, mintingAmount, {from: ownerAccount});
    assert.isTrue(result, "!!! Minting failed... !!!");

    await inst.finishMinting({from: ownerAccount});

    var mintWhenMintingFinished = await inst.mint.call(ownerAccount, mintingAmount, {from: ownerAccount});
    assert.isFalse(mintWhenMintingFinished, "Owner can mint when minting finished !!!");

  });

//--------------------------------------------------------------------------------------------------------------------------------

  it("Burning tokens1...", async() => {
    let account = accounts[0];
    let instance = await ERC20Token.deployed();
    let inst = instance;
    let burningAmount = 25 * Math.pow(10,8);
    var result = await inst.burn.call(burningAmount, {from: account});
    assert.isTrue(result, "!!! Burning failed !!!");
  });

  it("Burning tokens2...", function(){
    var inst;
    var account = accounts[0];
    var startBalance;
    var endBalance;

    var burningAmount = 25 * Math.pow(10, 8);

    return ERC20Token.deployed().then(function(instance){
      inst = instance;
      return inst.balanceOf.call(account);
    }).then(function(balance){
      startBalance = balance.toNumber();
      return inst.burn(burningAmount, {from: account});
    }).then(function(){
      return inst.balanceOf.call(account);
    }).then(function(balance){
      endBalance = balance.toNumber();
      assert.equal(startBalance - burningAmount, endBalance, "!!! Burned not correctly amount of tokens !!!");
    });
  });

});
