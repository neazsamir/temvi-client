import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './index.css'
import { AppProvider } from './store/AppContext'
import { SearchProvider } from './store/SearchContext'

createRoot(document.getElementById('root')).render(
    <AppProvider>
    	<SearchProvider>
  	  <App />
    	</SearchProvider>
    </AppProvider>
)
