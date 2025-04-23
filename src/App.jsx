import { useState, useEffect } from 'react'
import { checkAirdropEligibility } from './utils/contract'

function App() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(prefersDark)
  }, [])

  const handleCheckAirdrop = async () => {
    if (!address) {
      setError('Please enter a valid Ethereum address')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const eligibilityResult = await checkAirdropEligibility(address)
      setResult(eligibilityResult)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
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
    <div style={{ 
      minHeight: '100vh',
      minWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: currentTheme.background,
      padding: '2rem 0',
      color: currentTheme.text,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ 
        maxWidth: '500px',
        width: '100%',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            textAlign: 'center',
            color: currentTheme.text,
            margin: 0
          }}>
            Zora Airdrop Checker
          </h1>
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: currentTheme.text
            }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={{ 
          backgroundColor: currentTheme.cardBg,
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: currentTheme.shadow
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: currentTheme.secondaryText,
              textAlign: 'center'
            }}>
              Ethereum Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                width: '95%',
                padding: '0.75rem',
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '4px',
                fontSize: '1rem',
                textAlign: 'center',
                backgroundColor: currentTheme.inputBg,
                color: currentTheme.text
              }}
            />
          </div>

          <button
            onClick={handleCheckAirdrop}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: currentTheme.button,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Checking...' : 'Check Eligibility'}
          </button>

          {error && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: currentTheme.errorBg,
              color: '#dc2626',
              borderRadius: '4px',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
        </div>

        {result && (
          <div style={{ 
            marginTop: '1.5rem',
            backgroundColor: currentTheme.cardBg,
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: currentTheme.shadow
          }}>
            <h2 style={{ 
              textAlign: 'center',
              marginBottom: '1rem',
              color: result.eligible ? '#16a34a' : '#dc2626'
            }}>
              {result.eligible ? '🎉 Eligible!' : 'Not Eligible'}
            </h2>

            {result.eligible && (
              <>
                <div style={{ 
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{ 
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: currentTheme.button
                  }}>
                    {result.amount}
                  </div>
                  <div style={{ color: currentTheme.secondaryText }}>
                    {result.token}
                  </div>
                </div>

                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: result.claimed ? currentTheme.errorBg : currentTheme.successBg,
                    borderRadius: '4px',
                    color: result.claimed ? '#dc2626' : '#16a34a',
                    textAlign: 'center'
                  }}>
                    {result.claimed ? "Already Claimed" : "Not Claimed Yet"}
                  </div>

                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: result.claimOpen ? currentTheme.successBg : currentTheme.errorBg,
                    borderRadius: '4px',
                    color: result.claimOpen ? '#16a34a' : '#dc2626',
                    textAlign: 'center'
                  }}>
                    {result.claimOpen ? "Claim Period Open" : "Claim Period Closed"}
                  </div>
                </div>
              </>
            )}
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
