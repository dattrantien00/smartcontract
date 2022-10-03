import {expect} from "chai";
import {ethers} from "hardhat";
import {Contract} from "@ethersproject/contracts";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import * as chai from "chai";

const chaiAsPromised= require("chai-as-promised");
chai.use(chaiAsPromised);

import { keccak256 } from "ethers/lib/utils";

function parseEther(amount: Number)
{
    return ethers.utils.parseUnits(amount.toString(),18);

}

describe("Vault", function()
{
    let owner: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    carol: SignerWithAddress;
    
    let vault: Contract;
    let token: Contract;

    beforeEach(async () => {
        await ethers.provider.send("hardhat_reset",[]);
        [owner,alice, bob, carol] = await ethers.getSigners();

        const Vault = await ethers.getContractFactory("Vault", owner);
        vault= await Vault.deploy();
        const Token= await ethers.getContractFactory("Floppy", owner);
        token= await Token.deploy();
        await vault.setToken(token.address);

        
    })
    it("Should deposit into the Vault", async() => {
        await token.transfer(alice.address, parseEther(1*10**6));
        await token.connect(alice).approve(vault.address,token.balanceOf(alice.address));
        await vault.connect(alice).deposit(parseEther(500*10**3));
        expect(await token.balanceOf(vault.address)).equal(parseEther(500*10**3));
    });
    it("Should withdraw", async() => {
        let WITHDRAWER_ROLE= keccak256(Buffer.from("WITHDRAWER_ROLE")).toString();
        await vault.grantRole(WITHDRAWER_ROLE,bob.address);
        
        await vault.setWithdrawEnable(true);
        await vault.setmaxWithdrawAmount(parseEther(1*10**6));
        
        await token.transfer(alice.address,parseEther(1*10**6));
        await token.connect(alice).approve(vault.address,token.balanceOf(alice.address));
        await vault.connect(alice).deposit(parseEther(500*10**3));

        await vault.connect(bob).withdraw(parseEther(300*10**3),alice.address);

        expect(await token.balanceOf(vault.address)).equal(parseEther(200*10**3));
        expect(await token.balanceOf(alice.address)).equal(parseEther(800*10**3));
    });
    it("Should not deposit, insufficient account balance", async() => {
        await token.transfer(alice.address, parseEther(1*10**6));
        await token.connect(alice).approve(vault.address,token.balanceOf(alice.address));
        
        await expect(vault.connect(alice).deposit(parseEther(2*10**6))).revertedWith('Insufficient account balance');
    });

    it("Should not deposit, withdraw is not available", async() => {
        let WITHDRAWER_ROLE= keccak256(Buffer.from("WITHDRAWER_ROLE")).toString();
        await vault.grantRole(WITHDRAWER_ROLE,bob.address); 

        await vault.setWithdrawEnable(false);
        await vault.setmaxWithdrawAmount(parseEther(1*10**6));

        await token.transfer(alice.address, parseEther(1*10**6));
        await token.connect(alice).approve(vault.address,token.balanceOf(alice.address));
        await vault.connect(alice).deposit(parseEther(500*10**3));


        await expect(vault.connect(bob).withdraw(parseEther(500*10**3),alice.address)).revertedWith('withdraw is not valid');
    });

    it("Should not deposit, exceed maximum amount", async() => {
        let WITHDRAWER_ROLE= keccak256(Buffer.from("WITHDRAWER_ROLE")).toString();
        await vault.grantRole(WITHDRAWER_ROLE,bob.address); 
        
        await vault.setWithdrawEnable(true);
        await vault.setmaxWithdrawAmount(parseEther(1*10**6));

        await token.transfer(alice.address, parseEther(1*10**6));
        await token.connect(alice).approve(vault.address,token.balanceOf(alice.address));
        await vault.connect(alice).deposit(parseEther(500*10**3));


        await expect(vault.connect(bob).withdraw(parseEther(10**7),alice.address)).revertedWith('Exceed maximum amount');
    });

    it("Should not deposit, Caller is not a withdrawer", async() => {
        //let WITHDRAWER_ROLE= keccak256(Buffer.from("WITHDRAWER_ROLE")).toString();
        //await vault.grantRole(WITHDRAWER_ROLE,bob.address); 
        
        await vault.setWithdrawEnable(true);
        await vault.setmaxWithdrawAmount(parseEther(1*10**6));

        await token.transfer(alice.address, parseEther(1*10**6));
        await token.connect(alice).approve(vault.address,token.balanceOf(alice.address));
        await vault.connect(alice).deposit(parseEther(500*10**3));


        await expect(vault.connect(bob).withdraw(parseEther(10**7),alice.address)).revertedWith('Caller is not a withdrawer');
    });

    it("Should not deposit, ERC20: transfer amount exceeds balance", async() => {
        let WITHDRAWER_ROLE= keccak256(Buffer.from("WITHDRAWER_ROLE")).toString();
        await vault.grantRole(WITHDRAWER_ROLE,bob.address); 
        
        await vault.setWithdrawEnable(true);
        await vault.setmaxWithdrawAmount(parseEther(1*10**6));

        await token.transfer(alice.address, parseEther(1*10**6));
        await token.connect(alice).approve(vault.address,token.balanceOf(alice.address));
        await vault.connect(alice).deposit(parseEther(500*10**3));


        await expect(vault.connect(bob).withdraw(parseEther(600*10**3),alice.address)).revertedWith('ERC20: transfer amount exceeds balance');
    });
})
