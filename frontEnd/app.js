let dropArea = document.getElementById("dropArea");

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
  formData.append("file", file);

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displaySuccess();
        dropArea.textContent = "";
      } else {
        displayError();
      }
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
      displayError();
    });
}

function displaySuccess() {
  dropArea.classList.add("valid");
  dropArea.textContent = "File uploaded successfully!";
}

function displayError() {
  dropArea.classList.add("error");
  dropArea.textContent = "Error uploading file!";
}
