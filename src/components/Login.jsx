import React, { useState } from 'react';
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Funktion zur Handhabung der Formularübermittlung
  const handleSubmit = (e) => {
    e.preventDefault();

    // Einfache Validierung der Eingaben
    if (!email || !password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    // Ein Beispiel-Login-Request, hier solltest du deine API-Logik implementieren
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Setze Error zurück bei erfolgreicher Validierung
    setError('');
    // Weiterleitung oder andere Logik nach erfolgreichem Login
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      
      {error && <div className="error-message">{error}</div>}

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

        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
}
