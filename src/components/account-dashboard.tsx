import { Fragment, useState } from "react";
import Web3 from "web3";
import { NamedContract } from "../services/blockchain";
import { ContractQuery } from "../services/blockchain/contract-query";
import { weiToEther } from "../services/blockchain";

interface AccountDashboardProps {
  account: string;
  tether: NamedContract;
  rwd: NamedContract;
  web3: Web3;
}

const AccountDashboard: React.FC<AccountDashboardProps> = ({
  account,
  tether,
  rwd,
  web3,
}) => {
  const [tetherBalance, setTetherBalance] = useState("xxxx.xx");
  const [rwdBalance, setRwdBalance] = useState("xxxx.xx");

  const getBalances = async () => {
    setTetherBalance("loading...");
    let query = new ContractQuery(tether);
    setTetherBalance(weiToEther(web3, await query.balanceOf(account)));
    setRwdBalance("loading...");
    query = new ContractQuery(rwd);
    setRwdBalance(weiToEther(web3, await query.balanceOf(account)));
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
      </Fragment>
    );
  };

  return <div>{render()}</div>;
};

export default AccountDashboard;
