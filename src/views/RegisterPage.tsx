import Balance from "@/components/Box/Balance";
import CardIndustries from "@/components/Card/Industries";
import RegisterProject from "@/components/Form/RegisterProject";
import Layout from "@/components/Layout/Main";
import { getChainNetwork } from "@/configurations/chains";
import React, { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount, useChainId, useSwitchChain } from "wagmi";


const RegisterPage: React.FC = () => {
    const { address, status } = useAccount();
    const [refetch, setRefetch] = useState<boolean>(false)
    const { switchChainAsync } = useSwitchChain();
    const chainId = useChainId()


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
            <div className="flex flex-col md:flex-row justify-center gap-x-8">
                <section className="w-full md:w-2/3 px-4 sm:px-10 py-10 md:space-y-5 bg-green-200 shadow-xl rounded-sm bg-opacity-60 dark:bg-opacity-30">
                    <Balance page="register" title="Post on Smartcontract" address={address as string} />
                    <RegisterProject
                        address={address as Address}
                        setRefetch={setRefetch}
                    />
                </section>
                <section className="w-full md:w-1/3 px-2 py-4 md:space-y-5 bg-green-200 shadow-xl rounded-sm bg-opacity-60 dark:bg-opacity-30">
                    <CardIndustries
                        address={address}
                        refecth={refetch}
                        setRefetch={setRefetch}
                    />
                </section>
            </div>
        </Layout>
    );
}


export default RegisterPage