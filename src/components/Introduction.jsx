import React from 'react'
import { FaUndo, FaHistory, FaWarehouse, FaCartPlus } from 'react-icons/fa'
import '../styles/Introduction.css'

function Introduction() {
    return (
        <div className="introduction">
            <header className="introduction-header">
                <h1>
                    Willkommen auf der <span className="highlight">wareflow</span> Dashboard
                </h1>
                <p>
                    Optimieren Sie Ihre Lagerverwaltung, verwalten Sie Bestellungen und behalten Sie den Überblick über
                    Ihre Prozesse – alles an einem Ort.
                </p>
            </header>

            <section className="features-section">
                <div className="features-grid">
                    <div className="feature-item">
                        <FaHistory className="feature-icon" />
                        <h3>Bestandsbewegung</h3>
                        <p>
                            Verfolgen Sie alle Warenbewegungen und behalten Sie die Übersicht über Ihre Lagerprozesse.
                        </p>
                    </div>

                    <div className="feature-item">
                        <FaWarehouse className="feature-icon" />
                        <h3>Lagerverwaltung</h3>
                        <p>Organisieren Sie Ihre Bestände effizient und halten Sie den Überblick über Ihre Artikel.</p>
                    </div>

                    <div className="feature-item">
                        <FaCartPlus className="feature-icon" />
                        <h3>Verkaufsübersicht</h3>
                        <p>Überblicken Sie Ihre Verkäufe und behalten Sie alle Transaktionen im Blick.</p>
                    </div>
                    <div className="feature-item">
                        <FaUndo className="feature-icon" />
                        <h3>Retourenmanagement</h3>
                        <p>Erfassen Sie Rückgaben einfach und aktualisieren Sie den Lagerbestand automatisch.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Introduction
