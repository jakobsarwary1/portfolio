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
toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "dark-mode" : "light-mode";
    setTheme(newTheme);
});


// Funktion: PDF herunterladen
document.getElementById("downloadPdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;

    // Neues jsPDF-Objekt erstellen
    const pdf = new jsPDF();

    // HTML-Inhalt auswählen
    const content = document.body; // Ersetzen durch:
    const content = document.querySelector("main");


    // HTML in PDF umwandeln
    pdf.html(content, {
        callback: function (pdf) {
            pdf.save("Lebenslauf_Mohammad_Jakob_Sarwary.pdf"); // Dateiname
        },
        x: 10,
        y: 10,
        width: 180, // Anpassung der Breite für Inhalte
        windowWidth: 900 // Ansichtsfenster anpassen
    });
});
