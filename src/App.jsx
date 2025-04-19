import { useState } from 'react'
import './App.css'
import { Scanner } from '@yudiel/react-qr-scanner'

const App = () => {
  const [scan, setScan] = useState(false)
  const [result, setResult] = useState([]) // Always an array
  const [error, setError] = useState(null)

  const handleScan = (data) => {
    if (data) {
      let scanResult

      if (typeof data === 'object') {
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
        try {
          const parsedData = JSON.parse(scanResult)
          const rawValues = parsedData.map((item) => item.rawValue)
          setResult((prev) => [...prev, ...rawValues]) // append all values at once
          console.log(parsedData)
        } catch (e) {
          console.error('Failed to parse JSON:', e)
          setError('Invalid QR code format')
        }
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
    setResult([]) // ✅ should be empty array, not null
    setError(null)
    setScan(false)
  }

  return (
    <div className='container'>
      <h2>QR Code Scanner</h2>

      {!result.length && !error && (
        <button onClick={() => setScan(!scan)} className='scan-button'>
          {scan ? 'Cancel Scan' : 'Start Scan'}
        </button>
      )}

      {scan && (
        <div className='scanner-container'>
          <Scanner
            allowMultiple={true}
            onScan={handleScan}
            onError={handleError}
            onDecode={handleScan}
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

      {result.length > 0 && (
        <div className='result-container'>
          <h3>Scan Result:</h3>
          <div className='result-box'>
            {result.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
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
