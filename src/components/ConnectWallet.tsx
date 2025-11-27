import { useState } from 'react'

export const ConnectWallet = () => {
  const [isConnected, setIsConnected] = useState(false)
  const walletAddress = '0xAbCdefGhIjKlMnOpQrStUvWxYz1234567890' // Пример полного адреса

  const truncateAddress = (address: string): string => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleConnect = () => {
    // Здесь можно добавить логику подключения/отключения кошелька
    if (isConnected) {
      setIsConnected(false)
      console.log('Отключение кошелька...')
    } else {
      setIsConnected(true)
      console.log('Подключение кошелька...')
    }
  }

  return (
    <div className="flex justify-end mb-4">
      {isConnected ? (
        <div className="flex flex-col items-center">
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium text-sm border border-gray-700 hover:bg-gray-700 transition-colors"
            onClick={handleConnect}
          >
            Disconnect Wallet
          </button>
          <p className="text-white mt-4">{truncateAddress(walletAddress)}</p>
        </div>
      ) : (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors"
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
