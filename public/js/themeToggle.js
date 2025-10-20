const themeToggleButton = document.getElementById("themeToggleButton");
const themeToggleSidebarButton = document.getElementById(
  "themeToggleSidebarButton",
);
function toggleTheme() {
  if (localStorage.theme === "dark") localStorage.setItem("theme", "light");
  else localStorage.setItem("theme", "dark");

  document.querySelector("html").setAttribute("data-theme", localStorage.theme);
}

if (themeToggleButton) themeToggleButton.addEventListener("click", toggleTheme);

if (themeToggleSidebarButton)
  themeToggleSidebarButton.addEventListener("click", toggleTheme);
