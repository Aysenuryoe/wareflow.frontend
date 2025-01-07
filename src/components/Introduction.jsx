import React from 'react'
import { FaUndo, FaHistory, FaWarehouse, FaCartPlus } from 'react-icons/fa'
import '../styles/Introduction.css'

const FeatureItem = ({ icon, title, description }) => (
    <div className="feature-item">
        {icon}
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
)

const Introduction = () => {
    return (
        <div className="introduction">
            <header className="introduction-header">
                <h1>
                    Willkommen beim <span className="highlight">wareflow</span> Dashboard
                </h1>
                <p>
                    Optimieren Sie Ihre Lagerverwaltung, verwalten Sie Bestellungen und behalten Sie den Überblick über
                    Ihre Prozesse – alles an einem Ort.
                </p>
            </header>

            <section className="features-section">
                <div className="features-grid">
                    <FeatureItem
                        icon={<FaHistory className="feature-icon" />}
                        title="Bestandsbewegung"
                        description="Verfolgen Sie sämtliche Bestandsbewegungen und bleiben Sie stets auf dem Laufenden."
                    />
                    <FeatureItem
                        icon={<FaWarehouse className="feature-icon" />}
                        title="Lagerverwaltung"
                        description="Organisieren Sie Ihre Bestände effizient und halten Sie den Überblick über Ihre Artikel."
                    />
                    <FeatureItem
                        icon={<FaCartPlus className="feature-icon" />}
                        title="Verkaufsübersicht"
                        description="Überblicken Sie Ihre Verkäufe und behalten Sie alle Transaktionen im Blick."
                    />
                    <FeatureItem
                        icon={<FaUndo className="feature-icon" />}
                        title="Retourenmanagement"
                        description="Erfassen Sie Rückgaben einfach und aktualisieren Sie den Lagerbestand automatisch."
                    />
                </div>
            </section>
        </div>
    )
}

export default Introduction
