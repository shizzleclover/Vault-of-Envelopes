import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import EnvelopeStack from './components/EnvelopeStack'
import AdminLogin from './components/AdminPanel/AdminLogin'
import AdminDashboard from './components/AdminPanel/AdminDashboard'
import EnvelopeEditor from './components/AdminPanel/EnvelopeEditor'
import TarotManager from './components/AdminPanel/TarotManager'
import ProtectedRoute from './components/AdminPanel/ProtectedRoute'

function App() {
    return (
        <AuthProvider>
            <div className="w-full h-full relative">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<EnvelopeStack />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/envelope/:id"
                        element={
                            <ProtectedRoute>
                                <EnvelopeEditor />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/tarot"
                        element={
                            <ProtectedRoute>
                                <TarotManager />
                            </ProtectedRoute>
                        }
                    />

                    {/* Legacy route - redirect to login */}
                    <Route path="/admin" element={<AdminLogin />} />
                </Routes>

                {/* Toast notifications */}
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#1E293B',
                            color: '#F1F5F9',
                            border: '1px solid #334155'
                        },
                        success: {
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#1E293B'
                            }
                        },
                        error: {
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#1E293B'
                            }
                        }
                    }}
                />
            </div>
        </AuthProvider>
    )
}

export default App
