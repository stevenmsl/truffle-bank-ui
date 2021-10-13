import { useEffect, useRef, useState } from "react";
import { web3Empty } from "./services/blockchain";
import { useRecoilState } from "recoil";
import { loadWeb3, loadContracts, loadAccounts } from "./services/blockchain";

import AccountList from "./components/account-list";
import ContractList from "./components/contract-list";

import "./App.css";
import { accountState, web3State, contractState } from "./store";

const App = () => {
  const [web3Ready, setWeb3Ready] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [web3Server, setWeb3Server] = useRecoilState(web3State);

  const [accountStateValue, setAccounts] = useRecoilState(accountState);
  const [contractStateValue, setContracts] = useRecoilState(contractState);
  const web3 = useRef(web3Empty);

  /* 
    - check if MetaMask is installed
    - use useRef to keep a refernce 
      to the web3 instance for 
      later use
  */
  useEffect(() => {
    const startLoadWeb3 = async () => {
      const loadedWeb3 = await loadWeb3();
      if (!(loadedWeb3 === web3Empty)) {
        web3.current = loadedWeb3;
        setWeb3Server(() => {
          return { web3: Object.create(loadedWeb3) };
        });
        setWeb3Ready(true);
      } else {
        setWeb3Ready(false);
      }
    };
    startLoadWeb3();
  }, [setWeb3Server]);

  useEffect(() => {
    /* 
      - make sure the web3 is ready before 
        loading accounts and contracts  
    */
    if (web3Ready) {
      const startLoadBlockchainData = async () => {
        const loadedAccounts = await loadAccounts(web3Server.web3);
        if (loadedAccounts) {
          setAccounts({ accounts: [...loadedAccounts] });
        } else {
          setDataReady(false);
          return;
        }
        const loadedContracts = await loadContracts(web3Server.web3);
        setContracts({
          contracts: loadedContracts.contracts.map((contract) => {
            return Object.create(contract);
          }),
          Tether: loadedContracts.Tether
            ? Object.create(loadedContracts.Tether)
            : undefined,
          RWD: loadedContracts.RWD
            ? Object.create(loadedContracts.RWD)
            : undefined,
          Bank: loadedContracts.Bank
            ? Object.create(loadedContracts.Bank)
            : undefined,
        });

        setDataReady(true);
      };
      startLoadBlockchainData();
    }
  }, [web3Ready, setAccounts, web3Server.web3, setContracts]);

  useEffect(() => {
    console.log(contractStateValue.contracts);
    console.log(accountStateValue.accounts);
    console.log(web3Server);
  }, [accountStateValue.accounts, web3Server, contractStateValue.contracts]);

  const renderAccounts = () => {
    return dataReady ? <AccountList></AccountList> : <p>Loading accounts </p>;
  };
  const renderContracts = () => {
    return dataReady ? (
      <ContractList contracts={contractStateValue.contracts}></ContractList>
    ) : (
      <p>Loading contracts... </p>
    );
  };

  return (
    <div className="App">
      <div>{renderAccounts()}</div>
      <div>{renderContracts()}</div>
    </div>
  );
};

export default App;
