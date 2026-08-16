import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n.js'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' //imported
import { ThemeProvider } from './Context/ThemeContext.jsx'
import { AppProvider } from './Context/AppContext.jsx'


createRoot(document.getElementById('root')).render(

  // <StrictMode>
  //   <App />
  // </StrictMode>,

  <ThemeProvider>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </ThemeProvider>,

)

