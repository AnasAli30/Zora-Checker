import { useState, useEffect } from 'react'
import { checkAirdropEligibility } from './utils/contract'
import { ethers } from 'ethers'
import './App.css'

function App() {
  const [address, setAddress] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        
        // Request to switch to Base network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }], // Base mainnet chain ID
          })
        } catch (switchError) {
          // If the network is not added to MetaMask, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x2105',
                chainName: 'Base',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org']
              }]
            })
          } else {
            throw switchError
          }
        }

        const accounts = await provider.send("eth_requestAccounts", [])
        setWalletAddress(accounts[0])
        setWalletConnected(true)
        setAddress(accounts[0])
      } else {
        setError('Please install MetaMask to connect your wallet')
      }
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message)
    }
  }

  const claimAirdrop = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask to claim')
        return
      }

      setLoading(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      const contract = new ethers.Contract(
        "0x0000000002ba96C69b95E32CAAB8fc38bAB8B3F8",
        [{"inputs":[{"internalType":"address","name":"_claimTo","type":"address"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"}],
        signer
      )

      const tx = await contract.claim(walletAddress)
      await tx.wait()
      
      // Refresh eligibility after claiming
      checkEligibility()
    } catch (err) {
      setError('Failed to claim airdrop: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkEligibility = async () => {
    if (!address) {
      setError('Please enter a wallet address')
      return
    }

    setLoading(true)
    setError('')
    try {
      const eligibility = await checkAirdropEligibility(address)
      setResult(eligibility)
    } catch (err) {
      setError('Failed to check eligibility: ' + err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle('dark-mode')
  }

  const themeStyles = {
    light: {
      background: '#f8fafc',
      text: '#333',
      cardBg: 'white',
      inputBg: '#f8fafc',
      border: '#ddd',
      secondaryText: '#666',
      errorBg: '#fee2e2',
      successBg: '#f0fdf4',
      link: '#4f46e5',
      button: '#4f46e5',
      buttonHover: '#4338ca',
      shadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    dark: {
      background: '#000000',
      text: '#ffffff',
      cardBg: '#111111',
      inputBg: '#000000',
      border: '#333333',
      secondaryText: '#a0a0a0',
      errorBg: '#1a0000',
      successBg: '#001a00',
      link: '#818cf8',
      button: '#818cf8',
      buttonHover: '#6366f1',
      shadow: '0 2px 4px rgba(0,0,0,0.5)'
    }
  }

  const currentTheme = isDarkMode ? themeStyles.dark : themeStyles.light

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>
      
      <div className="content">
        <h1>Zora Airdrop Checker</h1>
        
        {!walletConnected ? (
          <button 
            className="connect-button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <div className="wallet-info">
            <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          </div>
        )}

        <div className="input-container">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address"
            disabled={walletConnected}
          />
          <button 
            onClick={checkEligibility}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Check Eligibility'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result-container">
            <h2>Results</h2>
            <div className="result-details">
              <p>Eligible: {result.eligible ? '✅ Yes' : '❌ No'}</p>
              {result.eligible && (
                <>
                  <p>Amount: {result.amount} {result.token}</p>
                  <p>Claimed: {result.claimed ? '✅ Yes' : '❌ No'}</p>
                  <p>Claim Open: {result.claimOpen ? '✅ Yes' : '❌ No'}</p>
                  
                  {result.eligible && !result.claimed && result.claimOpen && (
                    <button 
                      className="claim-button"
                      onClick={claimAirdrop}
                      disabled={loading}
                    >
                      {loading ? 'Claiming...' : 'Claim Airdrop'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{
        textAlign: 'center',
        color: currentTheme.secondaryText,
        fontSize: '0.875rem',
        marginTop: '2rem',
        padding: '1rem',
        width: '100%'
      }}>
        Made by{' '}
        <a 
          href="https://t.me/CYpTo_HaCkEr" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: currentTheme.link,
            textDecoration: 'none'
          }}
        >
          Shadow
        </a>
      </div>

      <style>
        {`
          input:focus {
            outline: none;
            border-color: ${currentTheme.button};
          }
          button:hover:not(:disabled) {
            background-color: ${currentTheme.buttonHover};
          }
          button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          a:hover {
            text-decoration: underline;
          }
        `}
      </style>
    </div>
  )
}

export default App
