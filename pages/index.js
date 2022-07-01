import Head from "next/head"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader"
import LotteryEntrance from "../components/LotteryEntrance"
import { useMoralis } from "react-moralis"
import Header from "../components/Header"

const supportedChains = ["31337", "4"]

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()

    return (
        // <div className={styles.container}>
        <div>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* dodajemy zaimportowany Header */}
            {/* <ManualHeader></ManualHeader> */}
            <Header />
            <LotteryEntrance />
        </div>
    )
}
