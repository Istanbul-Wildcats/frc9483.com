function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
}

const images = document.querySelectorAll(".no-drag");

images.forEach((img) => {
  img.addEventListener("contextmenu", (event) => event.preventDefault());
  img.addEventListener("mousedown", (event) => event.preventDefault());
});
