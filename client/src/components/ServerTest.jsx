import { useState, useEffect } from 'react'

export function ServerTest() {
  const [serverMessage, setServerMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const testServerConnection = async () => {
      try {
        const response = await fetch('/api/test')
        const data = await response.json()
        setServerMessage(data.message)
        setLoading(false)
      } catch (err) {
        setError('Failed to connect to server')
        setLoading(false)
      }
    }

    testServerConnection()
  }, [])

  if (loading)
    return (
      <div className="flex items-center justify-center p-4 border rounded-lg bg-slate-50">
        <p className="text-slate-600">Testing server connection...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center p-4 border rounded-lg bg-red-50">
        <p className="text-red-600">{error}</p>
      </div>
    )

  return (
    <div className="flex items-center justify-center p-4 border rounded-lg bg-green-50">
      <p className="text-green-600">Server Response: {serverMessage}</p>
    </div>
  )
}
