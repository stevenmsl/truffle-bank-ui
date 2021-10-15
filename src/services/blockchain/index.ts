import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import TetherContract from "./truffle_abis/Tether.json";
import RWDContract from "./truffle_abis/RWD.json";
import BankContract from "./truffle_abis/DecentralBank.json";
import {
  TetherNetworkIds,
  RwdNetworkIds,
  BankNetworkIds,
  NamedContract,
  ContractName,
} from "./types";

import { BlockchainContract } from "../../store/types";

import { AbiItem } from "web3-utils";
import { ContractQuery } from "./contract-query";

declare global {
  interface Window {
    /* 
      - doesn't seem to have any benefits 
          of declaring the type as the provider 
          type defined in the web3-core package 
    */
    ethereum: any;
  }
}

/* use as the initial value for useref hook */
export const web3Empty: Web3 = new Web3();

export * from "./types";

export const loadWeb3 = async () => {
  /* 
    - check if window.ethereum is injected by MetaMask 
  */
  if (window.ethereum) {
    /* 
        - MetaMask will not pop-up if the account
          has already connected to the site
        - prompt the users to connect their
          accounts to this site
      */
    await window.ethereum.send("eth_requestAccounts");
    /* replace the injected web3 with a newer version
        - window.web3 = new Web3(window.ethereum);   
          - don't see any reason we need to do this
          - just return the instance and let caller 
            decide where to store it  
    */
    return new Web3(window.ethereum);
  } else {
    window.alert(
      "Metamask is not installed. Metamask is required to access this site."
    );
    return web3Empty;
  }
};

export const loadAccounts = async (web3: Web3) => {
  if (web3 === web3Empty) {
    throw new Error("Make sure you load the web3 first.");
  }
  const accounts = await web3.eth.getAccounts();
  return accounts;
};

const loadContract = async (
  name: ContractName,
  web3: Web3
): Promise<[Contract, string]> => {
  const networkId = (await web3.eth.net.getId()).toString();
  switch (name) {
    case "Tether": {
      /* #REF-01  
         - you need to perform a type assertion first
      */
      const index = networkId as TetherNetworkIds;
      return [
        new web3.eth.Contract(
          TetherContract.abi as AbiItem[],
          TetherContract.networks[index].address
        ),
        TetherContract.networks[index].address,
      ];
    }
    case "Rwd": {
      const index = networkId as RwdNetworkIds;
      return [
        new web3.eth.Contract(
          RWDContract.abi as AbiItem[],
          RWDContract.networks[index].address
        ),
        RWDContract.networks[index].address,
      ];
    }
    case "Bank": {
      const index = networkId as BankNetworkIds;
      return [
        new web3.eth.Contract(
          BankContract.abi as AbiItem[],
          BankContract.networks[index].address
        ),
        BankContract.networks[index].address,
      ];
    }
  }
};

export const loadContracts = async (
  web3: Web3
): Promise<BlockchainContract> => {
  if (web3 === web3Empty) {
    throw new Error("Make sure you load the web3 first.");
  }
  const contracts: NamedContract[] = [];

  const tether = await loadContract("Tether", web3);
  contracts.push({
    name: "Tether",
    web3Contract: tether[0],
    address: tether[1],
  });
  const rwd = await loadContract("Rwd", web3);
  contracts.push({ name: "Rwd", web3Contract: rwd[0], address: rwd[1] });
  const bank = await loadContract("Bank", web3);
  contracts.push({ name: "Bank", web3Contract: bank[0], address: bank[1] });

  return {
    contracts: contracts,
    Tether: contracts[0],
    RWD: contracts[1],
    Bank: contracts[2],
  };
};

export const balanceOf = async (contract: NamedContract, account: string) => {
  const query = new ContractQuery(contract);

  const balance = await query.balanceOf(account);
  return balance;
};

export const weiToEther = (web3: Web3, amountInWei: string) => {
  return web3.utils.fromWei(amountInWei, "ether");
};

export const etherToWei = (web3: Web3, amountInEther: string) => {
  return web3.utils.toWei(amountInEther, "ether");
};
