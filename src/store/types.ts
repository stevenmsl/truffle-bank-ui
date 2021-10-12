import Web3 from "web3";
import { NamedContract } from "../services/blockchain";

export interface Web3Server {
  web3: Web3;
}

export interface BlockchainAccount {
  accounts: string[];
}

export interface BlockchainContract {
  contracts: NamedContract[];
  Tether: NamedContract;
  RWD: NamedContract;
  Bank: NamedContract;
}
