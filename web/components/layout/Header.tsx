'use client'

import { ConnectButton } from '../ui/ConnectButton'
import { Palette } from 'lucide-react'

export function Header() {
  return (
    <header className="monad-glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-monad-gradient rounded-lg flex items-center justify-center monad-glow">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Monad Lisa</h1>
              <div className="text-sm text-gray-300">
                Collaborative pixel art on Monad
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-300">
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Testnet Live</span>
            </span>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}