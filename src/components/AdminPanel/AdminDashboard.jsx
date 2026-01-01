// Placeholder component - will be built in Phase 6
import { useState } from 'react'

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')

    const handleLogin = (e) => {
        e.preventDefault()
        if (password === 'admin123') {
            setIsAuthenticated(true)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <form
                    onSubmit={handleLogin}
                    className="bg-deep-midnight/80 p-8 rounded-xl border border-soft-gold/20"
                >
                    <h1 className="font-playfair text-2xl text-cream mb-6 text-center">
                        Admin Access
                    </h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-4 py-3 bg-cream/10 border border-cream/20 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:border-soft-gold/50 mb-4"
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-soft-gold/20 hover:bg-soft-gold/30 border border-soft-gold/40 rounded-lg text-soft-gold font-medium transition-colors"
                    >
                        Enter
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="w-full h-full p-8 overflow-auto">
            <h1 className="font-playfair text-3xl text-cream mb-8">
                Envelope Admin Dashboard
            </h1>
            <p className="text-cream/60">
                Admin panel coming soon...
            </p>
        </div>
    )
}
