import './App.css'
import { ConnectWallet } from './components/ConnectWallet'
import { PriceChart } from './components/PriceChart'

function App() {
  return (
    <div className="bg-black min-h-screen">
      <div className="p-4 flex justify-center text-white">
        <h1 className="text-xl mb-4">Mini App</h1>
      </div>
      <ConnectWallet />
      <PriceChart />
    </div>
  )
}

export default App
