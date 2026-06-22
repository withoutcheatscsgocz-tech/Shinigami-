import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GameProvider } from './game/state.tsx'
import { ShellProvider } from './ui/shell.tsx'
import { DeviceSimProvider } from './game/deviceSim.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <DeviceSimProvider>
        <ShellProvider>
          <App />
        </ShellProvider>
      </DeviceSimProvider>
    </GameProvider>
  </StrictMode>,
)
