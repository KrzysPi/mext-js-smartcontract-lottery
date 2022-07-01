// This file is to show what making a connect button looks like behind the scenes!

import { useEffect } from "react" // główny hook Reacta
import { useMoralis } from "react-moralis"

// Top navbar
export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis() // useMoralis to React "Hook" jest to sposób na śledzenie stanu naszej aplikacji bez urzywania class w HTML. enableWeb3 jest jedną z funkcji jaką ma w sobie hook o nazwie useMoralis(), która umożliwia nam sprawdzenie czy metamask został podłączony

    // //  useEffect(funcja, dependencie arr) jeżeli coś z depednencie arr się zmieni wtedy wywołuje funkcje.
    // // Jeżeli nie dodamy dependecies arr wtedy odpali się za kazdym razem jak strona zostaje odświerzona. UWAGA!!! każda zmiana warości to odświerzenie!!!
    // // Jeżeli dodamy [] pustą arr jako dependecies wtedy odpali się tylko raz przy starcie
    // useEffect(() => {
    //     console.log("HI")
    //     console.log(isWeb3Enabled)
    // }, [isWeb3Enabled])
    // // isWeb3Enabled zwraca true jeżeli enableWeb3 zostaje wywołane

    useEffect(() => {
        if (isWeb3Enabled) return
        // <2/2> kontynuacja kodu zapamiętującego podłaczeine portfela
        if (window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])
    // no array, run on every render
    // empty array, run once
    // dependency array, run when the stuff in it changesan
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3() // ustawia isWeb3Enabled na folse
                console.log("null account found")
            }
        })
    }, [])
    return (
        // zwraca JSX co umożliwia nam wpisywanie w HTML {JS}
        <div>
            {account ? (
                <div>
                    Connected to: {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (window !== "undefined") {
                            // czasami Next ma problem e znalezienem obiektu window dlatego dodajemy if statement
                            window.localStorage.setItem("connected", "injected") // <1/2> zapisujemy w lokalnej pamięci żeby strona po jej odświerzeniu zapamiętała że portfel był połączony
                        }
                    }}
                    disabled={isWeb3EnableLoading} // będzie disabled jak ładuje metamaska
                >
                    Connect
                </button>
            )}
        </div>
    )
}
/*

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null Account found")
            }
        })
    }, [])

    return (
        <nav className="p-5 border-b-2">
            <ul className="">
                <li className="flex flex-row">
                    {account ? (
                        <div className="ml-auto py-2 px-4">
                            Connected to {account.slice(0, 6)}...
                            {account.slice(account.length - 4)}
                        </div>
                    ) : (
                        <button
                            onClick={async () => {
                                // await walletModal.connect()
                                await enableWeb3()
                                // depends on what button they picked
                                if (typeof window !== "undefined") {
                                    window.localStorage.setItem("connected", "injected")
                                    // window.localStorage.setItem("connected", "walletconnect")
                                }
                            }}
                            disabled={isWeb3EnableLoading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        >
                            Connect
                        </button>
                    )}
                </li>
            </ul>
        </nav>
    )
}
*/
