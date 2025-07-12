'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent, useWaitForTransactionReceipt } from 'wagmi'
import toast from 'react-hot-toast'
import { Pixel } from './Pixel'
import { MONAD_LISA_CONTRACT, hexToColorInt, colorIntToHex } from '@/lib/contract'

const CANVAS_SIZE = 64

interface PixelData {
  color: string
  owner?: string
}

interface CanvasProps {
  selectedColor: string
  onPixelUpdate?: (x: number, y: number, color: string) => void
}

export function Canvas({ selectedColor, onPixelUpdate }: CanvasProps) {
  const { isConnected } = useAccount()
  const [pixels, setPixels] = useState<PixelData[][]>(
    Array(CANVAS_SIZE).fill(null).map(() => 
      Array(CANVAS_SIZE).fill(null).map(() => ({ color: '#ffffff' }))
    )
  )
  const [pendingPixels, setPendingPixels] = useState<Set<string>>(new Set())

  // Read initial canvas state
  const { data: canvasData } = useReadContract({
    ...MONAD_LISA_CONTRACT,
    functionName: 'getCanvasState',
  })

  // Write contract hook for updating pixels
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  })

  // Watch for pixel update events
  useWatchContractEvent({
    ...MONAD_LISA_CONTRACT,
    eventName: 'PixelUpdated',
    onLogs(logs) {
      logs.forEach((log) => {
        const { x, y, color } = log.args
        if (x !== undefined && y !== undefined && color !== undefined) {
          const pixelKey = `${x}-${y}`
          setPixels(prev => {
            const newPixels = [...prev]
            newPixels[y] = [...newPixels[y]]
            newPixels[y][x] = { color: colorIntToHex(color) }
            return newPixels
          })
          // Remove from pending when confirmed on chain
          setPendingPixels(prev => {
            const newSet = new Set(prev)
            newSet.delete(pixelKey)
            return newSet
          })
        }
      })
    },
  })

  // Handle transaction state changes
  useEffect(() => {
    if (error) {
      // Transaction was rejected/cancelled
      setPendingPixels(new Set()) // Clear all pending pixels
      toast.error('Transaction cancelled')
    }
  }, [error])

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Transaction confirmed!')
    }
  }, [isConfirmed])

  useEffect(() => {
    if (receiptError) {
      setPendingPixels(new Set()) // Clear all pending pixels
      toast.error('Transaction failed')
    }
  }, [receiptError])

  // Initialize canvas from contract data
  useEffect(() => {
    if (canvasData && Array.isArray(canvasData)) {
      const newPixels = Array(CANVAS_SIZE).fill(null).map(() => 
        Array(CANVAS_SIZE).fill(null).map(() => ({ color: '#ffffff' }))
      )
      
      canvasData.forEach((colorInt, index) => {
        const x = index % CANVAS_SIZE
        const y = Math.floor(index / CANVAS_SIZE)
        if (y < CANVAS_SIZE && x < CANVAS_SIZE) {
          newPixels[y][x] = { color: colorIntToHex(Number(colorInt)) }
        }
      })
      
      setPixels(newPixels)
    }
  }, [canvasData])

  const getPixelKey = (x: number, y: number) => `${x}-${y}`

  const handlePixelClick = useCallback((x: number, y: number) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    const pixelKey = getPixelKey(x, y)
    if (isPending || isConfirming) {
      return
    }

    // Check if this specific pixel is already pending
    if (pendingPixels.has(pixelKey)) {
      return
    }

    setPendingPixels(prev => new Set(prev).add(pixelKey))
    
    const colorInt = hexToColorInt(selectedColor)
    
    writeContract({
      ...MONAD_LISA_CONTRACT,
      functionName: 'setPixelColor',
      args: [x, y, colorInt],
    })

    onPixelUpdate?.(x, y, selectedColor)
    toast.success(`Transaction submitted for pixel (${x}, ${y})`)
  }, [isConnected, selectedColor, isPending, isConfirming, writeContract, onPixelUpdate])

  return (
    <div className="flex justify-center items-center w-full h-full p-2">
      <div 
        className="grid monad-glass border border-white/20 shadow-2xl canvas-glow rounded-xl overflow-hidden"
        style={{ 
          gridTemplateColumns: `repeat(${CANVAS_SIZE}, minmax(0, 1fr))`,
          width: 'min(calc(100vw - max(620px, 40px)), calc(100vh - 200px))',
          height: 'min(calc(100vw - max(620px, 40px)), calc(100vh - 200px))',
          minWidth: '320px',
          minHeight: '320px',
          aspectRatio: '1'
        }}
      >
        {pixels.map((row, y) =>
          row.map((pixel, x) => {
            const pixelKey = getPixelKey(x, y)
            return (
              <Pixel
                key={pixelKey}
                x={x}
                y={y}
                color={pixel.color}
                isPending={pendingPixels.has(pixelKey)}
                onClick={handlePixelClick}
              />
            )
          })
        )}
      </div>
    </div>
  )
}