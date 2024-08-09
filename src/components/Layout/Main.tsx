import React, { MouseEvent } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";

import { useAccount } from "wagmi";
import Header from "./Header";
import { OpenParams } from "@/types/account";
import classNames from "classnames";

interface LayoutProps {
    children: React.ReactNode;
    type: string;
}

const Layout: React.FC<LayoutProps> = ({ children, type }) => {
    const { open } = useWeb3Modal();
    const { address } = useAccount();

    const handleConnect = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>): void => {
        e.preventDefault();
        if (address) {
            open({ view: "Account" } as OpenParams);
        } else {
            open({ view: "Connect" } as OpenParams);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">

            <Header handleConnect={handleConnect} address={address} />

            <main className={classNames({
                "w-full max-w-screen-2xl px-2 md:px-10 py-8 mx-auto gap-x-5 gap-y-10": type === 'default',
                "grid grid-cols-2 w-full max-w-screen-2xl sm:px-10 px-4 pt-8 pb-20 mx-auto gap-x-8 gap-y-10": type === 'capture'
            })}>
                {children}
            </main>

        </div>
    );
};

export default Layout;