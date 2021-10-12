import { balanceOf, NamedContract } from "../services/blockchain";

interface AccountListProps {
  accounts: string[];
  contracts: NamedContract[];
}

const AccountList: React.FC<AccountListProps> = ({ accounts, contracts }) => {
  const getBalance = async (account: string) => {
    const balance = await balanceOf(contracts[0], account);
    console.log(balance);
  };

  const renderAccounts = accounts.map((account, index) => (
    <li
      key={index}
      onClick={() => {
        getBalance(account);
      }}
    >
      {account}
    </li>
  ));
  return (
    <div>
      <p>Account List</p>
      <ul>{renderAccounts}</ul>
    </div>
  );
};

export default AccountList;
