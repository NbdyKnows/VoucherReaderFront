
import './App.css'
import FileUpload from './components/FileUpload'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Subida de Facturas</h1>
      </header>
      <main>
        <FileUpload />
      </main>
    </div>
  )
}

export default App