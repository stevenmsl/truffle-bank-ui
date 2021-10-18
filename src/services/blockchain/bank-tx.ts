import { NamedContract } from ".";

export class BankTx {
  contract: NamedContract;
  constructor(contract: NamedContract) {
    if (contract.name !== "Bank") throw new Error("Not a bank contract.");
    this.contract = contract;
  }
  async deposit(fromAccount: string, weiAmount: string) {
    try {
      const { transactionHash }: { transactionHash: string } =
        await this.contract.web3Contract.methods
          .depositTokens(weiAmount)
          .send({ from: fromAccount });
      return transactionHash;
    } catch (error) {
      console.log(undefined);
      return undefined;
    }
  }

  async issueRewards(account: string) {
    try {
      const { transactionHash }: { transactionHash: string } =
        await this.contract.web3Contract.methods
          .issueTokens()
          .send({ from: account });
      return transactionHash;
    } catch (error) {
      console.log(undefined);
      return undefined;
    }
  }

  async unstaking(account: string) {
    try {
      const { transactionHash }: { transactionHash: string } =
        await this.contract.web3Contract.methods
          .unstakeTokens()
          .send({ from: account });
      return transactionHash;
    } catch (error) {
      console.log(undefined);
      return undefined;
    }
  }
}
