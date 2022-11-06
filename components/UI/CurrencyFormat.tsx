import "intl/locale-data/jsonp/en";
import React from "react";
import { Text, View } from "react-native";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { CURRENCY_SYMBOL, LOCALES } from "../../utils/storage";
import { tw } from "../../utils/tailwind";
interface ICurrencyProps {
  value: number | string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  style?: string;
}

/**
 * @author ThaiND
 * Created at Thu Jun 16 2022
 * @description
 * @param
 * @returns
 * @example
 */

let formatSmallNum = (num: number) => {
  if (num > 1) {
    return num;
  }
  let numString = num.toString();
  let numSplited = numString.split("");
  let indexOfFirstNonZero = numSplited.findIndex(
    (element) => element !== "0" && element !== "."
  );
  const result = numSplited.slice(0, indexOfFirstNonZero + 2).join("");
  return result;
};

const CurrencyFormat = ({
  value,
  size = "lg",
  style = "font-bold",
}: ICurrencyProps) => {
  //COUNTRY CURRENCY CODES: https://www.iban.com/currency-codes
  const [storedLocale] = useLocalStorage(LOCALES, "en-US");
  const [storedcurrencySymbol] = useLocalStorage(CURRENCY_SYMBOL, "USD");

  const locale = storedLocale || "en-US";
  const currencySymbol = storedcurrencySymbol || "USD";
  const roundNumber = +value > 0.001 ? 3 : 20;
  const formatCurrency = (currency: number | string) => {
    const formatter = new Intl.NumberFormat(locale?.toString(), {
      style: "currency",
      currency: currencySymbol,
      maximumFractionDigits: roundNumber,
    });

    return formatter.format(Number(currency));
  };

  return (
    <View style={tw``}>
      <Text style={tw`dark:text-white text-gray-800  text-${size} ${style} `}>
        {formatCurrency(+value ? +value : 0)}
      </Text>
    </View>
  );
};
export default CurrencyFormat;
