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
        toggle.setAttribute("aria-checked", theme === "dark-mode");
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
        currentDateElement.textContent = today.toLocaleDateString('de-DE', options);
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
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const leftColumnX = 10;
                const rightColumnX = 80;
                const margin = 10;
                const maxLineWidthLeft = 60;
                const maxLineWidthRight = pageWidth - rightColumnX - margin;
                let leftY = 10;
                let rightY = 10;

                // Schriftart und Farben
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(0, 0, 0);
                pdf.setDrawColor(0, 128, 0); // Grün für Linien

                // Header
                pdf.setFontSize(20);
                pdf.setFont("helvetica", "bold");
                pdf.text("Mohammad Jakob Sarwary", leftColumnX, leftY);
                leftY += 8;
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                pdf.text("Informatik B.Sc. Student an der TH Köln", leftColumnX, leftY);
                leftY += 10;

                // Profilbild
                const profileImage = document.querySelector(".profile-image");
                if (profileImage && window.html2canvas) {
                    try {
                        const canvas = await window.html2canvas(profileImage, { scale: 3, useCORS: true });
                        const imgData = canvas.toDataURL('image/jpeg', 0.95);
                        pdf.addImage(imgData, 'JPEG', leftColumnX, leftY, 30, 30);
                        leftY += 35;
                    } catch (imgError) {
                        console.warn("Profilbild konnte nicht geladen werden:", imgError);
                    }
                }

                // Social Media Icons
                const socialIcons = [
                    { id: "linkedin-link", name: "LinkedIn" },
                    { id: "xing-link", name: "Xing" },
                    { id: "instagram-link", name: "Instagram" }
                ];
                let iconX = leftColumnX;
                for (const icon of socialIcons) {
                    const imgElement = document.querySelector(`#${icon.id} img`);
                    if (imgElement) {
                        try {
                            const canvas = await window.html2canvas(imgElement, { scale: 3, useCORS: true });
                            const imgData = canvas.toDataURL('image/jpeg', 0.95);
                            pdf.addImage(imgData, 'JPEG', iconX, leftY - 5, 5, 5);
                            iconX += 7;
                        } catch (imgError) {
                            console.warn(`Social Media Icon ${icon.id} konnte nicht geladen werden:`, imgError);
                        }
                    }
                }
                leftY += 10;

                // Kontaktdaten
                pdf.setFontSize(14);
                pdf.setFont("helvetica", "bold");
                pdf.text("Kontaktdaten", leftColumnX, leftY);
                pdf.line(leftColumnX, leftY + 1, leftColumnX + 30, leftY + 1);
                leftY += 6;
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(12);
                pdf.textWithLink("E-Mail: jakob22171@gmail.com", leftColumnX, leftY, { url: "mailto:jakob22171@gmail.com" });
                leftY += 6;
                pdf.text("Adresse: Köln, Deutschland", leftColumnX, leftY);
                leftY += 6;
                pdf.text("Telefon: [Auf Anfrage]", leftColumnX, leftY);
                leftY += 6;
                pdf.text("Geburtsdatum: [Auf Anfrage]", leftColumnX, leftY);
                leftY += 10;

                // Social Media Links (Text)
                pdf.setFont("helvetica", "bold");
                pdf.text("Social Media", leftColumnX, leftY);
                pdf.line(leftColumnX, leftY + 1, leftColumnX + 30, leftY + 1);
                leftY += 6;
                pdf.setFont("helvetica", "normal");
                for (const icon of socialIcons) {
                    const linkElement = document.getElementById(icon.id);
                    if (linkElement) {
                        pdf.textWithLink(icon.name, leftColumnX, leftY, { url: linkElement.href });
                        leftY += 6;
                    }
                }
                leftY += 4;

                // IT-Kenntnisse
                pdf.setFont("helvetica", "bold");
                pdf.text("IT-Kenntnisse", leftColumnX, leftY);
                pdf.line(leftColumnX, leftY + 1, leftColumnX + 30, leftY + 1);
                leftY += 6;
                pdf.setFont("helvetica", "normal");
                const skills = [
                    "HTML, CSS, Linux (Grundlagen)",
                    "Programmiersprachen: C, Python, Java, Kotlin (Grundlagen)",
                    "MS-Office (Word, Excel, PowerPoint)"
                ];
                skills.forEach(skill => {
                    const lines = pdf.splitTextToSize(`• ${skill}`, maxLineWidthLeft);
                    pdf.text(lines, leftColumnX, leftY);
                    leftY += 6 * lines.length;
                });
                leftY += 4;

                // Sprachkenntnisse
                pdf.setFont("helvetica", "bold");
                pdf.text("Sprachkenntnisse", leftColumnX, leftY);
                pdf.line(leftColumnX, leftY + 1, leftColumnX + 30, leftY + 1);
                leftY += 6;
                pdf.setFont("helvetica", "normal");
                const languages = [
                    "Deutsch: C1 (fließend)",
                    "Englisch: B2 (gute Kenntnisse)",
                    "Hindi: B1 (fortgeschritten)"
                ];
                languages.forEach(lang => {
                    pdf.text(`• ${lang}`, leftColumnX, leftY);
                    leftY += 6;
                });
                leftY += 4;

                // Persönliche Stärken
                pdf.setFont("helvetica", "bold");
                pdf.text("Persönliche Stärken", leftColumnX, leftY);
                pdf.line(leftColumnX, leftY + 1, leftColumnX + 30, leftY + 1);
                leftY += 6;
                pdf.setFont("helvetica", "normal");
                const strengths = [
                    "Teamfähigkeit",
                    "Motivation",
                    "Belastbarkeit",
                    "Verantwortungsbewusstsein"
                ];
                strengths.forEach(strength => {
                    pdf.text(`• ${strength}`, leftColumnX, leftY);
                    leftY += 6;
                });

                // Rechte Spalte: Beruflicher Werdegang
                pdf.setFontSize(14);
                pdf.setFont("helvetica", "bold");
                pdf.text("Beruflicher Werdegang", rightColumnX, rightY);
                pdf.line(rightColumnX, rightY + 1, rightColumnX + 60, rightY + 1);
                rightY += 6;
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(12);
                const experience = [
                    "Corona-Tester im Testzentrum\nKRONE Hygiene Consulting UG, Köln, Deutschland\nFeb 2022 - Jun 2022\nVerantwortlich für die Durchführung von Corona-Tests, Kundenbetreuung und Dokumentation.",
                    "Praktikum (einjährig)\nSt. Vinzenz Hospital GmbH, Köln, Deutschland\nFeb 2017 - Jan 2018\nUnterstützung im administrativen Bereich und Einblicke in Krankenhausprozesse."
                ];
                experience.forEach(item => {
                    const lines = pdf.splitTextToSize(item, maxLineWidthRight);
                    pdf.text(lines, rightColumnX, rightY);
                    rightY += 6 * lines.length;
                });
                rightY += 4;

                // Studium, Schul- und Weiterbildung
                pdf.setFont("helvetica", "bold");
                pdf.text("Studium, Schul- und Weiterbildung", rightColumnX, rightY);
                pdf.line(rightColumnX, rightY + 1, rightColumnX + 60, rightY + 1);
                rightY += 6;
                pdf.setFont("helvetica", "normal");
                const education = [
                    "Bachelor of Science, Informatik\nTH Köln, Gummersbach, Deutschland\nSep 2023 - aktuell",
                    "Fachhochschulreife\nKöln-Kolleg Weiterbildungskolleg, Köln, Deutschland\nAug 2022 - Jun 2023",
                    "Fachoberschulreife\nKöln-Kolleg Weiterbildungskolleg, Köln, Deutschland\nFeb 2020 - Jan 2022",
                    "Erprobungscenter Digitale Berufe\nDCI - Digital Career Institute, Düsseldorf, Deutschland\nSep 2019 - Okt 2019\nEinführung in digitale Berufe und grundlegende IT-Konzepte."
                ];
                education.forEach(item => {
                    const lines = pdf.splitTextToSize(item, maxLineWidthRight);
                    pdf.text(lines, rightColumnX, rightY);
                    rightY += 6 * lines.length;
                });

                // Datum am unteren Rand
                const today = new Date();
                const dateString = `Köln, ${today.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}`;
                pdf.setFontSize(12);
                pdf.text(dateString, pageWidth - margin, pageHeight - margin, { align: 'right' });

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
