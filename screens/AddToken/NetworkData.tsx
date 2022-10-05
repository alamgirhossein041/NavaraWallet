import React from "react";
import Near from "../../assets/icons/icon-near.svg";
import Solana from "../../assets/icons/icon-solana.svg";
import Terra from "../../assets/icons/icon-terra.svg";
import Btc from "../../assets/icons/icon-btc.svg";
import Bsc from "../../assets/icons/icon-bsc.svg";
import Ethereum from "../../assets/icons/icon-ethereum.svg";

const networks = [
  {
    id: "near",
    icon: <Near width="100%" height="100%" />,
    name: "Near",
  },
  {
    id: "solana",
    icon: <Solana width="100%" height="100%" />,
    name: "Solana",
  },
  {
    id: "terra",
    icon: <Terra width="100%" height="100%" />,
    name: "Terra",
  },
  {
    id: "btc",
    icon: <Btc width="100%" height="100%" />,
    name: "Bitcoin",
  },
  {
    id: "bsc",
    icon: <Bsc width="100%" height="100%" />,
    name: "BSC",
  },
  {
    id: "ethereum",
    icon: <Ethereum width="100%" height="100%" />,
    name: "Ethereum",
  },
];

export default networks;
