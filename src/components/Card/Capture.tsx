import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getIndustryDetails, getTotalCarbonCaptured } from "@/utils/contract/read";
import { Address } from "viem";
import { IndustryData } from "@/types/industry";
import { getCityName } from "@/utils/map";
import MapWithMarker from "../Maps/MapWithMarker";

interface CardCaptureProps {
    address: string;
    refetch: boolean;
    setRefetch: Dispatch<SetStateAction<boolean>>;
}

const DEFAULT_INDSUTRY_DATA = {
    walletAddress: '',
    industryName: '',
    city: '',
    latitude: '',
    longitude: '',
    verified: false
}

const CardCapture: React.FC<CardCaptureProps> = ({ address, refetch, setRefetch }) => {
    const [industry, setIndustry] = useState<IndustryData>(DEFAULT_INDSUTRY_DATA);
    const [totalCaptured, setTotalCaptured] = useState<number>(0)

    useEffect(() => {
        (async () => {
            const result = await getIndustryDetails(address as Address)
            const total = await getTotalCarbonCaptured(address as Address, address as Address)

            if (result) {
                setIndustry(result)
                setTotalCaptured(Number(total))
            }

            setRefetch(false)
        })()

        if (address == undefined) {
            setTotalCaptured(0)
            setIndustry(DEFAULT_INDSUTRY_DATA)
        }

    }, [address, refetch]);


    return (
        <div className="gap-y-4">
            <div className="space-y-1 font-semibold text-lg text-justify">
                <div className="grid grid-cols-3">
                    <div className="col-span-1">Industry Name:</div>
                    <div className="col-span-2 text-right">
                        {industry.industryName}
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <div className="col-span-1">City:</div>
                    <div className="col-span-2 text-right">
                        {getCityName(Number(industry.city))}
                    </div>
                </div>
                <div className="grid grid-cols-3">
                    <div className="col-span-1">Position:</div>
                    <div className="col-span-2 text-right">
                        {industry.latitude} - {industry.longitude}
                    </div>
                </div>
            </div>

            <div className="space-y-4 font-medium text-center mt-4">
                {address !== null ? (
                    <div className="flex items-center justify-between h-12 px-2 font-semibold text-xl sm:px-2 bg-green-400 bg-opacity-30">
                        <div className="col-span-1">Total Produced</div>

                        <div className="col-span-1 text-aha-green-light dark:text-green-400 flex items-center space-x-0.5">
                            <i className="bx text-3xl bx-stopwatch"></i>

                            <figure className="flex items-center justify-evenly gap-0.5">
                                <div className="flex items-center gap-0.5 mr-2">
                                    <label className="text-xl sm:text-2xl">{totalCaptured} Tons</label>
                                </div>
                            </figure>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-12 px-2 font-semibold sm:px-16 bg-aha-green-lighter bg-opacity-30">
                        No active data
                    </div>
                )}
            </div>

            <div className="flex justify-center mt-10">
                <MapWithMarker lat={Number(industry.latitude)} lon={Number(industry.longitude)} />
            </div>
        </div>
    );
};

export default CardCapture;
