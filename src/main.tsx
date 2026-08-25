import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './aiRisk'
import './VideoCall'
import './sms'
import './dbInit'
import './referrals'
import './followups'
import './triage'
import './recommendedActions'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
