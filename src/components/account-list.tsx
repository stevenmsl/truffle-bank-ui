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
        contractStateValue.Bank &&
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
        bank={contractStateValue.Bank!}
        web3={web3ServerStateValue.web3}
      ></AccountDashboard>
    ));
  };

  const renderBank = () => {
    if (
      !(
        accountStateValue.accounts &&
        contractStateValue.Tether &&
        contractStateValue.RWD &&
        contractStateValue.Bank &&
        web3ServerStateValue.web3
      )
    )
      return <p>loading...</p>;

    const account = accountStateValue.accounts[0];

    return <BankDashboard account={account}></BankDashboard>;
  };

  return (
    <div>
      <p>Account List</p>
      <ul>{renderAccounts()}</ul>
      {renderBank()}
    </div>
  );
};

export default AccountList;
