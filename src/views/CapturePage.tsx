import GasFee from "@/components/Description/GasFee";
import Layout from "@/components/Layout/Main";
import ModalInfo from "@/components/Modal/ModalInfo";
import { useStore } from "@/context/StoreContext";
import React, { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import Capture from "../components/Form/Capture";
import CardCapture from "@/components/Card/Capture";
import Balance from "@/components/Box/Balance";
import { getChainNetwork } from "@/configurations/chains";
import StackedCapture from "@/components/Stacked/Capture";
import { useParams } from "react-router-dom";

const CapturePage: React.FC = () => {
    const { walletAddress } = useParams();
    const { address, status } = useAccount();
    const { gasInfo, setGasInfo } = useStore();
    const [refetch, setRefetch] = useState<boolean>(true);
    const { switchChainAsync } = useSwitchChain();
    const chainId = useChainId()

    const closeModal = () => setGasInfo(false);

    useEffect(() => {
        (async () => {
            const liskChain = getChainNetwork()
            if (chainId !== liskChain.id) {
                await switchChainAsync({ chainId: liskChain.id });
            }
        })()
    }, [status])

    return (
        <Layout type="default">
            <div className="flex flex-col md:flex-row justify-center gap-y-6 gap-x-8">
                <section className="w-full px-2 sm:px-10 py-6 md:space-y-5 bg-green-200 shadow-xl rounded-sm bg-opacity-60 dark:bg-opacity-30">
                    <CardCapture

                        address={(walletAddress || address) as Address}
                        refetch={refetch}
                        setRefetch={setRefetch}
                    />
                </section>
                <section className="w-full px-2 py-4 md:space-y-5 bg-green-200 shadow-xl rounded-sm bg-opacity-60 dark:bg-opacity-30">
                    <Balance title="" address={address as string} />
                    <Capture
                        address={address}
                        setRefetch={setRefetch}
                    />
                </section>
            </div>

            <div className="flex flex-col my-5 gap-6">
                <section className="flex flex-col md:flex-row justify-center gap-y-4">
                    {(walletAddress || address) && <StackedCapture
                        address={(walletAddress || address) as Address}
                        refecth={refetch}
                        setRefetch={setRefetch}
                    />}
                </section>
            </div>

            <ModalInfo
                isOpen={gasInfo}
                onClose={closeModal}
                title="Gas Fees"
                closeText="I understand"
            >
                <GasFee />
            </ModalInfo>
        </Layout>
    );
}


export default CapturePage