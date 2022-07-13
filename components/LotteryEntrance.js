import { useWeb3Contract } from "react-moralis"
import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, isFetching, isLoading } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

export default function LotteryEntrance() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex) // parsInt jest z JS
    // console.log(`ChainId is ${chainId}`)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
    const [entranceFee, setEntranceFee] = useState("0") //
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        // data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    /* View Functions */

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getPlayersNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUIValues() {
        // Another way we could make a contract call:
        // const options = { abi, contractAddress: raffleAddress }
        // const fee = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     ...options,
        // })
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getPlayersNumber()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        // useEffect rerenderuje stronę
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])
    // no list means it'll update everytime anything changes or happens
    // empty list means it'll run once after the initial rendering
    // and dependencies mean it'll run whenever those things in the list change

    // An example filter for listening for events, we will learn more on this next Front end lesson
    // const filter = {
    //     address: raffleAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    // Probably could add some error handling
    const handleSuccess = async (tx) => {
        await tx.wait(1)
        updateUIValues()
        handleNewNotification(tx)
    }

    return (
        <div>
            <h1 className="pb-5 grid place-content-center font-bold text-6xl bg-[#cbd5e1] text-[#1e293b]">
                Lottery
            </h1>
            {raffleAddress ? (
                <div className="pb-5 grid place-items-center">
                    <div className=" pb-7 pt-5 ">
                        <div className="flex flex-wrap font-bold">
                            The recent winner was:
                            <a
                                className="text-blue-600 px-1"
                                target="_blank"
                                rel="noopener noreferrer"
                                href={"https://rinkeby.etherscan.io/address/" + recentWinner}
                            >
                                {`${recentWinner.slice(0, 4)}...${recentWinner.slice(-4)}`}
                            </a>
                        </div>
                        <div className="flex font-bold">
                            The current number of players is:
                            <div className="text-blue-600 px-1"> {numberOfPlayers}</div>
                        </div>

                        <div className="flex font-bold pb-4">
                            Entrance Fee:
                            <div className="text-blue-600 px-1">
                                {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                            </div>
                        </div>
                    </div>
                    <button
                        className=" bg-slate-700 hover:bg-slate-800 text-white font-bold py-1 px-4 rounded"
                        onClick={async () =>
                            await enterRaffle({
                                // onComplete:
                                onSuccess: handleSuccess, // wysłanie tranzakcji do MM dlatego musimy wait(1) na potwierdzenie i wyswietlenie notyfikacji
                                onError: (error) => console.log(error),
                            })
                        }
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full "></div>
                        ) : (
                            "Enter Raffle"
                        )}
                    </button>
                </div>
            ) : (
                <div className=" grid place-content-center font-bold text-red-600">
                    Please connect to a Rinkeby Testnet{" "}
                </div>
            )}
        </div>
    )
}
