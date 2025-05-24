import React from 'react'
import GenerateGrid from '../components/GenerateGrid'
import { useMinesweeperStore } from '../store/minesweeperStore'

export default function Minesweeper() {
  const {
    rows,
    cols,
    bombs,
    generateGrid,
    gameOver,
    gameWon,
    setGridConfig,
    setGenerateGrid,
    resetGame,
  } = useMinesweeperStore()

  const handleInputChange = (e, type) => {
    const value = e.target.value
    switch (type) {
      case 'rows':
        setGridConfig(value, cols, bombs)
        break
      case 'cols':
        setGridConfig(rows, value, bombs)
        break
      case 'bombs':
        setGridConfig(rows, cols, value)
        break
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Minesweeper</h1>

      <section className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="w-24">Rows:</label>
          <input
            value={rows}
            onChange={(e) => handleInputChange(e, 'rows')}
            className="border border-gray-300 rounded px-2 py-1 w-20"
            type="number"
            min="1"
            max="50"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-24">Columns:</label>
          <input
            value={cols}
            onChange={(e) => handleInputChange(e, 'cols')}
            className="border border-gray-300 rounded px-2 py-1 w-20"
            type="number"
            min="1"
            max="50"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-24">Bombs:</label>
          <input
            value={bombs}
            onChange={(e) => handleInputChange(e, 'bombs')}
            className="border border-gray-300 rounded px-2 py-1 w-20"
            type="number"
            min="1"
            max={rows * cols - 1}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setGenerateGrid(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={!rows || !cols || !bombs || bombs >= rows * cols}
          >
            Play
          </button>

          <button
            onClick={resetGame}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </section>

      {gameOver && (
        <div
          className={`p-4 mb-4 rounded ${gameWon ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {gameWon ? 'Congratulations! You won!' : 'Game Over! Try again!'}
        </div>
      )}

      {generateGrid && <GenerateGrid rows={rows} cols={cols} bombs={bombs} />}
    </div>
  )
}
