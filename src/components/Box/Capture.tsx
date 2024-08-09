import { getNextIndustry, getTotalCarbonCapturedAllIndustries } from "@/utils/contract/read";
import { formatNumber } from "@/utils/number";
import { useEffect, useState } from "react";
import { Address } from "viem";

interface BoxCaptureProps {
    address: string | undefined;
}

const BoxCapture: React.FC<BoxCaptureProps> = ({ address }) => {
    const [totalIndustry, setTotalIndustry] = useState<number>(0)
    const [totalCapture, setTotalCaptured] = useState<number>(0)

    useEffect(() => {
        (async () => {
            const industries = await getNextIndustry(address as Address)
            const captured = await getTotalCarbonCapturedAllIndustries(address as Address)

            setTotalIndustry(Number(industries) - 1)
            setTotalCaptured(Number(captured))
        })()

    }, [address]);


    return (
        <div className="flex justify-end min-h-full w-full gap-4">
            <div className="flex flex-col gap-4 px-6 py-6 bg-green-200 shadow-xl rounded-sm bg-opacity-60 dark:bg-opacity-30">
                <div className="font-semibold text-xl">Total Industry</div>
                <div className="font-bold text-right text-3xl">
                    {totalIndustry}
                </div>
            </div>
            <div className="flex flex-col gap-4 px-6 py-6 bg-green-200 shadow-xl rounded-sm bg-opacity-60 dark:bg-opacity-30">
                <div className="font-semibold text-xl">Total Captured</div>
                <div className="font-bold text-right text-3xl">
                    {formatNumber(totalCapture, 0, 0)} Tons
                </div>
            </div>
        </div>
    )
}

export default BoxCapture