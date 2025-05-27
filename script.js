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
        currentDateElement.textContent = today.toLocaleDateString('de-DE', options);
    } else {
        console.error("Element mit ID 'currentDate' nicht gefunden!");
    }
});

// ------------------------------------------------
// PDF-Generierung
// ------------------------------------------------
const downloadButton = document.getElementById("downloadPdf");
if (downloadButton) {
    downloadButton.addEventListener("click", () => {
        try {
            const { jsPDF } = window.jspdf;

            // Neues jsPDF-Objekt erstellen
            const pdf = new jsPDF();

            // HTML-Inhalt auswählen (nur Main-Bereich)
            const content = document.querySelector("main");
            if (!content) throw new Error("Inhalt für PDF nicht gefunden!");

            // HTML in PDF umwandeln
            pdf.html(content, {
                callback: function (pdf) {
                    pdf.save("Lebenslauf_Mohammad_Jakob_Sarwary.pdf");
                },
                x: 10,
                y: 10,
                width: 180,
                windowWidth: 900
            });
        } catch (error) {
            console.error("Fehler bei der PDF-Generierung:", error);
            alert("Es gab ein Problem beim Erstellen des PDFs. Bitte versuchen Sie es erneut.");
        }
    });
} else {
    console.error("Button mit ID 'downloadPdf' nicht gefunden!");
}
