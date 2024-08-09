import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react"
import { toast } from "react-toastify"
import SpinIcon from "../../assets/svg/SpinIcon"

import classNames from "classnames"

//import { SUCCESS_STATUS, getTransactionConfirmed } from "@/utils/wagmi"
import { Address, Hash } from "viem"
import { formatInputNumber } from "@/utils/number"
import { useBalance, useWaitForTransactionReceipt } from "wagmi"
import { MONTH_LABEL, getCurrentYear } from "../../utils/date"
import { captureCarbon } from "@/utils/contract/write"
import { SubmitHandler, useForm } from "react-hook-form"
import { CaptureData } from "@/types/capture"
import { getChainNetwork } from "@/configurations/chains"

interface CaptureProps {
    address: string | undefined;
    setRefetch: Dispatch<SetStateAction<boolean>>;
}

const chain = getChainNetwork()

const Capture: React.FC<CaptureProps> = ({ address, setRefetch }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<CaptureData>({
        defaultValues: {
            year: getCurrentYear()
        }
    });
    const [loadingButton, setLoadingButton] = useState<boolean>(false)
    const [buttonSelected, setButtonSelected] = useState<number>(0)
    const { data: balance } = useBalance({ address: address as Address })
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

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = e.target;
        // Remove commas for validation
        const numericValue = value.replace(/,/g, '')

        if (/^\d*$/.test(numericValue)) {
            const numberValue = parseInt(numericValue, 10)
            if (!isNaN(numberValue) || value === '') {
                const formatAmount = formatInputNumber(numericValue)

                setValue('amount', formatAmount)
            }
        }
    };

    const handleKeyDownAmount = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        const controlKeys = [
            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'
        ];
        if (!controlKeys.includes(e.key) && !/^\d$/.test(e?.key)) {
            e.preventDefault();
        }
    };

    const handleMonth = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>): void => {
        e.preventDefault()
        const { id } = e.target as HTMLButtonElement
        const index = Number(id) + 1

        setValue('month', index)
        setButtonSelected(index)
    }

    const handleCapture: SubmitHandler<CaptureData> = async (data) => {

        // Remove commas for validation
        const numericAmount = data.amount.replace(/,/g, '')

        if (Number(balance?.value) < 10) {
            toast.warning(`Your LISK is lower than 10 wei please top up your BNB because gas fee is required to pay for the computational effort needed to process the transaction`)
            return
        }

        try {
            // loading button
            setLoadingButton(true)
            // ask to pemitted for approve their balance
            const txHash = await captureCarbon(address as Address, {
                amount: numericAmount,
                month: data.month,
                year: data.year
            })

            if (txHash) {
                setHash(txHash)
            }

        } catch (e) {
            console.log('capture', e)
            setLoadingButton(false)
            toast.error("There was an error durring capture data, try again in moment")
        }
    }
    
    return (
        <form onSubmit={handleSubmit(handleCapture)} className="flex flex-col gap-y-5">
            <div className="">

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-1 gap-y-2 rounded-lg shadow-sm">
                    {
                        MONTH_LABEL.map((v, k) => (
                            <button
                                key={k}
                                id={`${k}`}
                                type="button"
                                className={classNames({
                                    "btn w-full px-2 py-4 items-center md:text-xl text-sm rounded-sm text-white": true,
                                    "border-b-0 border-r-2 last:border-r-0 font-medium dark:border-gray-200": true,
                                    "hover:bg-green-700 focus:bg-green-900 active:bg-green-900": true,
                                    "bg-green-500": buttonSelected !== k + 1,
                                    "bg-green-900": buttonSelected === k + 1
                                })}
                                onClick={handleMonth}
                                {...register('month', {
                                    required: 'Please select the month first'
                                })}
                            >
                                {v}
                            </button>
                        ))
                    }
                </div>

                {errors.month && (
                    <p className="mt-3 text-base leading-6 text-red-500">
                        {errors.month.message}
                    </p>
                )}
            </div>

            <div className="flex rounded-lg shadow-sm gap-x-2">
                <div className="w-1/4">
                    <input
                        className="appearance-none border py-4 pl-4 text-xl bg-emerald-100 dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 placeholder:dark:text-gray-200 focus:placeholder-gray-600 transition rounded-sm w-full outline-none"
                        type="number"
                        placeholder={`${getCurrentYear()}`}
                        onKeyDown={handleKeyDownAmount}
                        disabled={address === undefined}
                        {...register('year', {
                            required: 'Year is required',
                        })}
                    />
                    {errors.year && (
                        <p className="mt-3 text-base leading-6 text-red-500">
                            {errors.year.message}
                        </p>
                    )}

                </div>
                <div className="w-3/4">
                    <div className="relative">
                        <input
                            className="appearance-none border py-4 pl-4 text-xl bg-emerald-100 dark:bg-gray-700 text-black dark:text-white placeholder:text-gray-500 placeholder:dark:text-gray-200 focus:placeholder-gray-600 transition rounded-sm w-full outline-none"
                            placeholder="Amount"
                            onKeyDown={handleKeyDownAmount}
                            disabled={address === undefined}
                            {...register('amount', {
                                required: 'Amount is required',
                                onChange: handleChangeAmount
                            })}
                        />
                        <div className="absolute right-0 inset-y-0 flex items-center p-2 font-bold text-lg">
                            <p className="uppercase">Tons</p>
                        </div>
                    </div>
                    {errors.amount && (
                        <p className="mt-3 text-base leading-6 text-red-500">
                            {errors.amount.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex rounded-lg shadow-sm">
                <button
                    className={classNames({
                        'btn w-full bg-green-500 items-center py-4 px-2 font-semibold text-lg text-center rounded-r-sm text-white': true,
                        //'bg-opacity-50 pointer-events-none': !saleActive,
                        'inline-flex justify-center': loadingButton
                    })}
                    type="submit"
                    disabled={loadingButton || address === undefined}
                >
                    {loadingButton ? <><SpinIcon
                        addClassName="animate-spin -ml-1 mr-3 text-white h-6 w-6"
                    /> Processing</> : 'Capture'}
                </button>
            </div>

            {loadingTransaction && (<div className="relative">
                <p className="text-center">Waiting for transaction to be confirmed...</p>
            </div>)}
            {isConfirmed && (<div className="overflow-hidden">
                <p className="text-wrap text-center truncate text-ellipsis">
                    Tx Hash:  <a className="text-gray-500" target="_blank" href={`${chain.blockExplorers?.default.url}/tx/${hash}`}>{hash}</a>
                </p>
            </div>)}

            <div className="flex flex-col justify-between p-2 gap-2">
                <p className="text-md self-end">Not working?&nbsp;
                    <a href="https://t.me/AnagataGlobal" className="font-bold text-aha-green-lighter hover:text-[#22c55e]">
                        Contact support
                    </a>
                </p>
            </div>
        </form>
    )
}


export default Capture;