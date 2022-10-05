import React from "react";
import Near from "../../assets/icons/icon-near.svg";
import Solana from "../../assets/icons/icon-solana.svg";
import Terra from "../../assets/icons/icon-terra.svg";
import Btc from "../../assets/icons/icon-btc.svg";
import Bsc from "../../assets/icons/icon-bsc.svg";
import Ethereum from "../../assets/icons/icon-ethereum.svg";
import Dnet from "../../assets/icons/icon-dnet.svg";

const tokens = [
  {
    icon: <Dnet width="100%" height="100%" />,
    id: "nearDnet",
    name: "Dnet",
    networkId: "near",
    symbol: "NEAR",
    address: "token.v1.dnet.near",
  },
  {
    icon: <Dnet width="100%" height="100%" />,
    id: "nearDnet",
    name: "Dnet",
    networkId: "near",
    symbol: "NEAR",
    address: "token.v1.dnet.near",
  },
  {
    icon: <Near width="100%" height="100%" />,
    id: "nearNear",
    name: "Near",
    networkId: "near",
    symbol: "NEAR",
    address: "token.v1.dnet.near",
  },
  {
    icon: <Solana width="100%" height="100%" />,
    id: "solanaSolana",
    name: "Solana",
    networkId: "solana",
    symbol: "NEAR",
    address: "token.v1.dnet.near",
  },
  {
    icon: <Ethereum width="100%" height="100%" />,
    id: "ETHNear",
    name: "Near",
    networkId: "ethereum",
    symbol: "ETH",
    address: "0x78ab3782...bea890",
  },
];

export default tokens;
