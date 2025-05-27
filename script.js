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

            // HTML-Inhalt auswählen (Main-Bereich)
            const content = document.querySelector("main");
            if (!content) throw new Error("Inhalt für PDF nicht gefunden!");

            // HTML mit html2canvas rendern
            const canvas = await window.html2canvas(content, {
                scale: 2, // Höhere Auflösung für bessere Qualität
                useCORS: true, // Unterstützung für externe Bilder (z. B. Social-Media-Icons)
                backgroundColor: '#ffffff' // Weißer Hintergrund für PDF
            });

            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Bild zum PDF hinzufügen
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Fallback: Blob-basierter Download
            const blob = pdf.output('blob');
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Lebenslauf_Mohammad_Jakob_Sarwary.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Fehler bei der PDF-Generierung:", error);
            alert("Es gab ein Problem beim Erstellen des PDFs: " + error.message);
        }
    });
} else {
    console.error("Button mit ID 'downloadPdf' nicht gefunden!");
}
