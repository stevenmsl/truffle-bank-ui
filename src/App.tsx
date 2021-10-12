import { useEffect, useRef, useState } from "react";
import { web3Empty } from "./services/blockchain";
import { useSetRecoilState } from "recoil";
import {
  loadWeb3,
  loadContracts,
  loadAccounts,
  NamedContract,
} from "./services/blockchain";

import AccountList from "./components/account-list";
import ContractList from "./components/contract-list";

import "./App.css";
import { web3State } from "./store";

const App = () => {
  const [web3Ready, setWeb3Ready] = useState(false);
  const [accounts, setAccounts] = useState([""]);
  const [contracts, setContracts] = useState([] as NamedContract[]);
  const [dataReady, setDataReady] = useState(false);
  const setWeb3Server = useSetRecoilState(web3State);

  const web3 = useRef(web3Empty);

  /* 
    - check if MetaMask is installed
    - use useRef to keep a refernce 
      to the web3 instance for 
      later use
  */
  useEffect(() => {
    const startLoadWeb3 = async () => {
      let loadedWeb3 = await loadWeb3();
      if (!(loadedWeb3 === web3Empty)) {
        web3.current = loadedWeb3;
        setWeb3Ready(true);
        setWeb3Server(() => {
          return { web3: loadedWeb3 };
        });
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
        const loadedAccounts = await loadAccounts(web3.current);
        if (loadedAccounts) {
          setAccounts([...loadedAccounts]);
        } else {
          setDataReady(false);
          return;
        }
        const loadedContracts = await loadContracts(web3.current);
        setContracts([...loadedContracts]);

        setDataReady(true);
      };
      startLoadBlockchainData();
    }
  }, [web3Ready]);

  useEffect(() => {}, [accounts, contracts]);

  const renderAccounts = () => {
    return dataReady ? (
      <AccountList accounts={accounts} contracts={contracts}></AccountList>
    ) : (
      <p>Loading accounts </p>
    );
  };
  const renderContracts = () => {
    return dataReady ? (
      <ContractList contracts={contracts}></ContractList>
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
