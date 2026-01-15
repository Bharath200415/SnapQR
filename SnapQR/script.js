const btn = document.querySelector(".gen-btn");
const input = document.querySelector("#url");
const canvas = document.querySelector("#qr-canvas");
const downloadBtn = document.querySelector(".download-btn");
const image = document.querySelector("#qr-img");
const copyBtn = document.querySelector(".copy-btn");
const toast = document.querySelector("#toast");

function downloadFileFromCanvas(canvas, filename) {
  canvas.toBlob(function (blob) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); 
    link.download = filename; 
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link); 
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function copyCanvasToClipboard(canvas) {
  canvas.toBlob(async (blob) => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
      console.log("QR copied to clipboard");
      showToast("QR code copied to clipboard!");

    } catch (err) {
      console.error("Failed to copy:", err);
      showToast("Failed to copy");
    }
  });
}

btn.addEventListener("click", () => {
  const url = input.value;
  if (url === '') {
    alert('Please enter your URL');
  } else {
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`;
    image.src =  `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`;
    
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      copyBtn.style.display = "block";
      downloadBtn.style.display = "flex"; 
      downloadBtn.style.alignItems = "flex-start"; 
    };
  }
});


downloadBtn.addEventListener("click", () => {
  downloadFileFromCanvas(canvas, "qr-code.png");
  console.log("QR Code downloaded");
});

copyBtn.addEventListener("click", () => {
  copyCanvasToClipboard(canvas);
});