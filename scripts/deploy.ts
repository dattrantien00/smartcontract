import { ethers, hardhatArguments} from 'hardhat';
//import * as Config from './config';


async function main() {
    // const Floppy = await ethers.getContractFactory("Floppy");
    // const floppy= await Floppy.deploy();
    // console.log("Floppy address", floppy.address);

    // const Vault =await ethers.getContractFactory("Vault");
    // const vault= await Vault.deploy();
    // console.log("Floppy address", vault.address);

    // const USDT =await ethers.getContractFactory("USDT");
    // const usdt= await USDT.deploy();
    // console.log("Floppy address", usdt.address);

    // const ICO =await ethers.getContractFactory("FLPCrowdSale");
    // const ico = await ICO.deploy(1000,100,'0x42017F812F273F92BF6FD297f4EAc92E23bc19a2','0x99169Ca0Eb60967ae2337509b552E1F4dc676752');
    // console.log("Floppy address", ico.address);

    const Hero =await ethers.getContractFactory("Hero");
    const hero= await Hero.deploy();
    console.log("Floppy address", hero.address);

    // const Market =await ethers.getContractFactory("HeroMarketplace");
    // const market = await Market.deploy('0x99169Ca0Eb60967ae2337509b552E1F4dc676752','0xf70f201aC96bBe6e77835BeB599f2B9f98b5f6D2');
    // console.log("Floppy address", market.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  
  