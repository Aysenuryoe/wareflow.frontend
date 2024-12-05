import React from "react";
import '../styles/Introduction.css';

function Introduction() {
    return (
        <div className="introduction">
            <h1>
                Willkommen auf der <span className="highlight">wareflow</span> Dashboard
            </h1>
            <p>
                Verwalten Sie Ihre Bestellungen, analysieren Sie Statistiken und behalten Sie den Überblick – alles an einem Ort.
            </p>
        </div>
    );
}

export default Introduction;