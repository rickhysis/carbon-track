import { MouseEvent } from "react";
import LiskIcon from "@/assets/svg/LiskIcon";
import ReloadIcon from "@/assets/svg/ReloadIcon";
import { useDarkMode } from "@/context/DarkModeContext";
import { formatNumber } from "@/utils/number";
import classNames from "classnames";
import { Address } from "viem";
import { useBalance } from "wagmi";

interface IcoBalanceProps {
    page?: string | undefined;
    address: string;
    title: string;
}

const Balance: React.FC<IcoBalanceProps> = ({ page, title, address }) => {
    const { data: balance, isLoading, isRefetching, refetch } = useBalance({ address: address as Address })
    const { darkMode } = useDarkMode();

    const handleClick = (e: MouseEvent<SVGSVGElement>) => {
        e.preventDefault()
        refetch()
    }

    return (
        <div className="flex justify-between">
            <h2 className="font-bold text-2xl">{title}</h2>
            <div className="flex relative">
                <ReloadIcon
                    addClassName={classNames({
                        'font-bold w-4 h-4 cursor-pointer': true,
                        'animate-spin': isLoading || isRefetching
                    })}
                    onClick={handleClick}
                    darkMode={darkMode}
                />&nbsp;
                <p className={classNames({
                    'font-bold text-right': true,
                    'text-red-500': page === 'capture' && Number(balance?.formatted) < 0.00000001
                })}> {formatNumber(Number(balance?.formatted || 0), 0, 6)} LISK</p> &nbsp;
                <LiskIcon addClassName="w-6 h-6" />
            </div>
        </div>
    )
}

export default Balance