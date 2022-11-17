export const formatBalance = (balance: string) => {
  const balanceString = balance.split("");
  const index = balanceString.findIndex((char) => char !== "0" && char !== ".");
  if (index === 0) {
    return (Math.ceil(parseFloat(balance) * 100) / 100).toFixed(2);
  }
  if (balanceString[index + 2]) {
    balanceString[index + 2] = (+balanceString[index + 2] + 1).toString();
  }
  return balanceString.slice(0, index + 3).join("");
};