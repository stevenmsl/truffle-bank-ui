import { Web3Server } from "./types";
import { web3Empty } from "../services/blockchain";

import { atom } from "recoil";

export const web3State = atom<Web3Server>({
  key: "web3",
  default: { web3: web3Empty },
});
