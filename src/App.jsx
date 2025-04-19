import { useState } from 'react'
import './App.css'
import { Scanner } from '@yudiel/react-qr-scanner'

const App = () => {
  const [scan, setScan] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleScan = (data) => {
    console.log('Raw scan data:', data)

    // Only process the scan if we have meaningful data
    if (data) {
      // Handle different possible data formats
      let scanResult

      if (typeof data === 'object') {
        // Log all properties to help debug
        // console.log('Data properties:', Object.keys(data))

        // Try different possible property names
        scanResult =
          data.text ||
          data.data ||
          data.result ||
          data.value ||
          JSON.stringify(data)
      } else {
        scanResult = data
      }

      if (scanResult && scanResult !== 'undefined') {
        setResult(scanResult)
        setScan(false)
        console.log('Processed scan result:', scanResult)
      } else {
        console.warn(
          "Scan returned data but couldn't extract meaningful result"
        )
      }
    }
  }

  const handleError = (err) => {
    console.error('Scan error:', err)
    setError(`Error: ${err.message || 'Unknown error'}`)
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setScan(false)
  }

  return (
    <div className='container'>
      <h2>QR Code Scanner</h2>

      {!result && !error && (
        <button onClick={() => setScan(!scan)} className='scan-button'>
          {scan ? 'Cancel Scan' : 'Start Scan'}
        </button>
      )}

      {scan && (
        <div className='scanner-container'>
          <Scanner
            onScan={handleScan}
            onError={handleError}
            onDecode={(data) => {
              // console.log('Decode data:', data)
              handleScan(data)
            }}
            constraints={{
              facingMode: 'environment',
            }}
          />
        </div>
      )}

      {error && (
        <div className='error-container'>
          <p className='error-message'>{error}</p>
          <button onClick={handleReset}>Try Again</button>
        </div>
      )}

      {result && (
        <div className='result-container'>
          <h3>Scan Result:</h3>
          <div className='result-box'>
            {
              result.map(items =>{
                  <p>{items.rowValue}</p>
              })
            }
            
          </div>
          <button onClick={handleReset} className='reset-button'>
            Scan Again
          </button>
        </div>
      )}
    </div>
  )
}

export default App
