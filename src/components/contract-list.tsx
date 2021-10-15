import { useRecoilValue } from "recoil";

import { contractState } from "../store";

interface ContractListProps {}

const ContractList: React.FC<ContractListProps> = () => {
  const contractStateValue = useRecoilValue(contractState);

  const renderContracts = contractStateValue.contracts.map(
    (contract, index) => (
      <li key={index}>
        <p>{contract.name}</p>
        <p>{contract.address}</p>
      </li>
    )
  );

  return (
    <div>
      <p>Contract List</p>
      <ul>{renderContracts}</ul>
    </div>
  );
};

export default ContractList;
