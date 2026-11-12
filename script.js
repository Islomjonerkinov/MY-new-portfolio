document.documentElement.classList.add('js');

const projects = {
  eduspace: {
    number: '01',
    title: 'EduSpace',
    intro: 'Talabalar va mentorlarni birlashtiruvchi, o‘qish jarayonini qiziqarli va o‘lchanadigan qiladigan zamonaviy onlayn ta’lim platformasi.',
    stats: [
      { value: '42%', label: 'Yuqori faollik' },
      { value: '18k+', label: 'Faol talaba' },
      { value: '4.9/5', label: 'Kurslar bahosi' }
    ],
    challenge: 'Talabalar darslar, topshiriqlar va o‘z rivojlanishini turli vositalarda kuzatishga majbur bo‘lishardi. Mentorlar esa har bir talabaning jarayonini tez va aniq baholay olmasdi.',
    solution: 'Shaxsiylashtirilgan o‘quv paneli, interaktiv kurslar va progress analitikasini yaratdim. Video, topshiriqlar va mentor feedback tizimini yagona, barcha qurilmalarda qulay ishlaydigan interfeysga birlashtirdim.'
  },
  atelier: {
    number: '02',
    title: 'Atelier Store',
    intro: 'Mahsulot go‘zalligini oldinga chiqaradigan, xarid jarayonini esa imkon qadar oddiy qiladigan premium mebel e-commerce tajribasi.',
    stats: [
      { value: '28%', label: 'Konversiya o‘sishi' },
      { value: '1.2s', label: 'Yuklanish vaqti' },
      { value: '+41%', label: 'Mobil savdo' }
    ],
    challenge: 'Brendning premium qiyofasi eski saytda namoyon bo‘lmas, xaridorlar mahsulot detallarini ko‘rish va xaridni yakunlash jarayonida qiynalar edi. Mobil traﬁk yuqori, konversiya esa past bo‘lgan.',
    solution: 'Katta tipografiya, tabiiy ranglar va silliq animatsiyalar asosida yangi vizual til yaratdim. Mahsulot sahifasi va checkout oqimini soddalashtirdim, responsive rasmlar va optimizatsiya bilan tezlikni oshirdim.'
  },
  flow: {
    number: '03',
    title: 'Flow Workspace',
    intro: 'Kichik va o‘sayotgan jamoalar uchun vazifalarni rejalash, ijroni kuzatish va real vaqtda hamkorlik qilishni soddalashtiruvchi workspace.',
    stats: [
      { value: '42%', label: 'Kamroq qo‘lda ish' },
      { value: '12k+', label: 'Faol foydalanuvchi' },
      { value: '99.9%', label: 'Barqarorlik' }
    ],
    challenge: 'Jamoalar vazifalar, fayllar va muhokama uchun alohida vositalardan foydalanar, jarayonning umumiy holatini ko‘rish qiyin edi. Real vaqt yangilanishlari ko‘p ma’lumotda sekinlashardi.',
    solution: 'Modulli arxitektura, optimistic UI va WebSocket asosida tezkor hamkorlik tizimini qurdim. Klaviatura boshqaruvi va accessibility talablarini qo‘shib, drag-and-drop jarayonini barcha qurilmalarga mosladim.'
  }
};

const header = document.querySelector('[data-header]');
const progress = document.querySelector('.scroll-progress');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle('is-scrolled', scrollTop > 24);
  progress.style.transform = `scaleX(${scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0})`;
}

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      updateScrollUI();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });
updateScrollUI();

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Menyuni yopish' : 'Menyuni ochish');
  mobileMenu.hidden = !open;
  header.classList.toggle('is-menu-open', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenu(false));
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720) setMenu(false);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('is-visible'));
}

const sections = document.querySelectorAll('main section[id]');
const navigationLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -60%', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
}

const dialog = document.querySelector('.project-dialog');
const dialogTitle = dialog.querySelector('#dialog-title');
const dialogNumber = dialog.querySelector('[data-dialog-number]');
const dialogIntro = dialog.querySelector('[data-dialog-intro]');
const dialogStats = dialog.querySelector('[data-dialog-stats]');
const dialogChallenge = dialog.querySelector('[data-dialog-challenge]');
const dialogSolution = dialog.querySelector('[data-dialog-solution]');

function openProject(projectId) {
  const project = projects[projectId];
  if (!project) return;
  dialogNumber.textContent = project.number;
  dialogTitle.textContent = project.title;
  dialogIntro.textContent = project.intro;
  dialogChallenge.textContent = project.challenge;
  dialogSolution.textContent = project.solution;
  dialogStats.replaceChildren(...project.stats.map(stat => {
    const item = document.createElement('div');
    item.className = 'dialog-stat';
    const value = document.createElement('strong');
    const label = document.createElement('span');
    value.textContent = stat.value;
    label.textContent = stat.label;
    item.append(value, label);
    return item;
  }));
  dialog.showModal();
}

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => openProject(button.dataset.project));
});

dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.querySelector('[data-dialog-contact]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
  if (!inside) dialog.close();
});

const toast = document.querySelector('.toast');
let toastTimer;
function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Copy failed');
}

document.querySelector('[data-copy-email]').addEventListener('click', async event => {
  try {
    await copyText(event.currentTarget.dataset.copyEmail);
    showToast('Email nusxalandi — ko‘rishguncha!');
  } catch {
    showToast('Nusxalash imkoni bo‘lmadi. Emailni qo‘lda tanlang.');
  }
});

const timeElement = document.querySelector('[data-local-time]');
function updateLocalTime() {
  const time = new Intl.DateTimeFormat('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
  timeElement.textContent = `GMT+5 · ${time}`;
}
updateLocalTime();
window.setInterval(updateLocalTime, 60000);

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const tiltElement = document.querySelector('[data-tilt]');
if (window.matchMedia('(pointer: fine)').matches && !reducedMotion.matches) {
  tiltElement.addEventListener('pointermove', event => {
    const bounds = tiltElement.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltElement.style.transform = `perspective(1000px) rotateX(${-y * 3}deg) rotateY(${x * 4}deg)`;
  });
  tiltElement.addEventListener('pointerleave', () => {
    tiltElement.style.transform = '';
  });
}
