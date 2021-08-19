import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json"

export default function App() {

  const [currAddress, setCurrAddress] = React.useState("")
  const [totalWaves, setTotalWaves] = React.useState(0)
  const contractAddress = "0x528D425771A84C159c65556eD7c9a584758D4bf7"
  const contractABI = abi.abi

  const wave = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

    let count = await wavePortalContract.getTotalWaves()
    console.log("We have read data from the blockchain:", count.toNumber())

    const waveTxn = await wavePortalContract.wave()
    console.log("Mining...", waveTxn.hash)
    await waveTxn.wait()
    console.log("Mined...", waveTxn.hash)

    count = await wavePortalContract.getTotalWaves()
    setTotalWaves(count.toNumber())
    console.log("We have read data from the blockchain:", count.toNumber())
  }

  const checkIfWalletIsThere = () => {
    const { ethereum } = window

    if(!ethereum) {
      console.log("Doesn't have metamask")
    } else {
      console.log("We have an ethereum object", ethereum)
    }

    ethereum.request({ method: 'eth_accounts'})
    .then(async (accounts) => {
      console.log(accounts)
      if(accounts.length !== 0) {
        console.log("We have authorized a account")
        setCurrAddress(accounts[0])

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await wavePortalContract.getTotalWaves()
        setTotalWaves(count.toNumber())

      } else {
        console.log("User has not given us perms")
      }
    })
  }

  const connectWallet = async () => {
    const { ethereum } = window

    ethereum.request({ method: 'eth_requestAccounts'})
    .then(accounts => {
      console.log(accounts)
      setCurrAddress(accounts[0])
    })
  }

  React.useEffect(() => {
      checkIfWalletIsThere()
  })
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Emanuel and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!

        I Already has been waved {totalWaves}
        </div>

        <button className="waveButton" onClick={() => wave()}>
          Wave at Me
        </button>

        {currAddress ? null : (
          <button className="waveButton" onClick={() => connectWallet()}>
            Connect to Wallet
          </button>
        )}
      </div>
    </div>
  );
}
