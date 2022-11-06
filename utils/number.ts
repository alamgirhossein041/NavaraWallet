export const formatBalance = (balance: string) => {
  const balanceString = balance.split("");
  const index = balanceString.findIndex((char) => char !== "0" && char !== ".");
  if (index === 0) {
    return parseFloat(balance).toFixed(2);
  }
  return balanceString.slice(0, index + 3).join("");
};
