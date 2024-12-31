import React, { useState } from 'react'
import '../styles/Login.css'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

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

            if (!response.ok) {
                throw new Error('Falsche Anmeldedaten')
            }

            const data = await response.json()

            localStorage.setItem('accessToken', data.accessToken)

            setError('')

            if (onLogin) onLogin()
            navigate('/')
        } catch (err) {
            setError(err.message || 'Ein Fehler ist aufgetreten.')
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>

            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Geben Sie Ihre E-Mail ein"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Passwort</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Geben Sie Ihr Passwort ein"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="login-btn">
                    Login
                </button>
            </form>
        </div>
    )
}
