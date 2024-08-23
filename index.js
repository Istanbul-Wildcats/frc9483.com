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

document.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.classList.contains("show")) {
      content.classList.remove("show");
    } else {
      content.classList.add("show");
    }
  });
}

function setLanguage(language) {
  document.querySelectorAll('[data-en]').forEach(element => {
    element.textContent = element.getAttribute('data-' + language);
  });
}

function setContent(language) {
  var content = {
    en: `
      <p>
        Our team became <span class="bolden">champion</span> in the competitions 
        held in Turkiye in its <span class="bolden">first year</span> and was entitled 
        to be represented in the market. This year, our world champion team in Houston 
        competed with teams sponsored by big stars such as NASA and Google and became 
        the <span class="bolden">Division champion</span>.<br /><br /> At the same 
        time, they became <span class="bolden">the first and only Turkish team to ride 
        a robot in the World finals</span> called Einstein and became<span class="bolden">
        5th in the world</span>. With the successes we have achieved with the robot, 
        we have risen to the <span class="bolden">10th place in the world in the field 
        of general performance</span> and the <span class="bolden">4th place in the 
        world in the field of autonomy</span> in Statbotics, the most reliable system 
        in which FRC robots are classified according to their performance with the 
        help of artificial sequence intelligence. We continued to rise to higher ranks 
        with our performance in the coming years.<br /><br />We will move ourselves 
        further every year and produce <span class="bolden">more successful</span> 
        robots with the experience we gain. We want to crown our success with the
        <span class="bolden">World Championship</span> in the coming seasons.<br /><br />
        <h2>For this, we need your support.</h2><br />The participation fee for FRC, 
        a global competition, and the cost of robot production are significantly beyond 
        our budget. We are seeking your support to cover a portion of the team expenses. 
        We are confident in our ability to represent our country with excellence, and 
        it would be a great honor to have you alongside us in our successes.
      </p>
    `,
    tr: `
      <p>Takımımız, <span class="bolden">ilk senesinde</span> Türkiye'de düzenlenen 
      yarışmalarda <span class="bolden">şampiyon</span> olmuş ve ülkemizi yurtdışında 
      temsil etmeye hak kazanmıştır. Bu sene Houston'daki Dünya Şampiyonasında 
      takımımız, NASA ve Google gibi büyük şirketlerin sponsor 
      olduğu takımlar ile yarışmış, <span class="bolden">Division şampiyonu</span> 
      olmuştur. <br><br>Aynı zamanda Einstein adı verilen <span class="bolden">dünya 
      finallerinde robot süren ilk Türk takım</span> olup <span class="bolden">dünya 
      5.si</span> olduk. Robot maçlarında gösterdiğimiz başarılar ile FRC robotlarının 
      yapay zeka yardımı ile performanslarına göre sıralandığı en güvenilir sistem olan 
      Statbotics’te, <span class="bolden">genel performans alanında dünya 10.luğuna ve 
      otonom alanında dünya 4.lüğüne yükseldik.</span> Önümüzdeki yıllarda performansımız 
      ile daha üst sıralara yükselmeyi umuyoruz. <br><br>Her sene kendimizi daha da ileri 
      taşıyarak kazandığımız tecrübelerle <span class="bolden">daha başarılı</span> 
      robotlar üreteceğiz. Önümüzdeki sezonlarda da başarılarımızı <span class="bolden">
      dünya şampiyonluğu</span> ile taçlandırmak istiyoruz. <br><br><h2>Bunun için sizin 
      desteğinize ihtiyacımız var. </h2><br>Dünya geneli bir yarışma olan FRC’ye katılım 
      ücreti ve robot üretim maliyeti bizim karşılayabileceğimiz düzeyin oldukça üstünde. 
      Takım masraflarının bir kısmını karşılamanız için sizden destek bekliyoruz. Ülkemizi 
      en iyi şekilde temsil edeceğimize olan güvenimiz tam. Sizi de başarılarımızın 
      yanında görebilmek bizi çok memnun eder.</p>
    `
  };

  document.getElementById('content').innerHTML = content[language] || content.en;
}

document.addEventListener('DOMContentLoaded', () => {
  const userLang = navigator.language || navigator.userLanguage;
  const language = userLang.startsWith('tr') ? 'tr' : 'en';
  setLanguage(language);
  setContent(language);
});
