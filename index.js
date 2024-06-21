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

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.classList.contains("show")) {
      content.classList.remove("show");
    } else {
      content.classList.add("show");
    }
  });
}
