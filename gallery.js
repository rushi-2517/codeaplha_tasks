// ── IMAGE DATA ──
const images = [
  { id: 1,  title: "Glass Cathedral",  category: "architecture", url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80" },
  { id: 2,  title: "Morning Mist",     category: "nature",       url: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80" },
  { id: 3,  title: "Solitude",         category: "portrait",     url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80" },
  { id: 4,  title: "Concrete Flow",    category: "abstract",     url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80" },
  { id: 5,  title: "Neon Streets",     category: "urban",        url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80" },
  { id: 6,  title: "Spiral Stair",     category: "architecture", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
  { id: 7,  title: "Wild Peaks",       category: "nature",       url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
  { id: 8,  title: "Reverie",          category: "portrait",     url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80" },
  { id: 9,  title: "Chromatic Drift",  category: "abstract",     url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80" },
  { id: 10, title: "Midnight Metro",   category: "urban",        url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80" },
  { id: 11, title: "The Vault",        category: "architecture", url: "https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800&q=80" },
  { id: 12, title: "Ocean at Dawn",    category: "nature",       url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80" },
];

// ── STATE ──
let currentFilter   = 'all';
let filteredImages  = [...images];
let currentIndex    = 0;
let currentImgFilter = 'none';

// ── DOM REFS ──
const galleryEl   = document.getElementById('gallery');
const countEl     = document.getElementById('count');
const emptyState  = document.getElementById('emptyState');
const lightboxEl  = document.getElementById('lightbox');
const lbImg       = document.getElementById('lbImg');
const lbTitle     = document.getElementById('lbTitle');
const lbCounter   = document.getElementById('lbCounter');

// ── RENDER GALLERY ──
function renderGallery() {
  filteredImages = currentFilter === 'all'
    ? [...images]
    : images.filter(img => img.category === currentFilter);

  galleryEl.innerHTML = '';
  countEl.textContent = filteredImages.length;
  emptyState.style.display = filteredImages.length === 0 ? 'block' : 'none';

  filteredImages.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.index = i;
    item.innerHTML = `
      <img src="${img.url}" alt="${img.title}" loading="lazy">
      <div class="item-overlay">
        <div class="item-title">${img.title}</div>
        <div class="item-category">${img.category}</div>
      </div>
      <div class="item-expand">⤢</div>
    `;
    item.addEventListener('click', () => openLightbox(i));
    galleryEl.appendChild(item);
  });
}

// ── CATEGORY FILTER BUTTONS ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderGallery();
  });
});

// ── LIGHTBOX: OPEN / CLOSE / UPDATE ──
function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightboxEl.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxEl.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const img = filteredImages[currentIndex];
  lbImg.src = img.url;
  lbImg.alt = img.title;
  lbImg.className = currentImgFilter === 'none' ? '' : currentImgFilter;
  lbTitle.textContent = img.title;
  lbCounter.textContent =
    `${String(currentIndex + 1).padStart(2, '0')} / ${String(filteredImages.length).padStart(2, '0')}`;
}

// ── LIGHTBOX: NAVIGATION ──
function prevImage() {
  currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
  updateLightbox();
}

function nextImage() {
  currentIndex = (currentIndex + 1) % filteredImages.length;
  updateLightbox();
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbBackdrop').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', prevImage);
document.getElementById('lbNext').addEventListener('click', nextImage);

// ── IMAGE FILTER BUTTONS (inside lightbox) ──
document.querySelectorAll('.lb-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lb-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentImgFilter = btn.dataset.imgfilter;
    lbImg.className = currentImgFilter === 'none' ? '' : currentImgFilter;
  });
});

// ── KEYBOARD NAVIGATION ──
document.addEventListener('keydown', e => {
  if (!lightboxEl.classList.contains('open')) return;
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevImage();
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  nextImage();
  if (e.key === 'Escape') closeLightbox();
});

// ── TOUCH / SWIPE NAVIGATION ──
let touchStartX = 0;

lightboxEl.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

lightboxEl.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 50) {
    dx < 0 ? nextImage() : prevImage();
  }
});

// ── INIT ──
renderGallery();