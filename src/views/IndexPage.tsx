import Layout from "@/components/Layout/Main";
import React, { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { getChainNetwork } from "@/configurations/chains";
import StackedIndustries from "@/components/Stacked/Industries";
import BoxCapture from "@/components/Box/Capture";

const indexPage: React.FC = () => {
  const { address, status } = useAccount();
  const [refetch, setRefetch] = useState<boolean>(true);
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
      <div className="flex flex-col min-h-screen gap-6">
        <section className="w-full">
          <BoxCapture
            address={address as Address}
          />
        </section>
        <section className="w-full">
          <StackedIndustries
            address={address as Address}
            refecth={refetch}
            setRefetch={setRefetch}
          />
        </section>
      </div>
    </Layout>
  );
}


export default indexPage