// Elementreferenzen
const toggle = document.getElementById("darkModeToggle");
const body = document.body;
const themeLabel = document.getElementById("theme-label");

// Funktion: Aktuelles Thema anwenden
function applyTheme(theme) {
    body.classList.remove("light-mode", "dark-mode");
    body.classList.add(theme);
    toggle.checked = theme === "dark-mode";
    themeLabel.textContent = theme === "dark-mode" ? "Light Mode" : "Dark Mode";
}

// Funktion: Präferenz speichern und anwenden
function setTheme(theme) {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
}

// Funktion: Thema basierend auf der Tageszeit
function getThemeByTime() {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6 ? "dark-mode" : "light-mode";
}

// Initialisierung: Prüfe lokale Präferenz oder Tageszeit
(function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const timeBasedTheme = getThemeByTime();
        applyTheme(timeBasedTheme);
    }
})();

// Eventlistener: Schalter umlegen
if (toggle) {
    toggle.addEventListener("change", () => {
        const newTheme = toggle.checked ? "dark-mode" : "light-mode";
        setTheme(newTheme);
    });
} else {
    console.error("Dark Mode Toggle nicht gefunden!");
}

// Aktuelles Datum anzeigen
document.addEventListener('DOMContentLoaded', function() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = today.toLocaleDateString('de-DE', options); // Zeigt z. B. "27. Mai 2025"
    } else {
        console.error("Element mit ID 'currentDate' nicht gefunden!");
    }
});

// PDF-Generierung
const downloadButton = document.getElementById("downloadPdf");
if (downloadButton) {
    downloadButton.addEventListener("click", async () => {
        try {
            const { jsPDF } = window.jspdf;
            if (!jsPDF) throw new Error("jsPDF ist nicht geladen!");
            if (!window.html2canvas) throw new Error("html2canvas ist nicht geladen!");

            // Neues jsPDF-Objekt erstellen
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // HTML-Inhalt auswählen (nur Main-Bereich)
            const content = document.querySelector("main");
            if (!content) throw new Error("Inhalt für PDF nicht gefunden!");

            // HTML in PDF umwandeln
            await pdf.html(content, {
                callback: function (pdf) {
                    // Fallback: Manuelles Erstellen eines Download-Links
                    const blob = pdf.output('blob');
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'Lebenslauf_Mohammad_Jakob_Sarwary.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                },
                x: 10,
                y: 10,
                width: 190, // Angepasst für A4-Breite (210mm - 10mm Rand links/rechts)
                windowWidth: 900
            });
        } catch (error) {
            console.error("Fehler bei der PDF-Generierung:", error);
            alert("Es gab ein Problem beim Erstellen des PDFs: " + error.message);
        }
    });
} else {
    console.error("Button mit ID 'downloadPdf' nicht gefunden!");
}
