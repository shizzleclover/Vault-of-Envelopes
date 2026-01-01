import { Routes, Route } from 'react-router-dom'
import EnvelopeStack from './components/EnvelopeStack'
import AdminDashboard from './components/AdminPanel/AdminDashboard'

function App() {
    return (
        <div className="w-full h-full relative">
            <Routes>
                <Route path="/" element={<EnvelopeStack />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </div>
    )
}

export default App
