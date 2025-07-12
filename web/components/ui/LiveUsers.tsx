'use client'

import { useState, useEffect } from 'react'
import { Users, Circle } from 'lucide-react'

interface User {
  address: string
  lastSeen: number
}

export function LiveUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    // Mock live users for demo
    const mockUsers: User[] = [
      {
        address: '0xabcd1234567890abcdef1234567890abcdef1234',
        lastSeen: Date.now()
      },
      {
        address: '0xbcde2345678901bcdef2345678901bcdef2345678',
        lastSeen: Date.now() - 1000 * 30
      },
      {
        address: '0xcdef3456789012cdef3456789012cdef3456789',
        lastSeen: Date.now() - 1000 * 60
      }
    ]
    
    setUsers(mockUsers)
    setUserCount(mockUsers.length + Math.floor(Math.random() * 10))

    // Simulate user activity updates
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getActivityStatus = (lastSeen: number) => {
    const diff = Date.now() - lastSeen
    if (diff < 1000 * 30) return { status: 'active', color: 'text-green-500' }
    if (diff < 1000 * 60 * 2) return { status: 'recent', color: 'text-yellow-500' }
    return { status: 'idle', color: 'text-gray-400' }
  }

  return (
    <div className="monad-glass rounded-xl border border-white/10">
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users size={16} />
            <span>Live Users</span>
          </div>
          <div className="flex items-center space-x-1">
            <Circle size={8} className="text-green-500 fill-current" />
            <span className="text-sm text-gray-200">{userCount}</span>
          </div>
        </h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            No active users
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {users.map((user) => {
              const activity = getActivityStatus(user.lastSeen)
              return (
                <div key={user.address} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-200 font-mono">
                      {formatAddress(user.address)}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Circle size={6} className={`${activity.color} fill-current`} />
                      <span className={`text-xs ${activity.color} capitalize`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      <div className="px-6 py-3 border-t border-white/10 bg-white/5">
        <div className="text-xs text-gray-400 text-center">
          Users active in the last 5 minutes
        </div>
      </div>
    </div>
  )
}