import { ServerTest } from '../components/ServerTest'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">
          Welcome to the App
        </h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Server Connection Status
          </h2>
          <ServerTest />
        </div>
      </div>
    </div>
  )
}

export default App

// goal 1 , take inputs and genrate map

// 1. edit mode
// 3 inputs , rows, cols, bombs

// generate grid
// place bombs
// calculate numbers

// 1. option to play the game

// can't loose on first turn
// loose when you click on bomb

// underneath tile => has neighboring bombs present

// flag the bomb with right click
// 0 tile all 0 tiles are revealed.
