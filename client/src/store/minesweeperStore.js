import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useMinesweeperStore = create(
  persist(
    (set) => ({
      // Grid configuration
      rows: 0,
      cols: 0,
      bombs: 0,
      generateGrid: false,

      // Game state
      gameStarted: false,
      gameOver: false,
      gameWon: false,

      // Actions
      setGridConfig: (rows, cols, bombs) =>
        set({ rows: Number(rows), cols: Number(cols), bombs: Number(bombs) }),

      setGenerateGrid: (value) => set({ generateGrid: value }),

      startGame: () =>
        set({ gameStarted: true, gameOver: false, gameWon: false }),

      endGame: (won = false) => set({ gameOver: true, gameWon: won }),

      resetGame: () =>
        set({
          rows: 0,
          cols: 0,
          bombs: 0,
          generateGrid: false,
          gameStarted: false,
          gameOver: false,
          gameWon: false,
        }),
    }),
    {
      name: 'minesweeper-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({
        // only persist these fields
        rows: state.rows,
        cols: state.cols,
        bombs: state.bombs,
        generateGrid: state.generateGrid,
        gameStarted: state.gameStarted,
        gameOver: state.gameOver,
        gameWon: state.gameWon,
      }),
    }
  )
)
