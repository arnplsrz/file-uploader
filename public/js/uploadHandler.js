const fileInput = document.getElementById("file");
const uploadButton = document.getElementById("uploadButton");

function toggleButton() {
  if (fileInput.files.length > 0) uploadButton.disabled = false;
  else uploadButton.disabled = true;
}

fileInput.addEventListener("change", toggleButton);

toggleButton();
