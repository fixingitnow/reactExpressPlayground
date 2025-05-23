import React from 'react'
import GenerateGrid from '../components/GenerateGrid'

export default function Minesweeper() {
  const [rows, setRows] = React.useState(0)
  const [cols, setCols] = React.useState(0)
  const [bombs, setBombs] = React.useState(0)

  const [generateGrid, setGenerateGrid] = React.useState(false)

  return (
    <div>
      Minesweeper
      <section className="flex flex-row gap-4">
        <label>Rows</label>
        <input
          onChange={(e) => setRows(e.target.value)}
          className="border border-black w-16"
          type="number"
          id="rows"
        />

        <label>Columns</label>
        <input
          onChange={(e) => setCols(e.target.value)}
          className="border border-black w-16"
          type="number"
          id="rows"
        />

        <label>Enter number of Bombs</label>
        <input
          onChange={(e) => setBombs(e.target.value)}
          className="border border-black w-16"
          type="number"
          id="rows"
        />

        <button
          onClick={() => setGenerateGrid(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Play
        </button>
      </section>
      {generateGrid && (
        <GenerateGrid rows={rows} cols={cols} bombs={bombs}></GenerateGrid>
      )}
    </div>
  )
}
