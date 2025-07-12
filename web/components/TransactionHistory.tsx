'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { CANVAS_CONTRACT } from '@/lib/contract'

interface BlockVisionTransaction {
  hash: string
  timestamp: number
  txStatus: number
  from: string
  to: string
  txName: string
  txContract: {
    contractAddress: string
    contractName: string
    project: string
  }
}

interface CanvasTransaction {
  hash: string
  from: string
  to: string
  timestamp: number
  txStatus: number
  contractAddress: string
  contractName: string
  project: string
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<CanvasTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecentTransactions() {
      try {
        setIsLoading(true)
        setError(null)

        const apiKey = process.env.NEXT_PUBLIC_BLOCKVISION_API_KEY
        if (!apiKey) {
          throw new Error('BlockVision API key not found')
        }

        // Fetch activities for our canvas contract address
        const url = `https://api.blockvision.org/v2/monad/account/activities?address=${CANVAS_CONTRACT.address}&limit=50&ascendingOrder=false`
        
        console.log('Fetching transaction history from BlockVision API...')
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-api-key': apiKey
          }
        })

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.code !== 0) {
          throw new Error(data.message || 'API returned error')
        }

        console.log(`Found ${data.result.data.length} transactions`)

        // Transform BlockVision data to our format
        const canvasTransactions: CanvasTransaction[] = data.result.data
          .filter((tx: BlockVisionTransaction) => tx.txStatus === 1) // Only successful transactions
          .map((tx: BlockVisionTransaction) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            timestamp: tx.timestamp,
            txStatus: tx.txStatus,
            contractAddress: tx.txContract.contractAddress || CANVAS_CONTRACT.address,
            contractName: tx.txContract.contractName || 'Canvas',
            project: tx.txContract.project || 'Monad Lisa'
          }))
          .slice(0, 20) // Show last 20 transactions

        setTransactions(canvasTransactions)
        console.log(`Loaded ${canvasTransactions.length} canvas transactions`)
      } catch (err) {
        console.error('Error fetching transactions:', err)
        setError('Failed to load transaction history')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentTransactions()
  }, [])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isLoading) {
    return (
      <div className="monad-glass border border-white/20 shadow-2xl rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-monad-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-300">Loading transactions...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="monad-glass border border-white/20 shadow-2xl rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        <div className="text-red-400 text-center py-8">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="monad-glass border border-white/20 shadow-2xl rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Recent Transactions ({transactions.length})
      </h3>
      
      {transactions.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No transactions found
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((tx, index) => (
            <div 
              key={`${tx.hash}-${index}`}
              className="group p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-monad-primary/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-monad-primary/20 border border-monad-primary/30 flex-shrink-0 shadow-sm flex items-center justify-center">
                    <span className="text-monad-primary text-xs font-bold">🎨</span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">
                      {tx.contractName === 'Canvas' ? 'Canvas Interaction' : tx.contractName}
                    </div>
                    <div className="text-gray-400 text-xs flex items-center space-x-2">
                      <span>{formatAddress(tx.from)}</span>
                      <span>•</span>
                      <span>{tx.project || 'Monad Lisa'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-gray-300 text-xs mb-1">
                    {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                  </div>
                  <a
                    href={`https://testnet.monadexplorer.com/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-monad-primary text-xs hover:underline font-medium group-hover:text-monad-primary/80 transition-colors"
                    title={`View transaction ${tx.hash}`}
                  >
                    View TX →
                  </a>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 font-mono">
                    {tx.hash.slice(0, 16)}...{tx.hash.slice(-8)}
                  </div>
                  <div className="text-xs text-green-400">
                    ✓ Success
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}