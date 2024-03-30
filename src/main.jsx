import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import KeyPress from './utils/keyPress.jsx'
import Context from './utils/globalsContext.js'
import globals from './utils/globals.js'

const Root = () => {
  const [global, setGlobal] = useState(globals)

  return (
    <Context.Provider value={{ global, setGlobal }}>
      <KeyPress>
        <App />
      </KeyPress>
    </Context.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
