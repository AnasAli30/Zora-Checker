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
      backgroundColor: '#f7fafc',
      padding: '2rem'
    }}>
      <div style={{ 
        maxWidth: '768px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '2rem',
          color: '#6b46c1',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Zora Airdrop Checker
        </h1>
        
        <div style={{ 
          width: '100%',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Enter your Ethereum address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                padding: '0.75rem',
                fontSize: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #e2e8f0'
              }}
            />
            <button
              onClick={handleCheckAirdrop}
              disabled={loading}
              style={{
                padding: '0.75rem',
                backgroundColor: '#6b46c1',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Checking...' : 'Check Eligibility'}
            </button>
            {error && (
              <p style={{ color: '#e53e3e' }}>{error}</p>
            )}
          </div>
        </div>

        {result && (
          <div style={{ 
            width: '100%',
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {result.eligible ? '🎉 Congratulations!' : 'Not Eligible'}
              </h2>
              {result.eligible && (
                <>
                  <p>You are eligible for the Zora airdrop!</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6b46c1' }}>
                    {result.amount} {result.token}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      backgroundColor: result.claimed ? '#e53e3e' : '#48bb78',
                      color: 'white',
                      display: 'inline-block'
                    }}>
                      {result.claimed ? "Already Claimed" : "Not Claimed Yet"}
                    </span>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      backgroundColor: result.claimOpen ? '#48bb78' : '#e53e3e',
                      color: 'white',
                      display: 'inline-block'
                    }}>
                      {result.claimOpen ? "Claim Period Open" : "Claim Period Closed"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
