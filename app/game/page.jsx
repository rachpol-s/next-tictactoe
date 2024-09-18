'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const GamePage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  const playerSymbol = 'O'
  const botSymbol = 'X'
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  const [board, setBoard] = useState(Array(9).fill(null))
  const [winner, setWinner] = useState(null)
  const [isBotTurn, setIsBotTurn] = useState(false)
  const [playerScore, setPlayerScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [difficult, setDifficult] = useState('easy')

  const playerMove = (index) => {
    if (board[index] || winner || isBotTurn) return

    let newBoard = [...board]
    newBoard[index] = playerSymbol
    setBoard(newBoard)

    const hasWinner = checkWinner(newBoard)
    if (!hasWinner) {
      setIsBotTurn(true)
    }
  }

  const botMove = () => {
    const checkWinnerTemp = (tempBoard) => {
      for (let combo of winningCombos) {
        const [a, b, c] = combo
        if (
          tempBoard[a] &&
          tempBoard[a] === tempBoard[b] &&
          tempBoard[a] === tempBoard[c]
        ) {
          return tempBoard[a]
        }
      }
      return false
    }

    const checkWinnable = (board, symbol) => {
      for (let i = 0; i < emptyCells.length; i++) {
        const tempBoard = [...board]
        tempBoard[emptyCells[i]] = symbol
        if (checkWinnerTemp(tempBoard) === symbol) {
          return emptyCells[i]
        }
      }
    }

    const cellCanWin = (tempBoard) => {
      for (let combo of winningCombos) {
        const [a, b, c] = combo
        if (
          tempBoard[a] !== playerSymbol &&
          tempBoard[b] !== playerSymbol &&
          tempBoard[c] !== playerSymbol
        ) {
          return [a, b, c]
        }
      }
      return []
    }

    let botIndex
    const center = 4
    const corner = [0, 2, 6, 8]

    const emptyCellsCanWinPriorityCorner = cellCanWin(board)
      .filter((index) => board[index] === null)
      .filter((value) => corner.includes(value))

    const emptyCells = board
      .map((cell, index) => (cell === null ? index : null))
      .filter((idx) => idx !== null)

    //botSymbol logic
    if (checkWinnable(board, botSymbol) !== undefined && difficult === 'hard') {
      botIndex = checkWinnable(board, botSymbol)
    } else if (
      checkWinnable(board, playerSymbol) !== undefined &&
      (difficult === 'medium' || difficult === 'hard')
    ) {
      botIndex = checkWinnable(board, playerSymbol)
    } else if (emptyCells.includes(center) && difficult === 'hard') {
      botIndex = center
    } else if (emptyCellsCanWinPriorityCorner.length && difficult === 'hard') {
      botIndex =
        emptyCellsCanWinPriorityCorner[
          Math.floor(Math.random() * emptyCellsCanWinPriorityCorner.length)
        ]
    } else {
      botIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    }

    let newBoard = [...board]
    newBoard[botIndex] = botSymbol
    setBoard(newBoard)

    const hasWinner = checkWinner(newBoard)
    if (!hasWinner) {
      setIsBotTurn(false)
    }
  }

  const checkWinner = (board) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        const winner = board[a]
        setWinner(winner)

        if (winner === playerSymbol) {
          setPlayerScore((prev) => prev + 1)
          setStreak((prev) => prev + 1)
          if (streak + 1 === 3) {
            setPlayerScore((prev) => prev + 1)
            setStreak(0)
          }
        } else if (winner === botSymbol) {
          setPlayerScore((prev) => Math.max(prev - 1, 0))
          setStreak(0)
        }
        return true
      }
    }

    if (board.every((cell) => cell !== null)) {
      setWinner('Tie')
      return true
    }
    return false
  }

  const resetBoard = () => {
    setBoard(Array(9).fill(null))
    setIsBotTurn(false)
    setWinner(null)
  }

  const changeDifficult = (e) => {
    setDifficult(e.target.value)
    resetBoard()
  }

  useEffect(() => {
    if (isBotTurn) {
      setTimeout(() => {
        botMove()
      }, 1000)
    }
  }, [isBotTurn])

  return (
    <div
      className="flex items-center justify-center bg-gray-200"
      style={{ minHeight: 'calc(100vh - 68px)' }}
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <p className="mr-2 text-xl font-semibold">Difficulty:</p>
            <select
              value={difficult}
              onChange={changeDifficult}
              className="p-1 border rounded-lg w-24"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <p className="text-xl font-semibold">Player Score: {playerScore}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 my-8  bg-black">
          {board.map((cell, index) => (
            <div
              key={index}
              onClick={() => playerMove(index)}
              className="w-28 h-28 bg-gray-200 flex items-center justify-center text-2xl cursor-pointer"
            >
              {cell === playerSymbol ? (
                <svg
                  className="o-svg scale-icon"
                  viewBox="0 0 100 100"
                  width="100"
                  height="100"
                >
                  <circle
                    className="o-circle"
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="black"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              ) : cell === botSymbol ? (
                <svg
                  className="x-svg scale-icon"
                  viewBox="0 0 100 100"
                  width="100"
                  height="100"
                >
                  <line
                    className="x-line line1"
                    x1="10"
                    y1="10"
                    x2="90"
                    y2="90"
                    stroke="black"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <line
                    className="x-line line2"
                    x1="10"
                    y1="90"
                    x2="90"
                    y2="10"
                    stroke="black"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                ''
              )}
            </div>
          ))}
        </div>

        {!winner ? (
          <p className="text-2xl font-semibold mb-4">
            It&apos;s {isBotTurn ? 'Bot' : 'Your'} Turn
          </p>
        ) : (
          <p
            className={`text-2xl font-semibold mb-4 ${
              winner === 'Tie'
                ? ''
                : winner === playerSymbol
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {winner === 'Tie'
              ? "It's a Tie"
              : `${winner === playerSymbol ? 'You Wins' : 'You Lose'}`}
          </p>
        )}

        <button
          onClick={resetBoard}
          className="px-4 py-2 text-sm text-center text-white  rounded-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700"
        >
          <p className="text-sm font-semibold">Restart</p>
        </button>
      </div>
    </div>
  )
}

export default GamePage
