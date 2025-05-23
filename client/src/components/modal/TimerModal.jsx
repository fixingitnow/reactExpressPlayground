import React, { useEffect } from 'react'

export default function TimerModal({ maxTime, onClose }) {
  const [timer, setTimer] = React.useState(maxTime)

  useEffect(() => {
    if (timer === 0) {
      onClose()
    }
  }, [timer, onClose])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1000)
    }, 1000)

    return () => clearInterval(interval)
  }, [onClose])

  return (
    <div className="modal absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <section className="relative modal-content bg-white w-1/2 h-1/2 p-4 rounded">
        <div className="flex justify-center items-center h-full">
          <p>{timer}</p>
        </div>
        <button className="absolute top-4 right-6" onClick={onClose}>
          X
        </button>
      </section>
    </div>
  )
}
