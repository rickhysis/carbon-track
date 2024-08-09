import { readContract } from "@wagmi/core";
import { config } from "@/configurations/wagmi";
import { Address } from "viem";
import { CAPTURE_CONTRACT_ADDRESS } from "@/configurations/contract";
import { CARBON_CAPTURE_ABI } from "@/abi/carboncapture";
import { IndustryData } from "@/types/industry";
import { CaptureData } from "@/types/capture";
import { DEFAULT_ADDRESS } from "@/configurations/common";

export async function getNextIndustry(address: Address){
    const result = await readContract(config, {
        abi: CARBON_CAPTURE_ABI,
        address: CAPTURE_CONTRACT_ADDRESS as Address,
        functionName: 'nextIndustryId',
        args: [],
        account: address
    })

    return result
}

export async function getIndustriesByLimit(address: Address, start: number, limit: number): Promise<IndustryData[]> {
    const result = await readContract(config, {
        abi: CARBON_CAPTURE_ABI,
        address: (CAPTURE_CONTRACT_ADDRESS || DEFAULT_ADDRESS) as Address,
        functionName: 'getIndustriesByLimit',
        args: [
            BigInt(start),
            BigInt(limit),
        ],
        account: address || DEFAULT_ADDRESS
    })
    const data: IndustryData[] = []

    if (
        Array.isArray(result) &&
        result.every(Array.isArray)
    ) {
        for (let i = 0; i < result[0].length; i++) {
            data.unshift({
                walletAddress: result[0][i],
                industryName: result[1][i],
                city: result[2][i],
                latitude: result[3][i],
                longitude: result[4][i],
                carbonCaptured: result[5][i],
            })
        }

        return data
    }

    return []

}

export async function getIndustryDetails(address: Address): Promise<IndustryData | null> {
    const result = await readContract(config, {
        abi: CARBON_CAPTURE_ABI,
        address: CAPTURE_CONTRACT_ADDRESS as Address,
        functionName: 'getIndustryDetails',
        args: [
            address
        ],
        account: address
    })

    if (
        Array.isArray(result)
    ) {
        return {
                walletAddress: result[0] as unknown as string,
                industryName: result[1] as unknown as string,
                city: result[2] as unknown as string,
                latitude: result[3] as unknown as string,
                longitude: result[4]as unknown as string,
                verified: result[5] as unknown as boolean
        }

    }

    return null
}

export async function getListCapturedCarbonByIndustry(address: Address): Promise<CaptureData[]> {
    const result = await readContract(config, {
        abi: CARBON_CAPTURE_ABI,
        address: CAPTURE_CONTRACT_ADDRESS as Address,
        functionName: 'listCapturedCarbonByIndustry',
        args: [
            address
        ],
        account: address
    })
 
    if (
        Array.isArray(result)
    ) {
        return result

    }

    return []
}

export async function getCarbonCaptured(address: Address, year: number, month: number){
    const result = await readContract(config, {
        abi: CARBON_CAPTURE_ABI,
        address: CAPTURE_CONTRACT_ADDRESS as Address,
        functionName: 'getCarbonCaptured',
        args: [
            address,
            BigInt(year),
            BigInt(month),
        ],
        account: address
    })

    return result
}

export async function getTotalCarbonCaptured(address: Address, industryAddress: Address){
    const result = await readContract(config, {
        abi: CARBON_CAPTURE_ABI,
        address: CAPTURE_CONTRACT_ADDRESS as Address,
        functionName: 'getTotalCarbonCaptured',
        args: [
            industryAddress
        ],
        account: address
    })

    return result
}

export async function getTotalCarbonCapturedAllIndustries(address: Address){
    const result = await readContract(config, {
        abi: CARBON_CAPTURE_ABI,
        address: CAPTURE_CONTRACT_ADDRESS as Address,
        functionName: 'getTotalCarbonCapturedAllIndustries',
        args: [],
        account: address
    })

    return result
}