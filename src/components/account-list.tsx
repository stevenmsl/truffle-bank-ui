import { useRecoilValue } from "recoil";
import { accountState, contractState, web3State } from "../store";
import BankDashboard from "./bank-dashboard";
import AccountDashboard from "./account-dashboard";

interface AccountListProps {}

const AccountList: React.FC<AccountListProps> = () => {
  const accountStateValue = useRecoilValue(accountState);
  const contractStateValue = useRecoilValue(contractState);
  const web3ServerStateValue = useRecoilValue(web3State);

  const renderAccounts = () => {
    if (
      !(
        accountStateValue.accounts &&
        contractStateValue.Tether &&
        contractStateValue.RWD &&
        web3ServerStateValue.web3
      )
    )
      return <p>loading...</p>;
    return accountStateValue.accounts.map((account, index) => (
      <AccountDashboard
        key={index}
        account={account}
        tether={contractStateValue.Tether!}
        rwd={contractStateValue.RWD!}
        web3={web3ServerStateValue.web3}
      ></AccountDashboard>
    ));
  };
  return (
    <div>
      <p>Account List</p>
      <ul>{renderAccounts()}</ul>
      <BankDashboard></BankDashboard>
    </div>
  );
};

export default AccountList;
