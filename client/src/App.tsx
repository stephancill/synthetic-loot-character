import './App.css';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { ConnectButton } from './components/ConnectButton/ConnectButton';
import { useAccount, useNetwork } from 'wagmi';
import { TokenCard } from './components/TokenCard/TokenCard';
import { useEffect } from 'react';
import { Search } from './components/Search/Search';
import deployments from "./deployments.json"
import { Copy } from "./components/Copy/Copy"
import opensea from "./img/opensea.svg"
import github from "./img/github.svg"
import etherscan from "./img/etherscan.svg"

const deploymentChain = parseInt(deployments.chainId)

function App() {
  const [{data: account}] = useAccount()
  const navigate = useNavigate()
  const location = useLocation()
  const [{data: network}, switchNetwork] = useNetwork()

  useEffect(() => {
    if (account && location.pathname === "/") {
      navigate(`/address/${account.address}`)
    }
  }, [account, location.pathname, navigate])

  return (
    <div className="App">
      <div style={{fontSize: "60px", fontFamily: "'EB Garamond', serif", margin: "20px", marginTop: "60px", textAlign: "center"}}>Synthetic Loot Character</div>
      <div className="linksContainer" style={{display: "flex"}}>
        {/* TODO: Update */}
        <a href={`https://opensea.io/assets/${deployments.contracts.SyntheticLootCharacter.address}/`} target="_blank" rel="noopener noreferrer"><img src={opensea} alt="OpenSea"/></a>
        <a href="https://github.com/stephancill/synthetic-loot-character" target="_blank" rel="noopener noreferrer"><img src={github} alt="GitHub"/></a>
        <a href={`https://etherscan.io/address/${deployments.contracts.SyntheticLootCharacter.address}`} target="_blank" rel="noopener noreferrer"><img src={etherscan} alt="Etherscan"/></a>
      </div>

      <div style={{marginTop: "40px", marginBottom: "40px", width: "90%", maxWidth: "400px", display: "flex", justifyContent: "center"}}>
        <ConnectButton/>
      </div>
      
      {network && switchNetwork && network.chain?.id !== deploymentChain 
      ?
        <div style={{marginBottom:"30px",width: "90%",textAlign:"center"}}>
          <button className="switchNetworkBtn" onClick={() => switchNetwork(deploymentChain)}>Switch to {deployments.name}</button>
        </div>
      :
        <Routes>
          <Route path="/" element={
            <div style={{display: "flex", width: "90%", maxWidth: "400px", marginBottom: "40px"}}>
              <Search onSearch={(address) => navigate(`/address/${address}`)}/>
            </div>
          }/>
          <Route path="address">
            <Route path=":address" element={<TokenCard/>}/>
          </Route>
          <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
        </Routes>
      }
      <Copy/>
      <footer style={{marginBottom: "20px"}}>
        Created by <a href="https://twitter.com/stephancill" target="_blank" rel="noopener noreferrer">@stephancill</a> and <a href="https://twitter.com/npm_luko" target="_blank" rel="noopener noreferrer">@npm_luko</a>
      </footer>
    </div>
  );
}

export default App;
