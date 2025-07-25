// Direct inline script for video modal to ensure it works
document.addEventListener("DOMContentLoaded", function () {
  console.log("Inline script loaded");
  const videoBtn = document.getElementById("videoButton");
  const videoModal = document.getElementById("videoModal");
  const videoClose = document.getElementById("videoClose");
  const videoFrame = document.getElementById("videoFrame");

  if (videoBtn) {
    videoBtn.onclick = function (e) {
      e.preventDefault();
      console.log("Video button clicked (inline)");
      if (videoModal && videoFrame) {
        videoFrame.src =
          "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0";
        videoModal.style.display = "block";
        document.body.style.overflow = "hidden";
      }
    };
  }

  if (videoClose) {
    videoClose.onclick = function () {
      if (videoModal && videoFrame) {
        videoModal.style.display = "none";
        videoFrame.src = "";
        document.body.style.overflow = "auto";
      }
    };
  }

  if (videoModal) {
    videoModal.onclick = function (e) {
      if (e.target === videoModal) {
        videoModal.style.display = "none";
        videoFrame.src = "";
        document.body.style.overflow = "auto";
      }
    };
  }
});
