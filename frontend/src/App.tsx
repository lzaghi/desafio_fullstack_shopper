import AppProvider from './context/AppProvider'
import Homepage from './pages/Homepage'

function App() {
  return (
    <AppProvider>
      <Homepage />
    </AppProvider>
  )
}

export default App
