import SpinIcon from "@/assets/svg/SpinIcon";
import { useIndustries } from "@/hooks/useIndustries";
import { getCityName } from "@/utils/map";
import { formatNumber } from "@/utils/number";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Address } from "viem";

interface StackedIndustriesProps {
    address: string | undefined;
    refecth: boolean;
    setRefetch: Dispatch<SetStateAction<boolean>>;
}

const StackedIndustries: React.FC<StackedIndustriesProps> = ({ address, refecth, setRefetch }) => {
    const { data, isLoading, refetch: refetchData } = useIndustries(address as Address, 25)

    useEffect(() => {
        if (refecth) {
            refetchData()
            setRefetch(false)
        }
    }, [refecth])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <SpinIcon addClassName="animate-spin -ml-1 mr-3 text-white h-20 w-20 text-aha-green-light" />
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-between items-stretch min-h-full">
            <ul role="list" className="flex flex-col gap-4 py-4">
                {
                    data && data?.map((val) => (
                        <li className="bg-green-300 shadow-xl rounded-sm bg-opacity-60 dark:bg-opacity-30">
                            <a href={`/capture/${val.walletAddress}`} className="flex justify-between gap-x-6 p-4">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="flex-none items-center justify-center self-center w-14 h-14 rounded-full bg-green-500 text-white font-bold text-center text-5xl">
                                        {(val.industryName || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">{val.industryName}</p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500 dark:text-gray-300">{val.walletAddress}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <p className="text-2xl">
                                        {formatNumber(Number(val.carbonCaptured), 0, 0)} Tons
                                    </p>
                                </div>
                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                    <p className="text-md leading-6 text-gray-900 dark:text-gray-100">{getCityName(Number(val.city))}</p>
                                    <a
                                        href={`https://www.google.com/maps/@${val.latitude},${val.longitude},15z`}
                                        className="truncate mt-1 text-xs leading-5 text-gray-500 dark:text-gray-300"
                                        target="_blank"
                                    >
                                        {val.latitude}, {val.longitude}
                                    </a>
                                </div>
                            </a>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default StackedIndustries