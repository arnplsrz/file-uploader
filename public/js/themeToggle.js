const themeToggleButton = document.getElementById("themeToggleButton");
const themeToggleSidebarButton = document.getElementById(
  "themeToggleSidebarButton",
);
function toggleTheme() {
  if (localStorage.theme === "dark") localStorage.setItem("theme", "light");
  else localStorage.setItem("theme", "dark");

  document.querySelector("html").setAttribute("data-theme", localStorage.theme);
}

themeToggleButton.addEventListener("click", toggleTheme);
themeToggleSidebarButton.addEventListener("click", toggleTheme);
