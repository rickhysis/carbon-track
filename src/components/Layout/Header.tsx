import LightSunIcon from "@/assets/svg/LightSunIcon";
import NightMoonIcon from "@/assets/svg/NightMoonIcon";
import WalletIcon from "@/assets/svg/WalletIcon";
import { useDarkMode } from "@/context/DarkModeContext";
import { MouseEvent } from "react";

interface HeaderProps {
    address: string | undefined;
    handleConnect: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void,
}

const Header: React.FC<HeaderProps> = ({ handleConnect, address }) => {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <header className="w-full bg-green-500 sm:px-8 px-2 flex justify-between items-center border-b-2 dark:border-gray-600/50">

            <nav className="">
                <a href="/" className="flex py-1">
                    <img src="/png/logo.png" alt="CarbonTrack Logo" className="w-16 h-16" />&nbsp;
                    <p className="text-4xl text-white font-mono hidden md:block m-auto font-black">CarbonTrack</p>
                </a>
            </nav>

            <nav className="flex space-x-4">

                <div onClick={toggleDarkMode}>
                    {darkMode ? <LightSunIcon addClassName="text-white hover:bg-gray-700 rounded-lg p-1" /> : <NightMoonIcon addClassName="hover:bg-gray-200 text-white rounded-lg p-1" />}
                </div>

                <button className="border-2 border-white text-white px-2 sm:py-1 rounded-xl text-sm md:text-base" onClick={handleConnect} >
                    <span className="flex items-center space-x-2">
                        <span>{address ? `${address.slice(0, 6)}........${address.slice(address.length - 4, address.length)}`.toLowerCase() : 'Connect to wallet'}</span>
                        <WalletIcon addClassName="w-6 h-6" color="#ffffff" />
                    </span>
                </button>
            </nav>
        </header>
    )
}

export default Header