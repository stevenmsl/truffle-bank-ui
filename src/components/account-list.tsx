import { useRecoilValue } from "recoil";
import { balanceOf } from "../services/blockchain";
import { accountState, contractState } from "../store";

interface AccountListProps {}

const AccountList: React.FC<AccountListProps> = () => {
  const accountStateValue = useRecoilValue(accountState);
  const contractStateValue = useRecoilValue(contractState);

  const getBalance = async (account: string) => {
    const balance = await balanceOf(contractStateValue.Tether!, account);
    console.log(balance);
  };

  const renderAccounts = accountStateValue.accounts.map((account, index) => (
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
