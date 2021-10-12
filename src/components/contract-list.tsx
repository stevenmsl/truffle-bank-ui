import { NamedContract } from "../services/blockchain";

interface ContractListProps {
  contracts: NamedContract[];
}

const ContractList: React.FC<ContractListProps> = ({ contracts }) => {
  const renderContracts = contracts.map((contract, index) => (
    <li key={index}>
      <p>{contract.name}</p>
      <p>{contract.address}</p>
    </li>
  ));

  return (
    <div>
      <p>Account List</p>
      <ul>{renderContracts}</ul>
    </div>
  );
};

export default ContractList;
