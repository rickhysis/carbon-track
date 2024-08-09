import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { getNetworkEnviroment, getTransportChain } from "./chains";
import { Chain } from "viem";

interface Metadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

const PROJECT_ID = import.meta.env.VITE_WEB3MODAL_PROJECT_ID as string;

const metadata: Metadata = {
  name: 'EcoCapture Web3Modal',
  description: 'EcoCapture Wallet Modal',
  url: 'https://project-anagata.io',
  icons: ['https://project-anagata.io/img/AHAWhite.png']
};

export const configWagmi = () => {
  const env = getNetworkEnviroment();
  const transport = getTransportChain()

  return defaultWagmiConfig({
    chains: env as [Chain, ...Chain[]],
    projectId: PROJECT_ID,
    metadata,
    transports: transport
  });
} 

export const config = configWagmi()