import { Fragment, useRef, useState } from "react";
import Web3 from "web3";
import { etherToWei, NamedContract } from "../services/blockchain";
import { ContractQuery } from "../services/blockchain/contract-query";
import { weiToEther } from "../services/blockchain";
import { CurrencyTx } from "../services/blockchain/currency-tx";
import { BankTx } from "../services/blockchain/bank-tx";

interface AccountDashboardProps {
  account: string;
  tether: NamedContract;
  rwd: NamedContract;
  bank: NamedContract;
  web3: Web3;
}

const AccountDashboard: React.FC<AccountDashboardProps> = ({
  account,
  tether,
  rwd,
  bank,
  web3,
}) => {
  const [tetherBalance, setTetherBalance] = useState("xxxx.xx");
  const [tetherApproveHash, setTetherApproveHash] = useState("");
  const [bankDepositHash, setBankDepositHash] = useState("");
  const [unstakingHash, setUnstakingHash] = useState("");

  const [rwdBalance, setRwdBalance] = useState("xxxx.xx");
  const stakingAmount = useRef<HTMLInputElement>(null);

  const getBalances = async () => {
    setTetherBalance("loading...");
    let query = new ContractQuery(tether);
    setTetherBalance(weiToEther(web3, await query.balanceOf(account)));
    setRwdBalance("loading...");
    query = new ContractQuery(rwd);
    setRwdBalance(weiToEther(web3, await query.balanceOf(account)));
  };

  const staking = async () => {
    setTetherApproveHash("");
    setBankDepositHash("");

    let hash: string | undefined = undefined;

    if (stakingAmount.current && stakingAmount.current.value) {
      const tx = new CurrencyTx(tether);
      const amount = etherToWei(web3, stakingAmount.current?.value);
      hash = await tx.approve(account, bank.address, amount);
      if (!hash) {
        setTetherApproveHash("error: check console log");
        return;
      } else {
        setTetherApproveHash(hash);
      }

      const bankTx = new BankTx(bank);
      hash = await bankTx.deposit(account, amount);

      if (!hash) {
        setBankDepositHash("error: check console log");
        return;
      } else {
        setBankDepositHash(hash);
      }
    }
  };

  const unstaking = async () => {
    setUnstakingHash("");
    const bankTx = new BankTx(bank);
    const hash = await bankTx.unstaking(account);
    if (!hash) {
      setUnstakingHash("error: check console log");
      return;
    } else {
      setUnstakingHash(hash);
    }
  };

  const render = () => {
    if (!(account && tether && rwd && web3)) return <p>Loading...</p>;

    return (
      <Fragment>
        <p>Account: {account} </p>
        <input type="button" value="Get Balances" onClick={getBalances}></input>
        <ul>
          <li>Tether: {tetherBalance}</li>
          <li>RWD: {rwdBalance}</li>
        </ul>
        <div>
          Amount <input ref={stakingAmount} type="number"></input>
          <input type="button" value="Staking" onClick={staking}></input>
        </div>
        <div>
          <ul>
            <li> Tether Approve Tx Hash: {tetherApproveHash} </li>
            <li> Bank Deposit Tx Hash: {bankDepositHash} </li>
          </ul>
        </div>
        <div>
          <input type="button" value="Unstaking" onClick={unstaking}></input>
          <ul>
            <li> Unstaking Tx Hash: {unstakingHash} </li>
          </ul>
        </div>
      </Fragment>
    );
  };

  return <div>{render()}</div>;
};

export default AccountDashboard;
