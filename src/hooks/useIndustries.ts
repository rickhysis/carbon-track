import { CaptureData } from '@/types/capture';
import { IndustryData } from '@/types/industry';
import { getIndustriesByLimit, getListCapturedCarbonByIndustry, getNextIndustry } from '@/utils/contract/read';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { Address } from 'viem';

export const fetchIndustries = async (address: Address, limit: number): Promise<IndustryData[]> => {
    const next = await getNextIndustry(address);
    const size = Math.max(Number(next) - 10, 1)
    const response = await getIndustriesByLimit(address, size, limit)

    return response;
};

export const fetchIndustryCaptured = async (address: Address): Promise<CaptureData[]> => {
    if(address === undefined) return []

    const response = await getListCapturedCarbonByIndustry(address)

    return response
};

export const useIndustries = (address: Address, limit: number) : UseQueryResult<IndustryData[], Error> => {
    return useQuery<IndustryData[], Error>({
        queryKey: ['industries'],
        queryFn: () => fetchIndustries(address, limit),
        staleTime: 2000000,
    });
};


export const useIndustryCaptured = (address: Address) : UseQueryResult<CaptureData[], Error> => {
    return useQuery<CaptureData[], Error>({
        queryKey: ['industryCaptured'],
        queryFn: () => fetchIndustryCaptured(address),
        staleTime: 2000000,
        initialData: []
    });
};



