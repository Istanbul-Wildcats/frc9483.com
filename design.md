# FRC 9483 — Tasarım Sistemi (design.md)

Kaynak: claude.ai'daki **"FRC 9483 Design System"** (`https://claude.ai/artifact/5SGLWQ4qGibPgeEYf4oW8p`, sürüm `1795260773-4f65`), takımın `presentation (Copy).fig` sunumundan çıkarılmış. Bu dosya o sistemi, sitenin gerçek uygulamasıyla (`src/app/(frontend)/globals.css`, `src/components/**`) eşleştirir. Çakışma olursa **kod gerçeği** kazanır; fark "Sistem ↔ Site farkları" bölümünde.

> Tasarım sistemi sunum (1920×1080 slayt) bağlamında ölçüldü. Site aynı kimliği web'e uyarlıyor: siyah zemin, soğuk beyaz metin, Anta (display) + Inter (gövde), sıfır köşe, hap şeklinde düğme.

---

## 1. İlkeler

1. **Siyah zemin, tek mesaj.** Her bölüm bir başlık + en fazla bir gövde ya da bir istatistik taşır.
2. **Köşesiz görsel.** Fotoğraf ve tam kare yüzeyler `radius 0`. Yuvarlak köşe yalnızca düğme/etiket (`pill`) ve (sunumda) kartlarda.
3. **Büyük, büyük harfli başlık; sakin gövde.** Başlıklar `uppercase`, geniş `clamp()` ölçekli; gövde `soft` gri.
4. **Renk değerini elle yazma.** Token adını kullan (`text-foreground`, `border-line`…). Tailwind `@theme` token'ları tek kaynak.
5. **Kırmızı nadirdir.** `#ff0000` yalnızca küçük Türk bayrağı vurgusu; UI/hata/primary rengi değil.
6. **Yazı fotoğrafın üstüne konmaz.** Metin gerekiyorsa koyu panelde (`panel` / `deep`) durur.

---

## 2. Renk

### 2.1 Sitede tanımlı token'lar (`globals.css` `@theme`)

| Tailwind token | Değer | Karşılığı (sistem) | Kullanım |
| --- | --- | --- | --- |
| `background` | `#000000` | `black` | Sayfa zemini |
| `foreground` | `#ebeff9` | `tint-blue` | Ana metin (siyah üstünde) |
| `white` | `#ffffff` | `white` | Başlık, vurgu, hover, düğme dolgusu |
| `soft` | `#cbcbcb` | `neutral-200` | Gövde/prose metni, nav bağlantıları |
| `muted` | `#acafb4` | `neutral-300` | İkincil metin, `.mono` etiketler |
| `line` | `#2a2c30` | `neutral-800` | İnce ayırıcı, kart kenarlığı |
| `line-strong` | `#757981` | `neutral-400` | Link alt çizgisi, blockquote çizgisi |
| `panel` | `#111111` | (siteye özgü) | Medya/kod/kart zemini |
| `deep` | `#050505` | (siteye özgü) | Lightbox zemini |

Odak halkası: `2px solid #ebeff9`, `outline-offset: 4px` (`:focus-visible`, global).

### 2.2 Sistemde olup sitede henüz kullanılmayanlar

`neutral-50 #f5f5f6`, `neutral-100 #ececec` (açık yüzey), `neutral-500 #636363`, `neutral-600 #424348`, `neutral-700 #3a3a3f` (koyu panel), `slate-200/500/900`, `zinc-200` (grafik/UI yardımcıları), `accent-red #ff0000`.

### 2.3 Kurallar

