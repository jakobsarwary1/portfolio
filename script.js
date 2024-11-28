// Dark Mode Switch
const toggle = document.getElementById("darkModeToggle");
const body = document.body;
const themeLabel = document.getElementById("theme-label");

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    body.classList.add(savedTheme);
    toggle.checked = savedTheme === "dark-mode";
    themeLabel.textContent = savedTheme === "dark-mode" ? "Light Mode" : "Dark Mode";
}

// Toggle theme on switch
toggle.addEventListener("change", () => {
    if (toggle.checked) {
        body.classList.replace("light-mode", "dark-mode");
        localStorage.setItem("theme", "dark-mode");
        themeLabel.textContent = "Light Mode";
    } else {
        body.classList.replace("dark-mode", "light-mode");
        localStorage.setItem("theme", "light-mode");
        themeLabel.textContent = "Dark Mode";
    }
});
