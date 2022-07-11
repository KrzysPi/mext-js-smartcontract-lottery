import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <>
            <nav className=" bg-[#1e293b] text-slate-100 border-b-2 flex">
                <h1 className="py-4 px-4 font-bold text-3xl"> Decentralized Lottery</h1>
                <div className="ml-auto py-4 px-4">
                    <ConnectButton chainId={4} moralisAuth={false} />
                </div>
            </nav>
        </>
    )
}
