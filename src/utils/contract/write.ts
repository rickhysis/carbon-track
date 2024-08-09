import { writeContract } from "@wagmi/core";
import { config } from "@/configurations/wagmi";
import { Address } from "viem";
import { CAPTURE_CONTRACT_ADDRESS } from "@/configurations/contract";
import { CARBON_CAPTURE_ABI } from "@/abi/carboncapture";
import { IndustryData } from "@/types/industry";
import { CaptureData } from "@/types/capture";

export async function registerIndustry(address: Address, data: IndustryData) {
    const result = await writeContract(config, {
        abi: CARBON_CAPTURE_ABI,
        address: CAPTURE_CONTRACT_ADDRESS as Address,
        functionName: 'registerIndustry',
        args: [
            data.walletAddress,
            data.industryName,
            data.city,
            data.latitude,
            data.longitude
        ],
        account: address
    })

    return result
}

export async function captureCarbon(address: Address, data: CaptureData) {
    const result = await writeContract(config, {
        abi: CARBON_CAPTURE_ABI,
        address: CAPTURE_CONTRACT_ADDRESS as Address,
        functionName: 'captureCarbon',
        args: [
            data.year,
            data.month,
            data.amount
        ],
        account: address
    })

    return result
}

export async function verifyCarbon(address: Address, data: CaptureData) {
    const result = await writeContract(config, {
        abi: CARBON_CAPTURE_ABI,
        address: CAPTURE_CONTRACT_ADDRESS as Address,
        functionName: 'verifyCarbon',
        args: [
            data.walletAddress,
            data.year,
            data.month
        ],
        account: address
    })

    return result
}