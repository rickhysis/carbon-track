import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Address, Hash, isAddress } from "viem";
import { useBalance, useWaitForTransactionReceipt } from "wagmi";
import SpinIcon from "@/assets/svg/SpinIcon";
import classNames from "classnames";
import { getChainNetwork } from "@/configurations/chains";
import CitySelectBox from "./Select/City";
import ClickableMap from "../Maps/ClickableMap";
import { useForm, SubmitHandler } from 'react-hook-form';
import { IndustryData } from "@/types/industry";
import { registerIndustry } from "@/utils/contract/write";
import ConnectButton from "../Buttons/Connect";

interface RegisterProjectProps {
    address: string | undefined;
    setRefetch: Dispatch<SetStateAction<boolean>>;
}

const chain = getChainNetwork()

const RegisterProject: React.FC<RegisterProjectProps> = ({ address, setRefetch }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IndustryData>();
    const [loadingButton, setLoadingButton] = useState<boolean>(false)
    const { data: balance } = useBalance({ address: address as Address });
    const [hash, setHash] = useState<Hash | undefined>(undefined)
    const { isLoading: loadingTransaction, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: hash,
    });

    useEffect(() => {
        if (!isConfirmed) return

        toast.success('Transfer was successfull')
        setLoadingButton(false)
        setRefetch(true)
    }, [isConfirmed])

    const handleRegisterProject: SubmitHandler<IndustryData> = async (data) => {
        if (Number(balance?.value) < 10) {
            toast.warning(`Your LISK is lower than 10 wei please top up your BNB because gas fee is required to pay for the computational effort needed to process the transaction`)
            return
        }

        try {
            // loading button
            setLoadingButton(true)
            const txHash = await registerIndustry(address as Address, data)

            if (txHash) {
                setHash(txHash)
            }

        } catch (e) {
            console.log('transfer', e)
            setLoadingButton(false)
            toast.error("There was an error during create a project, try again in moment")
        }

    };

    return (
        <form onSubmit={handleSubmit(handleRegisterProject)} className="grid space-y-5">
            <div className="col-span-full">
                <label htmlFor="wallet-address" className="block text-sm font-medium leading-6">Wallet Address</label>
                <div className="mt-2">
                    <input
                        className="appearance-none border py-4 pl-4 text-xl bg-emerald-100 dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 placeholder:dark:text-gray-200 focus:placeholder-gray-600 transition rounded-sm w-full outline-none"
                        type="text"
                        placeholder="0x8638as612cwjyn291263asdx121"
                        {...register('walletAddress', {
                            required: 'Ethereum address is required',
                            validate: (value) =>
                                isAddress(value) || 'Invalid Ethereum address',
                        })}
                    />
                    {errors.walletAddress && (
                        <p className="mt-3 text-sm leading-6 text-red-500">
                            {errors.walletAddress.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="col-span-full">
                <label htmlFor="project-name" className="block text-sm font-medium leading-6">Industry Name</label>
                <div className="mt-2">
                    <input
                        className="appearance-none border py-4 pl-4 text-xl bg-emerald-100 dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 placeholder:dark:text-gray-200 focus:placeholder-gray-600 transition rounded-sm w-full outline-none"
                        type="text"
                        placeholder="Papua green forest"
                        {...register('industryName', {
                            required: 'Industry name is required',
                        })}
                    />
                    {errors.industryName && (
                        <p className="mt-3 text-sm leading-6 text-red-500">
                            {errors.industryName.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="col-span-full">
                <ClickableMap
                    setValue={setValue}
                />
            </div>
            <div className="col-span-full">
                <label htmlFor="latitude" className="block text-sm font-medium leading-6">Latitude</label>
                <div className="mt-2">
                    <input
                        className="appearance-none border py-4 pl-4 text-xl bg-emerald-100 dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 placeholder:dark:text-gray-200 focus:placeholder-gray-600 transition rounded-sm w-full outline-none"
                        type="text"
                        placeholder="-1.12312"
                        {...register('latitude', {
                            required: 'Latitude is required'
                        })}
                    />
                    {errors.latitude && (
                        <p className="mt-3 text-sm leading-6 text-red-500">
                            {errors.latitude.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="col-span-full">
                <label htmlFor="longitude" className="block text-sm font-medium leading-6">Logitude</label>
                <div className="mt-2">
                    <input
                        className="appearance-none border py-4 pl-4 text-xl bg-emerald-100 dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 placeholder:dark:text-gray-200 focus:placeholder-gray-600 transition rounded-sm w-full outline-none"
                        type="text"
                        placeholder="7.1231231"
                        {...register('longitude', {
                            required: 'Longitude is required'
                        })}
                    />
                    {errors.longitude && (
                        <p className="mt-3 text-sm leading-6 text-red-500">
                            {errors.longitude.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="col-span-full">
                <label htmlFor="city" className="block text-sm font-medium leading-6">City</label>
                <div className="mt-2">
                    <CitySelectBox
                        setValue={setValue}
                        {...register('city', {
                            required: 'City is required'
                        })}
                    />
                </div>
                {errors.city && (
                    <p className="mt-3 text-sm leading-6 text-red-500">
                        {errors.city.message}
                    </p>
                )}
            </div>

            <div className="relative">
                {address ?
                    (
                        <button
                            className={classNames({
                                'btn bg-green-500 text-white w-full block px-2 py-4 gap-x-2 text-xl text-center rounded-r-sm': true,
                                //'bg-opacity-50 pointer-events-none': !saleActive,
                                'flex justify-center': loadingButton
                            })}
                            disabled={loadingButton}
                            type="submit"
                        >
                            {
                                loadingButton ? (
                                    <SpinIcon
                                        addClassName={classNames({
                                            'w-8 h-8': true,
                                            'animate-spin': loadingButton
                                        })}
                                    />
                                ) : "Post" 
                            }
                        </button>
                    ) : (
                        <ConnectButton
                            className={classNames({
                                'btn bg-green-500 text-white w-full block px-2 py-4 gap-x-2 text-xl text-center rounded-r-sm': true,
                                'flex justify-center': loadingButton
                            })}
                            address={address}
                            loadingButton={loadingButton}
                        />
                    )
                }
            </div>

            {loadingTransaction && (<div className="relative">
                <p className="text-center">Waiting for transaction to be confirmed...</p>
            </div>)}
            {isConfirmed && (<div className="overflow-hidden">
                <p className="text-wrap text-center truncate text-ellipsis">
                    Tx Hash:  <a className="text-gray-500" target="_blank" href={`${chain.blockExplorers?.default.url}/tx/${hash}`}>{hash}</a>
                </p>
            </div>)}
        </form>
    )
}

export default RegisterProject