- Siyah zeminde metin yalnızca `white`, `foreground`, `soft`, `muted`. Koyu `neutral-*` tonları siyah üstünde metin olmaz.
- Kontrast: `muted` (#acafb4) siyah üstünde ≈ 9:1; `line-strong` (#757981) ≈ 4.6:1 → yalnızca çizgi/dekor ve büyük metin için, küçük gövde metni için değil.
- Açık tema yok; sistem değerleri yalnızca koyu bağlamda ölçüldü. Açık tema gerekirse ayrıca türetilmeli.
- Gölge token'ı yok. Tek istisna: lightbox `shadow-[0_40px_120px_rgba(0,0,0,0.8)]`.

---

## 3. Tipografi

### 3.1 Yazı tipleri

| Rol | Font | Durum |
| --- | --- | --- |
| Display + gövde (web) | **Anta** (Regular 400) | Tasarım sistemindeki `display`/`sans` ailesi; sitede her yerde tek font (`--font-sans` = `--font-display`). CMS'ten seçilmez |
| Display (sunum) | A4 SPEED Bold | Dosyası yok; web'de Anta geçici stand-in |
| Numeral (sunum) | Batteny Personal Use | Kişisel lisans; **web'de kullanma** |
| Caption (sunum) | Gilroy Medium | Ticari lisans; web'de **Inter** görsüyor |

Anta tek ağırlıklı (400): başlıklarda kalın görünüm için `font-bold` kullanma (sentetik kalın çıkar) — vurgu boyut ve beyaz renkle yapılır. Inter gerçek ağırlıklar sunar; gövdede hiyerarşi gerekirse ağırlıkla kurulur. `line-height` sunumda `1`; sitede başlıklarda `0.92–1.1`, gövdede `leading-relaxed`.

### 3.2 Sitedeki sınıflar

| Sınıf | Tanım | Nerede |
| --- | --- | --- |
| `.h1` | `clamp(38px, 9vw, 152px)`, `uppercase`, `leading-[0.92]`, `tracking-[0.01em]`, `overflow-wrap:anywhere`, `--font-display` (Anta) | `PageHeading` (sayfa başlığı) |
| `.h2` | `clamp(26px, 2.8vw, 40px)`, `leading-[1.1]`, `--font-display` (Anta) | Bölüm başlığı, sponsor adı wordmark'ı |
| `.mono` | `text-sm leading-snug text-muted` (Barlow) | Etiket, alt bilgi, tarih (aslında monospace değil; ad tarihsel) |
| `.prose-site` | `text-lg leading-relaxed text-soft`, `max-w-[820px]` (Barlow) | Payload zengin metni (blog, özel sayfalar) |
| Footer başlığı | `clamp(40px, 10vw, 160px)`, `leading-[0.9]`, `tracking-[-0.01em]`, `--font-display` (Anta) | `SiteFooter` |
| Nav bağlantısı | `text-sm tracking-[0.04em] text-soft` (Barlow) | `SiteNav` |

`.prose-site` başlıkları: `h1 clamp(32px,4vw,56px)`, `h2 clamp(26px,2.8vw,40px)`, `h3 text-2xl`, `h4 text-xl`; hepsi `text-white leading-tight` ve `--font-display` (Anta).

### 3.3 Sistemin sunum ölçeği (referans)

| Stil | px | Not |
| --- | --- | --- |
| display-xl / l / m / s / xs | 269 / 160 / 120 / 60 / 33 | Tek kelime/slogan; büyük harf (A4 SPEED) |
| headline | 111 | |
| title-xl / l / m / s | 80 / 70 / 60 / 36 | `title-l` en yaygın; `title-s` hashtag ve kart başlığı |
| body-l / body | 32 / 28 | |
| numeral-l / m | 118 / 85 | İstatistik rakamı |
| caption | 24 | Kaynak notu, sponsor adı |

Web'de bu ölçek `clamp()` ile akışkan karşılanır (`.h1` ≈ display-l, `.h2` ≈ title-s/m).

---

## 4. Boşluk, yerleşim, köşe

**Sistem ölçeği (px):** 4, 8, 10, 16, 20, 35, 40, 60, 72, 80. En yaygın: `35` blok arası, `10` liste, `80` hero↔içerik, `72` içerik kenar boşluğu.

**Sitede:**

| Yapı | Değer |
| --- | --- |
| `.wrap` | `max-w-[1440px]`, `mx-auto`, `px-5` (mobil) / `px-16` (md+) |
| `.sec` | `py-[72px]` / `md:py-[120px]` |
| `.rule` | `border-t border-line` (bölüm ayırıcı) |
| `.row` | `grid items-center gap-1.5 md:gap-6 border-t border-line py-[26px]`; `a.row` hover'da `text-white` |
| `PageHeading` | `pt-24 pb-14`, `.wrap` içinde |

**Köşe:** `radius-none 0` (fotoğraf, panel, lightbox), `radius-sm 16`, `radius-md 20` (sunum kartları), `rounded-pill 500px` (düğme, sayaç, lightbox kontrolleri). Siteye `--radius-pill: 500px` token'ı tanımlı.

---

## 5. Bileşenler

### Düğme — `src/components/ui/button.tsx` (`cva`)
- Ortak: `rounded-pill border`, `transition [color, background-color, transform] 200ms`, hover `-translate-y-0.5`, active `scale-[0.97]`, `gap-3`.
- `variant=default`: beyaz dolgu, siyah metin → hover şeffaf zemin, beyaz metin.
- `variant=ghost`: `border-white/70 bg-white/5 text-white` → hover beyaz dolgu, siyah metin.
- `size=default`: `min-h-14 px-9 text-lg`; `size=sm`: `min-h-11 px-6 text-base` (min 44px dokunma hedefi).
- Linke düğme görünümü ver: `buttonVariants({ size: 'sm' })`.

### Sayfa başlığı — `PageHeading`
`.h1` + `wrap pt-24 pb-14`, `center` prop'u ile ortalanır. `Mono` yardımcı bileşeni `.mono` span'ı.

### Navigasyon — `SiteNav`
`wrap flex justify-between py-4`, logo `h-12`, bağlantılar `min-h-11 text-sm tracking-[0.04em] text-soft hover:text-white`; `xl` altında `MobileMenu` (`menu-in` animasyonu). "Katıl" düğmesi `size=sm`. Dil seçici `LocaleSwitch`.

### Footer — `SiteFooter`
`.rule pt-20 pb-10`, dev başlık (`clamp 40–160px`), iki sütun bağlantı listesi (`gap-3.5`, `text-soft hover:text-white`), dış bağlantılara `sr-only` "yeni sekme" notu.

### Sponsor kutusu — `SponsorTile`
`h-[120px] border border-line p-5`, logo `Pic contain` (beyaz-şeffaf PNG), logo yoksa `.h2` boyutunda wordmark; yasal ad `sr-only`. Sunum kuralı: tüm logolar eşit yükseklik, aralarda `space-40`, orijinal oran, kırpma/renk değiştirme yok.

### Görsel — `Pic` + `.zoom`
`next/image` `fill`, `quality={75}`, `sizes` zorunlu. `.zoom`: `relative overflow-hidden bg-panel`; yalnızca etkileşimli medyada (`a.zoom`, `.cursor-zoom-in`) hover/focus'ta `scale 1.04` (600ms). Durağan görsel kıpırdamaz.

### Lightbox — `dialog.lightbox`
Yerel `<dialog>`; `w-[min(94vw,1180px)] max-h-[92dvh] border-white/15 bg-deep`, arka plan `rgb(0 0 0 / .72)` + `blur(10px)`. Kontroller `.lb-btn` (44px, pill, `bg-black/55`, backdrop-blur, hover beyaz) ve `.lb-count`.

### Sunum bileşenleri (sistemden; sitede henüz birebir yok)
- **StatTile:** rakam `numeral-m`/`title-l`, etiket `caption`/`body`; zemin `neutral-700` (koyu) veya `neutral-50` (açık), `radius-md`, iç boşluk `space-16`, rakam–etiket `space-8`. Sonek ("+", "#") rakamla aynı boyutta.
- **Hashtag:** `title-s`, `tint-blue`/`neutral-300`, önünde `#`, sonunda nokta yok, küçük harf, Türkçe karakterli, aralarında `space-10`.
- **SponsorStrip:** yukarıdaki sponsor kuralları.
- **Slide:** 1920×1080, `black` zemin, başlık `title-xl`/`headline` beyaz, gövde `body` `tint-blue`, bloklar `space-35`, kenar `space-72`; kapak/kapanış `display-xl`/`display-l` ile tek kelime/slogan.

---

## 6. Hareket

| Ad | Tanım | Kullanım |
| --- | --- | --- |
| `animate-rise` | `translateY(112%) → 0`, 0.6s | Satır/başlık maskeli yükseliş |
| `animate-fade` | `opacity 0→1` + `translateY(16px) → 0`, 0.5s | Blok girişi |
| `animate-slow` | `scale(1.12) → 1`, 1.6s | Hero görsel yerleşimi |
| `menu-in` | `opacity` + `translateY(-8px)`, 0.2s | Mobil menü |
| `lb-in` | `opacity` + `translateY(8px) scale(.985)`, 0.2s | Lightbox |
| Düğme | `translate-y -0.5` hover, `scale .97` active, 200ms | |

Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.

**Reduced motion** (`prefers-reduced-motion: reduce`): animasyon süresi `0.01ms`, `scroll-behavior:auto`; `transition-property` yalnızca renk/opaklık/gölge özellikleriyle sınırlanır — yani hareket anında, renk geri bildirimi normal süreyle kalır. Yeni hareket eklerken bu davranışı bozma (`transform` tween'i otomatik devre dışı kalır).

---

## 7. Ses ve içerik

- İki dilli (tr/en, `src/i18n`). Başlıklar İngilizce ağırlıklı kısa cümle ("One Team. Many hands, one vision."), açıklama ve hashtag Türkçe.
- Başarı cümleleri kısa ve rakamlı: "2 Regional Winner", "1 Division Winner", "4th in Autonomous", "10th in Overall". Rakam büyük ve tek başına durur ("3500+", "56", "137"); açıklaması kısa etiket.
- Takım adı **"TEAM 9483"** veya **"9483"**, robot adı **"SNAPFIRE"** (büyük harf). Sponsor adı tam/resmi ("AXA SİGORTA", "Karaca", "ART CNC").
- Yayınlanmamış/onaylanmamış sonuç ya da sponsor bilgisi girilmez.
- Hashtag örnekleri: #mühendislik #strateji #liderlik #takım #hedef #stem #inovasyon #gelişim #etki #yazılım #tasarım #teknoloji.

---

## 8. Varlıklar (tasarım sisteminin asset deposunda)

- **Illustrations:** `illustration-one-team.png` (yalnızca siyah zeminde), `image-snapfire-render.png` (şeffaf, açık zeminde de olur).
- **Photos:** `photo-robot-9483-black.jpg`, `photo-team-milstein-stage.jpg`, `photo-team-blue-mat.jpg`, `photo-robot-field.jpg`, `photo-robot-lift-team.jpg`, `photo-pit-work.jpg`, `photo-sponsor-wall.jpg`, `photo-jet-carrier.jpg`, `mockup-tshirt-black.jpg`; şeffaf kesitler `cutout-team-flag.png`, `cutout-robot-9483.png`; logo `9483team-logo-traced.svg`.
- Varlıklar kopyalanır, yeniden çizilmez/yaklaşık yapılmaz. Sitede medya Payload + Vercel Blob CDN'den gelir (bkz. `Pic`), bu depodaki `public/` yalnızca `first-icon.svg` içerir.

---

## 9. Erişilebilirlik kuralları (koddan)

- Odak halkası her etkileşimli öğede görünür (`:focus-visible`, `#ebeff9`).
- Dokunma hedefi ≥ 44px (`min-h-11`, `size-11`).
- Dış bağlantılarda `sr-only` "yeni sekme" metni; sponsor logosunda yasal ad `sr-only`.
- Hareket `prefers-reduced-motion`'a saygılı (bkz. §6).
- Nav `aria-label="Main"`; logo bağlantısında `aria-label`.

---

## 10. Sistem ↔ Site farkları ve açık işler

1. **Fontlar:** Sistem 4 aile tanımlıyor (A4 SPEED, Anta, Batteny, Gilroy); sitede display ve gövde Anta'dır (CMS'ten seçilmez). A4 SPEED dosyası yok; Batteny lisans nedeniyle web için uygun değil; Gilroy'un rolünü de Anta üstleniyor. Display görünümü şimdilik Anta + `uppercase` + büyük `clamp()` ile sağlanıyor.
2. **Token'lar:** `panel #111111` ve `deep #050505` sistemde yok (siteye özgü); `neutral-50…700`, `accent-red`, `slate-*`, `zinc-200` sitede tanımlı değil. Gerekince `@theme`'e aynı adlarla ekle.
3. **Köşe/boşluk ölçeği** sitede token olarak değil, Tailwind aralığı ve literal `px` ile kullanılıyor (`py-[72px]`, `py-[26px]`).
4. **Açık tema** yok; **gölge token'ı** yok.
5. **Sponsor logoları** sistemde dosya olarak yok (`SponsorStrip` README'sinde sözü edilen `Logos` grubu indekste bulunmuyor); sitede Payload'dan geliyor.
6. **Sistem hâlâ sunum kökenli:** site değerleri (`clamp` başlıklar, `.row`, `.wrap`, lightbox, düğme) tasarım sistemine geri yazılmamış. Sistemi güncellerken bu dosyanın §2–§6'sı kaynak alınabilir.
