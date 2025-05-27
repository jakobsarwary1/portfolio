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
        currentDateElement.textContent = today.toLocaleDateString('de-DE', options); // Zeigt "27. Mai 2025"
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

            // Neues jsPDF-Objekt erstellen
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Variablen für Positionierung
            let yPosition = 10;
            const margin = 10;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const maxLineWidth = pageWidth - 2 * margin;

            // Schriftart und Größe setzen
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(12);

            // Header
            pdf.setFontSize(20);
            pdf.text("Mohammad Jakob Sarwary", margin, yPosition);
            yPosition += 8;
            pdf.setFontSize(12);
            pdf.text("Informatik B.Sc. Student an der TH Köln", margin, yPosition);
            yPosition += 10;

            // Profilbild (falls verfügbar)
            const profileImage = document.querySelector(".profile-image");
            if (profileImage && window.html2canvas) {
                const canvas = await window.html2canvas(profileImage, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', margin, yPosition, 30, 30); // 30mm x 30mm
                yPosition += 35;
            }

            // Kontaktdaten
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.text("Kontaktdaten", margin, yPosition);
            yPosition += 6;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(12);
            pdf.textWithLink("E-Mail: jakob22171@gmail.com", margin, yPosition, { url: "mailto:jakob22171@gmail.com" });
            yPosition += 6;
            pdf.text("Adresse: Köln", margin, yPosition);
            yPosition += 6;
            pdf.text("Telefon: ", margin, yPosition);
            yPosition += 6;
            pdf.text("Geburtsdatum: ", margin, yPosition);
            yPosition += 10;

            // Social Media Links
            pdf.setFont("helvetica", "bold");
            pdf.text("Social Media", margin, yPosition);
            yPosition += 6;
            pdf.setFont("helvetica", "normal");
            pdf.textWithLink("LinkedIn", margin, yPosition, { url: "https://www.linkedin.com/in/mohammad-jakob-sarwary-110030156/" });
            yPosition += 6;
            pdf.textWithLink("Xing", margin, yPosition, { url: "https://www.xing.com/profile/MohammadJakob_Sarwary2" });
            yPosition += 6;
            pdf.textWithLink("Instagram", margin, yPosition, { url: "https://www.instagram.com/jakobjava" });
            yPosition += 10;

            // IT-Kenntnisse
            pdf.setFont("helvetica", "bold");
            pdf.text("IT-Kenntnisse", margin, yPosition);
            yPosition += 6;
            pdf.setFont("helvetica", "normal");
            pdf.text("• HTML, CSS und Basics von Linux, C, Python, Java und Kotlin", margin, yPosition);
            yPosition += 6;
            pdf.text("• MS-Office", margin, yPosition);
            yPosition += 10;

            // Sprachkenntnisse
            pdf.setFont("helvetica", "bold");
            pdf.text("Sprachkenntnisse", margin, yPosition);
            yPosition += 6;
            pdf.setFont("helvetica", "normal");
            pdf.text("• Deutsch: C1", margin, yPosition);
            yPosition += 6;
            pdf.text("• Englisch: B2", margin, yPosition);
            yPosition += 6;
            pdf.text("• Hindi: B1", margin, yPosition);
            yPosition += 10;

            // Stärken
            pdf.setFont("helvetica", "bold");
            pdf.text("Stärken", margin, yPosition);
            yPosition += 6;
            pdf.setFont("helvetica", "normal");
            pdf.text("• Teamfähigkeit", margin, yPosition);
            yPosition += 6;
            pdf.text("• Motivation", margin, yPosition);
            yPosition += 6;
            pdf.text("• Belastbarkeit", margin, yPosition);
            yPosition += 6;
            pdf.text("• Verantwortungsbewusstsein", margin, yPosition);
            yPosition += 10;

            // Studium, Schul- und Weiterbildung
            pdf.setFont("helvetica", "bold");
            pdf.text("Studium, Schul- und Weiterbildung", margin, yPosition);
            yPosition += 6;
            pdf.setFont("helvetica", "normal");
            const education = [
                "Bachelor of Science\nTH Köln, Gummersbach, Deutschland\nSep 2023 - Aktuell",
                "Fachhochschulreife\nKöln-Kolleg Weiterbildungskolleg, Köln, Deutschland\nAug 2022 - Jun 2023",
                "Fachoberschulreife\nKöln-Kolleg Weiterbildungskolleg, Köln, Deutschland\nFeb 2020 - Jan 2022",
                "Erprobungscenter Digitale Berufe\nDCI - Digital Career Institute, Düsseldorf, Deutschland\nSep 2019 - Okt 2019"
            ];
            education.forEach(item => {
                const lines = pdf.splitTextToSize(item, maxLineWidth);
                pdf.text(lines, margin, yPosition);
                yPosition += 6 * lines.length;
            });

            // Datum am unteren Rand
            const today = new Date();
            const dateString = `Köln, ${today.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}`;
            pdf.text(dateString, pageWidth - 10, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });

            // Blob-basierter Download
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
