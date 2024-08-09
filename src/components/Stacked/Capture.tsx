import ReloadIcon from "@/assets/svg/ReloadIcon";
import SpinIcon from "@/assets/svg/SpinIcon";
import VerifiedIcon from "@/assets/svg/VerifiedIcon";
import { DEFAULT_ADDRESS } from "@/configurations/common";
import { useDarkMode } from "@/context/DarkModeContext";
import { useIndustryCaptured } from "@/hooks/useIndustries";
import { CaptureData } from "@/types/capture";
import { verifyCarbon } from "@/utils/contract/write";
import { getMonthName } from "@/utils/date";
import { formatNumber } from "@/utils/number";
import classNames from "classnames";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Address, Hash } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";

interface StackedCaptureProps {
    address: string | undefined;
    refecth: boolean;
    setRefetch: Dispatch<SetStateAction<boolean>>;
}

const StackedCapture: React.FC<StackedCaptureProps> = ({ address, refecth, setRefetch }) => {
    const { data, isLoading, isRefetching, refetch: refetchData } = useIndustryCaptured(address as Address)
    const {address: connectAddress } = useAccount()
    const { darkMode } = useDarkMode()
    const [hash, setHash] = useState<Hash | undefined>(undefined)
    const { isLoading: loadingTransaction, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: hash,
    });

    useEffect(() => {
        if (!isConfirmed) return

        toast.success('Verify data was successfull')
        setRefetch(true)
    }, [isConfirmed])

    useEffect(() => {
        refetchData()
        setRefetch(false)
    }, [address, refecth])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <SpinIcon addClassName="animate-spin -ml-1 mr-3 text-white h-20 w-20 text-aha-green-light" />
            </div>
        )
    }

    const handleClick = (e: MouseEvent<SVGSVGElement>) => {
        e.preventDefault()
        refetchData()
    }
    
    const handleClickVerify = async (params: CaptureData) => {
        try {
            const txHash = await verifyCarbon(connectAddress as Address, {
                ...params,
                walletAddress: address
            })

            if (txHash) {
                setHash(txHash)
            }

        } catch (e) {
            console.log('capture', e)
            toast.error("There was an error durring verify capture data, try again in moment")
        }
    }

    return (
        <div className="w-full">
            <div className="flex justify-between mb-4">
                {address && <h3 className="text-3xl font-bold">History</h3>}
                {address && <ReloadIcon
                    addClassName={classNames({
                        'font-bold w-8 h-8 cursor-pointer mx-4': true,
                        'animate-spin': isLoading || isRefetching
                    })}
                    onClick={handleClick}
                    darkMode={darkMode}
                />}
            </div>
            <div className="px-2 py-4 md:space-y-5 bg-green-200 shadow-xl rounded-sm bg-opacity-60 dark:bg-opacity-30">
                <ul role="list" className="divide-y divide-gray-600 dark:divide-gray-400 px-4">
                    {
                        data && data?.map((val, key) => (
                            <li key={key} className="flex justify-between gap-x-6 py-2">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="flex-none items-center justify-center self-center w-20 h-20 rounded-full bg-green-500 text-white font-bold text-center text-5xl">
                                        <img src="/png/logo-5.png" alt="CarbonTrack Logo" className="w-20 h-20" />&nbsp;
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 text-center">
                                    <p className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                                        {getMonthName(Number(val.month) - 1)}&nbsp;{Number(val.year)}
                                    </p>
                                    <p className="mt-1 font-bold text-2xl leading-5 text-gray-500 dark:text-gray-300">
                                        {formatNumber(Number(val.carbonCaptured), 0, 0)} Tons
                                    </p>
                                </div>
                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                    <VerifiedIcon addClassName="" size={60} color={val.verified ? '#22c55e' : '#ffc107'} />
                                    {
                                        connectAddress === DEFAULT_ADDRESS && (
                                            <button 
                                                className="btn bg-green-500 px-6 py-1 mt-2" 
                                                onClick={() => handleClickVerify(val)}
                                                disabled={loadingTransaction}
                                            >
                                                Verify
                                            </button>
                                        )
                                    }
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default StackedCapture