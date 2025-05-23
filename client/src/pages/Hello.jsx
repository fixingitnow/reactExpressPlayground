import TimerModal from '../components/modal/TimerModal.jsx'
import React from 'react'

export default function Hello() {
  const [showModal, setShowModal] = React.useState(false)

  return (
    <div>
      {showModal && (
        <TimerModal maxTime={3000} onClose={() => setShowModal(false)} />
      )}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setShowModal(true)}
      >
        Open Modal
      </button>
    </div>
  )
}
