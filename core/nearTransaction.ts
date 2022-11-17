import BN from "bn.js";
import { transactions as transaction, utils } from "near-api-js";

const calculateGasLimit = (actions) =>
  actions
    .filter((a) => Object.keys(a)[0] === "functionCall")
    .map((a) => a.functionCall.gas)
    .reduce((totalGas, gas) => totalGas.add(gas), new BN(0))
    .toString();

const deserializeTransactionsFromString = (transactionsString) =>
  transactionsString
    .split(",")
    .map((str) => Buffer.from(str, "base64"))
    .map((buffer) =>
      utils.serialize.deserialize(
        transaction.SCHEMA,
        transaction.Transaction,
        buffer
      )
    );

export const parseTransactionsToSign = (
  transactionsString: string | string[],
  callbackUrl: string | string[],
  meta?: any
) => {
  const transactions = deserializeTransactionsFromString(transactionsString);

  const allActions = transactions.flatMap((t) => t.actions);

  return {
    callbackUrl,
    meta,
    transactions,
    totalAmount: allActions
      .map(
        (a) =>
          (a.transfer && a.transfer.deposit) ||
          (a.functionCall && a.functionCall.deposit) ||
          0
      )
      .reduce(
        (totalAmount, amount) => totalAmount.add(new BN(amount)),
        new BN(0)
      )
      .toString(),
    fees: {
      transactionFees: "", // TODO: Calculate total fees
      gasLimit: calculateGasLimit(allActions),
      gasPrice: "", // TODO: Where to get gas price?
    },
    sensitiveActionsCounter: allActions.filter(
      (a) =>
        ["deployContract", "stake", "deleteAccount"].indexOf(
          Object.keys(a)[0]
        ) > -1
    ).length,
  };
};
