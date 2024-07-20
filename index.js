const hamMenu = document.querySelector(".ham-menu");
const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

document.addEventListener("click", (event) => {
  if (!offScreenMenu.contains(event.target) && !hamMenu.contains(event.target)) {
    hamMenu.classList.remove("active");
    offScreenMenu.classList.remove("active");
  }
});

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

const translations = {
  en: {
      home: "HOME",
      about: "ABOUT",
      robots: "ROBOTS",
      supportUs: "SUPPORT US",
      teamTitle: "TEAM 9483 ISTANBUL WILDCATS",
      teamDescription: "Istanbul Wildcats is a robotics team consisting of students from all over the world and mentors studying at distinguished universities in Turkiye to share their interest and focus on robotics.",
      more: "MORE",
      footerBrand: "WILDCATS",
      footerText: "To get to know our team better, you can follow us on social media and review our standings and matches in the FRC. ©Team 9483 Istanbul Wildcats 2024",
      pagesTitle: "Pages",
      contactTitle: "Contact"
  },
  tr: {
      home: "ANASAYFA",
      about: "HAKKIMIZDA",
      robots: "ROBOTLAR",
      supportUs: "BİZE DESTEK OL",
      teamTitle: "TEAM 9483 İSTANBUL WILDCATS",
      teamDescription: "İstanbul Wildcats, dünya genelinden öğrenciler ve Türkiye'deki seçkin üniversitelerde öğrenim gören mentörlerden oluşan bir robotik takımıdır. İlgi alanlarını ve robotik konusundaki odaklarını paylaşmak için bir araya gelirler.",
      more: "DAHA FAZLA",
      footerBrand: "WILDCATS",
      footerText: "Takımımızı daha yakından tanımak için sosyal medya hesaplarımızı takip edebilir ve FRC'deki derecelerimizi ve maçlarımızı inceleyebilirsiniz. ©Team 9483 İstanbul Wildcats 2024",
      pagesTitle: "Sayfalar",
      contactTitle: "İletişim"
  }
};

function setLanguage(language) {
  document.querySelectorAll('[data-translate-key]').forEach(element => {
      const key = element.getAttribute('data-translate-key');
      element.textContent = translations[language][key];
  });
}

// URL'den dil bilgisi al
const path = window.location.pathname;
const language = path.startsWith('/tr/') ? 'tr' : 'en';

setLanguage(language);