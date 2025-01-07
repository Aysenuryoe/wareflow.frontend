import React, { useState } from 'react'
import '../styles/Login.css'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            setError('Bitte füllen Sie alle Felder aus.')
            return
        }

        try {
            const response = await fetch('https://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            if (!response.ok) throw new Error('Falsche Anmeldedaten')

            const data = await response.json()

            login(data.accessToken, data.user)

            setError('')
        } catch (err) {
            setError(err.message || 'Ein Fehler ist aufgetreten.')
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">E-Mail</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Geben Sie Ihre E-Mail ein"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Passwort</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Geben Sie Ihr Passwort ein"
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
