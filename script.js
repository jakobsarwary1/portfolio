document.addEventListener('DOMContentLoaded', function() {
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
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = today.toLocaleDateString('de-DE', options); // Zeigt "27. Mai 2025"
    } else {
        console.error("Element mit ID 'currentDate' nicht gefunden!");
    }

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

                // Profilbild
                const profileImage = document.querySelector(".profile-image");
                if (profileImage && window.html2canvas) {
                    try {
                        const canvas = await window.html2canvas(profileImage, { scale: 3, useCORS: true });
                        const imgData = canvas.toDataURL('image/jpeg', 0.95); // JPEG für bessere Kompression
                        pdf.addImage(imgData, 'JPEG', margin, yPosition, 30, 30); // 30mm x 30mm
                        yPosition += 35;
                    } catch (imgError) {
                        console.warn("Profilbild konnte nicht geladen werden:", imgError);
                    }
                }

                // Social Media Icons (klein)
                const socialIcons = document.querySelectorAll(".social-icon img");
                let xPosition = margin;
                for (let i = 0; i < socialIcons.length; i++) {
                    try {
                        const canvas = await window.html2canvas(socialIcons[i], { scale: 3, useCORS: true });
                        const imgData = canvas.toDataURL('image/jpeg', 0.95);
                        pdf.addImage(imgData, 'JPEG', xPosition, yPosition - 5, 5, 5); // 5mm x 5mm
                        xPosition += 7;
                    } catch (imgError) {
                        console.warn(`Social Media Icon ${i} konnte nicht geladen werden:`, imgError);
                    }
                }
                yPosition += 10;

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

                // Social Media Links (Text)
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
                const skills = [
                    "HTML, CSS und Basics von Linux, C, Python, Java und Kotlin",
                    "MS-Office"
                ];
                skills.forEach(skill => {
                    const lines = pdf.splitTextToSize(`• ${skill}`, maxLineWidth);
                    pdf.text(lines, margin, yPosition);
                    yPosition += 6 * lines.length;
                });
                yPosition += 4;

                // Sprachkenntnisse
                pdf.setFont("helvetica", "bold");
                pdf.text("Sprachkenntnisse", margin, yPosition);
                yPosition += 6;
                pdf.setFont("helvetica", "normal");
                const languages = [
                    "Deutsch: C1",
                    "Englisch: B2",
                    "Hindi: B1"
                ];
                languages.forEach(lang => {
                    pdf.text(`• ${lang}`, margin, yPosition);
                    yPosition += 6;
                });
                yPosition += 4;

                // Stärken
                pdf.setFont("helvetica", "bold");
                pdf.text("Stärken", margin, yPosition);
                yPosition += 6;
                pdf.setFont("helvetica", "normal");
                const strengths = [
                    "Teamfähigkeit",
                    "Motivation",
                    "Belastbarkeit",
                    "Verantwortungsbewusstsein"
                ];
                strengths.forEach(strength => {
                    pdf.text(`• ${strength}`, margin, yPosition);
                    yPosition += 6;
                });
                yPosition += 4;

                // Studium, Schul- und Weiterbildung
                pdf.setFont("helvetica", "bold");
                pdf.text("Studium, Schul- und Weiterbildung", margin, yPosition);
                yPosition += 6;
                pdf.setFont("helvetica", "normal");
                const education = [
                    "Bachelor of Science\nTH Köln, Gummersbach, Deutschland\nSep 2023 - Aktuell",
                    "Fachhochschulreife\nKöln-Kolleg Weiterbildungskolleg, Köln, Deutschland\nAug 2022 - Jun 2023",
                    "Fachoberschulreife\nKöln-Kolleg Weiterbildungskolleg, Köln, Deutschland\nFeb 2020 - März 2022",
                    "Erprobungscenter für digitale Berufe\nDCI - Digital Career Institute, Düsseldorf, Deutschland\nSep 2021 - Okt 2021"
                ];
                education.forEach(item => {
                    const lines = pdf.splitTextToSize(item, maxLineWidth);
                    pdf.text(lines, margin, yPosition);
                    yPosition += 6 * lines.length;
                });
                yPosition += 4;

                // Datum am unteren Rand
                const today = new Date();
                const dateString = `Köln, ${today.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}`;
                pdf.setFontSize(12);
                pdf.text(dateString, pageWidth - margin, pdf.internal.pageSize.getHeight() - margin, { align: 'right' });

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
});
