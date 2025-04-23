import { useState } from 'react'
import { checkAirdropEligibility } from './utils/contract'

function App() {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

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

  return (
    <div style={{ 
      minHeight: '100vh',
      minWidth: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{ 
        maxWidth: '500px',
        width: '100%',
        padding: '0 1rem'
      }}>
        <h1 style={{ 
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#333'
        }}>
          Zora Airdrop Checker
        </h1>

        <div style={{ 
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#666',
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
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                textAlign: 'center'
              }}
            />
          </div>

          <button
            onClick={handleCheckAirdrop}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#4f46e5',
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
              backgroundColor: '#fee2e2',
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
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
                    color: '#4f46e5'
                  }}>
                    {result.amount}
                  </div>
                  <div style={{ color: '#666' }}>
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
                    backgroundColor: result.claimed ? '#fee2e2' : '#f0fdf4',
                    borderRadius: '4px',
                    color: result.claimed ? '#dc2626' : '#16a34a',
                    textAlign: 'center'
                  }}>
                    {result.claimed ? "Already Claimed" : "Not Claimed Yet"}
                  </div>

                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: result.claimOpen ? '#f0fdf4' : '#fee2e2',
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

        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.875rem'
        }}>
          Made by{' '}
          <a 
            href="https://t.me/CYpTo_HaCkEr" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#4f46e5',
              textDecoration: 'none'
            }}
          >
            Anas
          </a>
        </div>

        <style>
          {`
            input:focus {
              outline: none;
              border-color: #4f46e5;
            }
            button:hover:not(:disabled) {
              background-color: #4338ca;
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
    </div>
  )
}

export default App
