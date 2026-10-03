const reviews = [
  {name:'Anuva Chatterjee', file:'01-anuva-chatterjee.jpg', stars:4},
  {name:'Shivika Shyamsukha', file:'02-shivika-shyamsukha.jpg', stars:5},
  {name:'Nancy Gill', file:'03-nancy-gill.jpg', stars:5},
  {name:'Kakolee Chakraborthy', file:'04-kakolee-chakraborthy.jpg', stars:5},
  {name:'Debangana Deb Roy', file:'05-debangana-deb-roy.jpg', stars:5},
  {name:'Swati Hans', file:'06-swati-hans.jpg', stars:5},
  {name:'Pankaj Nagar', file:'07-pankaj-nagar.jpg', stars:5},
  {name:'Dr. Simran Shigwan', file:'08-dr-simran-shigwan.jpg', stars:5},
  {name:'Shalina Ahuja', file:'09-shalina-ahuja.jpg', stars:5},
  {name:'Farah Singh', file:'10-farah-singh.jpg', stars:5},
  {name:'Archana Sharma', file:'11-archana-sharma.jpg', stars:5},
  {name:'Khyati Maradia', file:'12-khyati-maradia.jpg', stars:5},
  {name:'Komal Ghayamukte', file:'13-komal-ghayamukte.jpg', stars:5},
  {name:'Meenal Rita', file:'14-meenal-rita.jpg', stars:5},
  {name:'Appsy Jaisinghani', file:'15-appsy-jaisinghani.jpg', stars:5},
  {name:'Namit Chadha', file:'16-namit-chadha.jpg', stars:5},
  {name:'Chandini Mohindra', file:'17-chandini-mohindra.jpg', stars:5},
  {name:'Vineet Arora', file:'18-vineet-arora.jpg', stars:5},
  {name:'Anushri Mehra', file:'19-anushri-mehra.jpg', stars:4},
  {name:'Monique Video', file:'20-monique-video.jpg', stars:5},
  {name:'Joanita Pinto', file:'21-joanita-pinto.jpg', stars:5},
  {name:'Amin Mahesh', file:'22-amin-mahesh.jpg', stars:5},
  {name:'Sreetama Biswas', file:'23-sreetama-biswas.jpg', stars:5},
  {name:'Bhasha', file:'24-bhasha.jpg', stars:5},
  {name:'Sid Khanna', file:'25-sid-khanna.jpg', stars:5}
];

const navWrap = document.querySelector('.nav-wrap');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav a');
navToggle?.addEventListener('click', () => {
  const open = navWrap.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
navLinks.forEach(link => link.addEventListener('click', () => {
  navWrap.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open menu');
}));

document.getElementById('year').textContent = new Date().getFullYear();

const reviewGrid = document.getElementById('reviewGrid');

// Set up reveal handling BEFORE rendering dynamic review cards.
// The previous build initialized the observer afterwards, which caused a
// temporal-dead-zone error in browsers and left every .reveal element hidden.
let observer = null;
if ('IntersectionObserver' in window) {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12, rootMargin:'0px 0px -45px 0px'});
}
function observeReveals(nodes){
  nodes.forEach(node => {
    if (observer) observer.observe(node);
    else node.classList.add('visible');
  });
}

function starText(n){ return '★'.repeat(n) + '☆'.repeat(5-n); }
function renderReviews(){
  if (!reviewGrid) return;
  reviewGrid.innerHTML = reviews.map((review, index) => `
    <figure class="review-card reveal" data-index="${index}" tabindex="0" aria-label="Open review by ${review.name}">
      <img src="images/reviews/${review.file}" alt="Patient review by ${review.name}" loading="lazy" />
      <figcaption class="review-meta"><strong>${review.name}</strong><span class="stars" aria-label="${review.stars} out of 5 stars">${starText(review.stars)}</span></figcaption>
    </figure>
  `).join('');
  observeReveals(reviewGrid.querySelectorAll('.reveal'));
  wireReviewCards();
}

observeReveals(document.querySelectorAll('.reveal'));
renderReviews();

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
let currentReview = 0;
function openLightbox(index){
  currentReview = Number(index) || 0;
  const item = reviews[currentReview];
  if(!item) return;
  lightboxImage.src = `images/reviews/${item.file}`;
  lightboxImage.alt = `Patient review by ${item.name}`;
  lightboxCaption.textContent = `${item.name} · ${item.stars} out of 5 stars`;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
  lightboxImage.src = '';
}
function stepReview(direction){
  currentReview = (currentReview + direction + reviews.length) % reviews.length;
  openLightbox(currentReview);
}
function wireReviewCards(){
  document.querySelectorAll('.review-card').forEach(card => {
    card.addEventListener('click', () => openLightbox(card.dataset.index));
    card.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openLightbox(card.dataset.index);
      }
    });
  });
}
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev')?.addEventListener('click', () => stepReview(-1));
document.querySelector('.lightbox-next')?.addEventListener('click', () => stepReview(1));
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if(!lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') stepReview(-1);
  if(e.key === 'ArrowRight') stepReview(1);
});

const header = document.querySelector('.site-header');
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if(!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0) - 10;
    window.scrollTo({top, behavior:'smooth'});
  });
});
