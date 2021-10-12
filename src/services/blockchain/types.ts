import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import TetherContract from "./truffle_abis/Tether.json";
import RWDContract from "./truffle_abis/RWD.json";
import BankContract from "./truffle_abis/DecentralBank.json";

/*
  - this will create a union type of all network ids in a
    contract
  - you can't access a specific network with an index
    that is coming from a variable whose type is a string:

    const networkId = (await web3.eth.net.getId()).toString();
    TetherContract.networks[networkId] <-- error    
  - you need to use type assertion first #REF-01   
*/
export type TetherNetworkIds = keyof typeof TetherContract.networks;
export type RwdNetworkIds = keyof typeof RWDContract.networks;
export type BankNetworkIds = keyof typeof BankContract.networks;

/*
  - meta data required to create web3 contract 
*/
export type ContractMetaData = {
  abis: AbiItem[];
  address: string;
};

/*
  - type represents named W3 contract
*/
export type NamedContract = {
  name: ContractName;
  contract: Contract;
  address: string;
};

export type ContractName = "Tether" | "Rwd" | "Bank";
