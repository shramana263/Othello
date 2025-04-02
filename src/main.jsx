import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Computer from './Computer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <Computer/>
  </StrictMode>,
)
