document.addEventListener("DOMContentLoaded", function () {

  const banners = document.querySelectorAll(".banners img");
  let current = 0;

  if (banners.length > 0) {
    function showBanner() {
      banners.forEach((img, i) =>
        img.style.display = i === current ? "block" : "none"
      );
      current = (current + 1) % banners.length;
    }

    showBanner();
    setInterval(showBanner, 3000);
  }

});
