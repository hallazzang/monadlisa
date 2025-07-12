'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Canvas } from '@/components/canvas/Canvas'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { TxHistory } from '@/components/ui/TxHistory'
import { LiveUsers } from '@/components/ui/LiveUsers'
import { History, Users } from 'lucide-react'

export default function Home() {
  const [selectedColor, setSelectedColor] = useState('#FF0000')
  const [showHistory, setShowHistory] = useState(false)
  const [showUsers, setShowUsers] = useState(false)

  const handlePixelUpdate = (x: number, y: number, color: string) => {
    console.log(`Pixel updated: (${x}, ${y}) -> ${color}`)
  }

  return (
    <div className="min-h-screen monad-pattern relative">
      <Header />
      
      <main className="container mx-auto px-6 py-8 min-h-[calc(100vh-100px)]">
        <div className="grid lg:grid-cols-[350px_1fr_350px] gap-8 h-full">
          {/* Mobile Layout */}
          <div className="lg:hidden col-span-full">
            <div className="flex flex-col space-y-6 h-full">
              <div className="flex justify-between items-start space-x-4">
                <div className="flex-1">
                  <ColorPicker 
                    selectedColor={selectedColor}
                    onColorSelect={setSelectedColor}
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 monad-glass text-white rounded-lg transition-all duration-200 text-sm hover:bg-white/10"
                  >
                    <History size={14} />
                    <span>History</span>
                  </button>
                  <button
                    onClick={() => setShowUsers(!showUsers)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 monad-glass text-white rounded-lg transition-all duration-200 text-sm hover:bg-white/10"
                  >
                    <Users size={14} />
                    <span>Users</span>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex justify-center items-center">
                <Canvas 
                  selectedColor={selectedColor}
                  onPixelUpdate={handlePixelUpdate}
                />
              </div>
              
              {(showHistory || showUsers) && (
                <div className="max-h-48 overflow-y-auto">
                  {showHistory && <TxHistory />}
                  {showUsers && <LiveUsers />}
                </div>
              )}
            </div>
          </div>
          {/* Desktop Left Panel - Color Picker */}
          <div className="hidden lg:block space-y-6">
            <ColorPicker 
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
            
            {/* Control Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-center space-x-2 px-5 py-3 monad-glass text-white rounded-lg transition-all duration-200 hover:bg-white/10 font-medium"
              >
                <History size={16} />
                <span>Transaction History</span>
              </button>
              
              <button
                onClick={() => setShowUsers(!showUsers)}
                className="w-full flex items-center justify-center space-x-2 px-5 py-3 monad-glass text-white rounded-lg transition-all duration-200 hover:bg-white/10 font-medium"
              >
                <Users size={16} />
                <span>Live Users</span>
              </button>
            </div>
          </div>

          {/* Desktop Center Panel - Canvas */}
          <div className="hidden lg:flex justify-center items-center h-full">
            <Canvas 
              selectedColor={selectedColor}
              onPixelUpdate={handlePixelUpdate}
            />
          </div>

          {/* Desktop Right Panel - History/Users */}
          <div className="hidden lg:block space-y-6">
            {showHistory && <TxHistory />}
            {showUsers && <LiveUsers />}
            
            {/* Info Panel */}
            <div className="monad-glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-monad-primary rounded-full"></div>
                <span>How to Play</span>
              </h3>
              <ul className="text-sm text-gray-300 space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="text-monad-primary">1.</span>
                  <span>Connect your wallet to Monad testnet</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-monad-primary">2.</span>
                  <span>Select your favorite color</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-monad-primary">3.</span>
                  <span>Click any pixel to paint it</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-monad-primary">4.</span>
                  <span>Create collaborative masterpieces!</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="text-xs text-gray-400">
                  <span className="text-monad-primary">⚡</span> Ultra-fast transactions on Monad
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}