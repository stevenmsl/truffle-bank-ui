import { NamedContract } from ".";

export class CurrencyTx {
  contract: NamedContract;

  constructor(contract: NamedContract) {
    if (contract.name === "Bank") throw new Error("Bank is not a currency");
    this.contract = contract;
  }

  async approve(fromAccount: string, toBankAddress: string, weiAmount: string) {
    try {
      const { transactionHash }: { transactionHash: string } =
        await this.contract.web3Contract.methods
          .approve(toBankAddress, weiAmount)
          .send({ from: fromAccount });
      return transactionHash;
    } catch (error) {
      console.log(undefined);
      return undefined;
    }
  }
}
