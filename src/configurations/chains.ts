import { Transport, http } from "viem";
import { Chain, hardhat, lisk, liskSepolia, mainnet, sepolia } from "wagmi/chains";

export const ENV_NETWORK : string = import.meta.env.VITE_ENV_NETWORK

export function getNetworkEnviroment() : Chain[]{
    if(ENV_NETWORK === 'testnet'){
        return [liskSepolia]
    }else if(ENV_NETWORK === 'mainnet'){
        return [lisk]
    }else{
        return [hardhat]
    }
}

export function getTransportChain(): Record<Chain['id'], Transport>{
    if(ENV_NETWORK === 'testnet'){
        return {
            [liskSepolia.id]: http()
        }
    }else if(ENV_NETWORK === 'mainnet'){
        return {
            [lisk.id]: http()
        }
    }else{
        return {
            [hardhat.id]: http(),
        }
    }
}

export function getChainNetwork(): Chain {
    if(ENV_NETWORK === 'mainnet'){
        return lisk
    }else{
        return liskSepolia
    }
}

export function getEthChainNetwork(): Chain {
    if(ENV_NETWORK === 'mainnet'){
        return mainnet
    }else{
        return sepolia
    }
}

export function getPublicRpc() : string{
    if(ENV_NETWORK === 'mainnet'){
        return 'https://rpc.api.lisk.com'
    }else{
        return 'https://rpc.sepolia-api.lisk.com'
    }
}

export const CHAINS =  [
    'lisk'
]