let dropArea = document.getElementById("dropArea");
let tokenInput = document.getElementById("tokenInput");

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

dropArea.addEventListener("dragenter", highlight, false);
dropArea.addEventListener("dragover", highlight, false);
dropArea.addEventListener("dragleave", unhighlight, false);
dropArea.addEventListener("drop", unhighlight, false);

function highlight(e) {
  dropArea.classList.add("dragging");
}

function unhighlight(e) {
  dropArea.classList.remove("dragging");
}

dropArea.addEventListener("drop", handleDrop, false);

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
  [...files].forEach(uploadFile);
}

function uploadFile(file) {
  let formData = new FormData();
  formData.tokenappend("file", file);
  let token = tokenInput.value;
  formData.append("_token", token);

  if (!token) {
    console.error("Token is required.");
    displayError();
    return;
  }

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        displaySuccess(data.message);
      } else {
        displayError(data.message);
      }
    })    
    .catch((error) => {
      console.error("Error uploading file:", error);
      displayError();
    });
}

function displaySuccess(message) {
  dropArea.classList.add("valid");
  dropArea.innerHTML = `
    <p>File uploaded successfully!</p>
    <a href="${message}" target="_blank">Download URL</a>
  `;
}


function displayError(message) {
  dropArea.classList.add("error");
  dropArea.textContent = `Error: ${message}`;
}
