const theme =
  localStorage.theme === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
    ? "dark"
    : "light";

document.querySelector("html").setAttribute("data-theme", theme);
localStorage.setItem("theme", theme);
