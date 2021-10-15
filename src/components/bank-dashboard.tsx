import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { NamedContract, weiToEther } from "../services/blockchain";
import { ContractQuery } from "../services/blockchain/contract-query";
import { contractState, web3State } from "../store";

interface BankDashboardProps {}

const BankDashboard: React.FC<BankDashboardProps> = () => {
  const contractStateValue = useRecoilValue(contractState);
  const web3ServerStateValue = useRecoilValue(web3State);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [tetherBalance, setTetherBalance] = useState("");
  const [rwdBalance, setRwdBalance] = useState("");

  /* load owner */
  useEffect(() => {
    const startLoadOwner = async () => {
      const contract = contractStateValue.Bank;
      if (contract) {
        setBankAddress(contract.address);
        const query = new ContractQuery(contract);
        const result = await query.owner();
        if (result) setOwnerAddress(result);
      }
    };
    startLoadOwner();
  }, [contractStateValue.Bank]);

  /* load Tether and RWD balance */
  const loadBalance = async (contract: NamedContract, bankAddress: string) => {
    const query = new ContractQuery(contract);
    const balance = await query.balanceOf(bankAddress);
    return balance;
  };

  useEffect(() => {
    const startLoadBalance = async () => {
      if (bankAddress) {
        const web3 = web3ServerStateValue.web3;
        let contract = contractStateValue.Tether;
        if (contract) {
          const balance = await loadBalance(contract, bankAddress);
          setTetherBalance(weiToEther(web3, balance));
        }
        contract = contractStateValue.RWD;
        if (contract) {
          const balance = await loadBalance(contract, bankAddress);
          setRwdBalance(weiToEther(web3, balance));
        }
      }
    };
    startLoadBalance();
  }, [
    bankAddress,
    contractStateValue.Tether,
    contractStateValue.RWD,
    web3ServerStateValue.web3,
  ]);

  return (
    <div>
      <p>Decentralized Bank</p>
      <ul>
        <li>Owner: {ownerAddress}</li>
        <li>Bank: {bankAddress}</li>
        <li>Tether: {tetherBalance}</li>
        <li>RWD: {rwdBalance}</li>
      </ul>
    </div>
  );
};

export default BankDashboard;
