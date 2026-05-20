import React from 'react'
import ReactDOM from 'react-dom/client'
import RunShowDemo from './demo.jsx'
import './styles.css'

const mount = document.getElementById('demo-mount')
if (mount) {
  ReactDOM.createRoot(mount).render(<RunShowDemo />)
}
