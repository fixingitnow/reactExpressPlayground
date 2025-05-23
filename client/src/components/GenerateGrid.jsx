import React from 'react'

export default function GenerateGrid({ rows, cols, bombs }) {
  console.log(rows, cols, bombs)

  // initialize grid with rows cols and 0

  //  [0, 1, 2, 3, 4 ,5 .... rowsx cols]

  const [gameState, setGameState] = React.useState(
    Array.from({ length: rows }, () => Array(Number(cols)).fill(0))
  )

  React.useEffect(() => {
    const numRows = Number(rows)
    const numCols = Number(cols)
    const newGrid = Array.from({ length: numRows }, () =>
      Array(numCols).fill(0)
    )

    let placed = 0
    while (placed < bombs) {
      let r = Math.floor(Math.random() * numRows)
      let c = Math.floor(Math.random() * numCols)

      if (newGrid[r][c] !== 'B') {
        newGrid[r][c] = 'B'

        // Update adjacent cells
        for (let i = r - 1; i <= r + 1; i++) {
          for (let j = c - 1; j <= c + 1; j++) {
            if (
              i >= 0 &&
              i < numRows &&
              j >= 0 &&
              j < numCols &&
              newGrid[i][j] !== 'B'
            ) {
              newGrid[i][j] += 1
            }
          }
        }

        placed++
      }
    }

    setGameState(newGrid)
  }, [rows, cols, bombs])

  //   display gamesteeaee
  console.log(gameState, 'iii')

  return (
    <section
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {gameState.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((tile, colIndex) => (
            <div
              key={colIndex}
              className="border border-black w-10 h-10 flex items-center justify-center"
            >
              {tile === 'B' ? 'B' : tile}
            </div>
          ))}
        </React.Fragment>
      ))}
    </section>
  )
}
