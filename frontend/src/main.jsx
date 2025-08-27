import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ParticipantProvider } from './context/Particiapants.jsx'

createRoot(document.getElementById('root')).render(
  <ParticipantProvider>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </ParticipantProvider>,
)
