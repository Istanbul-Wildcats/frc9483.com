function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
}

const images = document.querySelectorAll(".no-drag");

images.forEach((img) => {
  img.addEventListener("contextmenu", (event) => event.preventDefault());
  img.addEventListener("mousedown", (event) => event.preventDefault());
});

document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
      event.preventDefault();
  }
}, { passive: false });