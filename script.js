// Begrüßung basierend auf der Uhrzeit
function updateGreeting() {
    const greeting = document.getElementById("greeting");
    const hour = new Date().getHours();
    let message = "Willkommen";

    if (hour < 12) {
        message = "Guten Morgen";
    } else if (hour < 18) {
        message = "Guten Tag";
    } else {
        message = "Guten Abend";
    }

    greeting.textContent = message + ", Mohammad Jakob Sarwary!";
}

// Smooth-Scroll-Funktion
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Erscheinungseffekt beim Scrollen
function revealOnScroll() {
    const sections = document.querySelectorAll('.section');
    const triggerBottom = window.innerHeight / 5 * 4;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;

        if(sectionTop < triggerBottom) {
            section.classList.add('visible');
        } else {
            section.classList.remove('visible');
        }
    });
}

// Funktionen beim Laden und Scrollen aufrufen
window.addEventListener('DOMContentLoaded', updateGreeting);
window.addEventListener('scroll', revealOnScroll);
