'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Clock } from 'lucide-react'

interface Transaction {
  id: string
  hash: string
  user: string
  x: number
  y: number
  color: string
  timestamp: number
}

export function TxHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Mock transactions for demo
    const mockTxs: Transaction[] = [
      {
        id: '1',
        hash: '0x1234567890abcdef1234567890abcdef12345678',
        user: '0xabcd1234567890abcdef1234567890abcdef1234',
        x: 32,
        y: 32,
        color: '#FF0000',
        timestamp: Date.now() - 1000 * 60 * 5
      },
      {
        id: '2',
        hash: '0x2345678901bcdef12345678901bcdef123456789',
        user: '0xbcde2345678901bcdef2345678901bcdef2345678',
        x: 31,
        y: 32,
        color: '#00FF00',
        timestamp: Date.now() - 1000 * 60 * 10
      }
    ]
    setTransactions(mockTxs)
  }, [])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="monad-glass rounded-xl border border-white/10">
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Clock size={16} />
          <span>Recent Transactions</span>
        </h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            No transactions yet
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-400 font-mono">
                    {formatAddress(tx.user)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(tx.timestamp)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div
                    className="w-4 h-4 rounded border border-white/20"
                    style={{ backgroundColor: tx.color }}
                  />
                  <span className="text-sm text-gray-200">
                    Pixel ({tx.x}, {tx.y})
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 font-mono">
                    {formatAddress(tx.hash)}
                  </div>
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-monad-primary hover:text-monad-light transition-colors"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}