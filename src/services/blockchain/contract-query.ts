import { NamedContract } from ".";

/*
  - make calls to ABIs a bit easier
*/

export class ContractQuery {
  contract: NamedContract;
  constructor(contract: NamedContract) {
    this.contract = contract;
  }

  async balanceOf(account: string) {
    /* 
      - balanceOf() will return you an object that has an call method defined
        on it 
      - you need to call the call() method to get the balance
   */
    const balance: string = await this.contract.web3Contract.methods
      .balanceOf(account)
      .call();
    return balance;
  }

  async owner() {
    if (this.contract.name !== "Bank") return undefined;
    const owner: string = await this.contract.web3Contract.methods
      .owner()
      .call();
    return owner;
  }
}
