import { BlockchainAccount, BlockchainContract, Web3Server } from "./types";
import { web3Empty } from "../services/blockchain";

import { atom } from "recoil";

export const web3State = atom<Web3Server>({
  key: "web3",
  default: { web3: web3Empty },
  // dangerouslyAllowMutability: true,
});

export const accountState = atom<BlockchainAccount>({
  key: "accounts",
  default: { accounts: [] },
});

export const contractState = atom<BlockchainContract>({
  key: "contracts",
  default: { contracts: [] },
});
