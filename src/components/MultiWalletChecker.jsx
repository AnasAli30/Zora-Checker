import { useState } from 'react';
import { ethers } from 'ethers';

const MultiWalletChecker = () => {
  const [addresses, setAddresses] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkMultipleWallets = async () => {
    if (!addresses.trim()) {
      setError('Please enter wallet addresses');
      return;
    }

    const addressList = addresses.split('\n').map(addr => addr.trim()).filter(addr => addr);
    if (addressList.length === 0) {
      setError('Please enter valid wallet addresses');
      return;
    }

    setLoading(true);
    setError('');
    const newResults = [];

    try {
      const provider = new ethers.JsonRpcProvider('https://base-rpc.publicnode.com');
      const contract = new ethers.Contract(
        "0x0000000002ba96C69b95E32CAAB8fc38bAB8B3F8",
        [
          {"inputs":[{"internalType":"address","name":"_claimTo","type":"address"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},
          {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"accountClaim","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
        ],
        provider
      );

      for (const address of addressList) {
        try {
          // Get allocation amount first
          const allocation = await contract.accountClaim(address);
          const formattedAllocation = ethers.formatEther(allocation);
          const isEligible = allocation > 0;
          
          newResults.push({
            address,
            eligible: isEligible,
            allocation: formattedAllocation,
            status: isEligible ? `✅ Eligible` : '❌ Not Eligible'
          });
        } catch (err) {
          newResults.push({
            address,
            eligible: false,
            allocation: '0',
            status: '❌ Error checking eligibility'
          });
        }
      }
      setResults(newResults);
    } catch (err) {
      setError('Failed to check wallets: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="multi-checker">
      <h2>Multi Wallet Checker</h2>
      <div className="input-container">
        <textarea
          value={addresses}
          onChange={(e) => setAddresses(e.target.value)}
          placeholder="Enter wallet addresses (one per line)"
          rows="5"
        />
        <button 
          onClick={checkMultipleWallets}
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Wallets'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {results.length > 0 && (
        <div className="results-container">
          <h3>Results</h3>
          <div className="results-grid">
            {results.map((result, index) => (
              <div key={index} className="result-card">
                <p className="address">{result.address}</p>
                <p className="status">{result.status}</p>
                {result.eligible && (
                  <p className="allocation">Allocation: {result.allocation} Zora</p>
                )}
              </div>
            ))}
          </div>
          
          <div className="summary">
            <h3>Summary</h3>
            <p>Total Accounts Checked: {results.length}</p>
            <p>Eligible Accounts: {results.filter(r => r.eligible).length}</p>
            <p>Total Allocation: {
              results
                .filter(r => r.eligible)
                .reduce((sum, r) => sum + parseFloat(r.allocation), 0)
                .toFixed(4)
            } Zora</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiWalletChecker; 