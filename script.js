// ======= Mostrar/ocultar (mismo botón) =======
function toggle_saludo() {
    const mensaje = document.getElementById('Hola');
    if (!mensaje) return;

    const isHidden = mensaje.hasAttribute('hidden') || mensaje.style.display === 'none' || mensaje.hidden;

    if (isHidden) {
        mensaje.hidden = false;
        mensaje.textContent = 'Hola un gusto mi nombre es keny';
        mensaje.style.display = 'block';
        mensaje.classList.remove('fade-out');
        mensaje.classList.add('fade-in');
        showToast('Información mostrada');
    } else {
        mensaje.hidden = true;
        mensaje.style.display = 'none';
        showToast('Información oculta');
    }
}

function toggle_mensaje_pec() {
    const mensaje = document.getElementById('mensaje-animales');
    if (!mensaje) return;

    const isHidden = mensaje.hasAttribute('hidden') || mensaje.style.display === 'none' || mensaje.hidden;

    if (isHidden) {
        mensaje.hidden = false;
        mensaje.textContent = '🐾Los animales también sienten como los humanos, así que protégelos.';
        mensaje.style.display = 'block';
        mensaje.classList.add('fade-in');
        showToast('Mensaje mostrado');
    } else {
        mensaje.hidden = true;
        mensaje.style.display = 'none';
        showToast('Mensaje oculto');
    }
}

// Compatibilidad con onclick anteriores (por si aún quedan)
function click_saludo() { return toggle_saludo(); }
function ocultar_saludo() {
    const p = document.getElementById('Hola');
    if (p) { p.hidden = true; p.style.display = 'none'; }
    showToast('Información oculta');
}
function mostrar_mensaje() { return toggle_mensaje_pec(); }

// ======= Toast (retroalimentación visual) =======
let toastTimer = null;
function ensureToast() {
    let t = document.getElementById('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
    }
    return t;
}
function showToast(message) {
    const t = ensureToast();
    t.textContent = message;
    t.classList.remove('show');
    void t.offsetWidth;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ======= Dark Mode Functions =======
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    const button = document.getElementById('theme-toggle');
    if (button) button.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';

    // Notifica a otros listeners
    window.dispatchEvent(new Event('darkModeChange'));
}

function loadTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark');
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) themeBtn.textContent = '☀️ Light Mode';
    }
    checkTimeForDark();
    initDynamicButtons();
}

function checkTimeForDark() {
    const hour = new Date().getHours();
    const isNight = hour >= 18 || hour < 6;
    const isDark = document.body.classList.contains('dark');

    if (isNight && !isDark) {
        toggleDarkMode();
    } else if (!isDark && isDark) {
        toggleDarkMode();
    }
}

// Auto-check cada 30 minutos
setInterval(checkTimeForDark, 30 * 60 * 1000);

// ======= Dynamic Buttons Functions =======
function createDynamicButton(text, bgColor, action) {
    const container = document.getElementById('buttons-container');
    if (!container) return;

    const btn = document.createElement('button');
    btn.className = 'dynamic-btn';
    btn.textContent = text;
    btn.style.background = bgColor;
    btn.style.color = getContrastColor(bgColor);
    btn.onclick = action;
    container.appendChild(btn);
    setTimeout(() => btn.classList.add('popped'), 10);
}

function getContrastColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000' : '#fff';
}

function addRandomButton() {
    const labels = ['¡Magia!', 'Explora', '¡Boom!', 'Sorpresa 🎉', 'Cambia Color', 'Mensaje Secreto', '¡Sacude!', 'Nuevo Amigo'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'];
    const randomLabel = labels[Math.floor(Math.random() * labels.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const actions = [
        () => {
            // Cambia el fondo de forma válida (sin !important desde JS)
            document.body.style.background = randomColor;
            showToast('Color cambiado');
        },
        () => showToast('¡Botón dinámico activado! 🪄'),
        () => {
            const btns = document.querySelectorAll('.dynamic-btn');
            btns.forEach(btn => btn.classList.add('shake'));
            setTimeout(() => btns.forEach(btn => btn.classList.remove('shake')), 500);
            showToast('Sacudida');
        },
        () => {
            const container = document.getElementById('buttons-container');
            if (!container) return;
            const newBtn = document.createElement('button');
            newBtn.textContent = 'Mini ' + Date.now();
            newBtn.className = 'dynamic-btn';
            newBtn.style.background = '#' + Math.floor(Math.random() * 16777215).toString(16);
            container.appendChild(newBtn);
            showToast('Nuevo botón añadido');
        }
    ];

    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    createDynamicButton(randomLabel, randomColor, randomAction);
}

function initDynamicButtons() {
    for (let i = 0; i < 4; i++) {
        setTimeout(addRandomButton, i * 200);
    }
}

// ======= Cursor Glow Effect =======
const glow = document.createElement('div');
document.body.appendChild(glow);
glow.style.cssText = `
    position: fixed;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle, rgba(0,240,255,0.4), transparent);
    transform: translate(-50%, -50%);
    z-index: 999;
    transition: background 0.3s ease;
`;

let lastMove = 0;
window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMove < 16) return;
    lastMove = now;
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

window.addEventListener('darkModeChange', () => {
    glow.style.background = document.body.classList.contains('dark')
        ? 'radial-gradient(circle, rgba(255,100,100,0.4), transparent)'
        : 'radial-gradient(circle, rgba(0,240,255,0.4), transparent)';
});


// Nota: evitamos stopPropagation global para no interferir con clicks que cierran modales.


// ======= Acordeón FAQ =======
function initAccordion() {
    const items = document.querySelectorAll('[data-accordion]');
    items.forEach(item => {
        const btn = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        if (!btn || !content) return;

        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';

            // Cierra los demás
            items.forEach(i => {
                const b = i.querySelector('.accordion-header');
                const c = i.querySelector('.accordion-content');
                if (!b || !c || i === item) return;
                b.setAttribute('aria-expanded', 'false');
                b.classList.remove('active');
                c.hidden = true;
            });

            btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            btn.classList.toggle('active', !expanded);
            content.hidden = expanded;

            showToast(expanded ? 'Respuesta cerrada' : 'Respuesta abierta');
        });
    });
}

// ======= Carrusel / Galería =======
let carouselIndex = 0;
let carouselSlides = [];

function initCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    carouselSlides = Array.from(track.querySelectorAll('.slide'));

    const dotsWrap = document.getElementById('carouselDots');
    if (dotsWrap) {
        dotsWrap.innerHTML = '';
        carouselSlides.forEach((_, i) => {
            const d = document.createElement('button');
            d.type = 'button';
            d.className = 'carousel-dot';
            d.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
            d.addEventListener('click', () => setCarousel(i));
            dotsWrap.appendChild(d);
        });
    }

    setCarousel(0);
}

function setCarousel(i) {
    if (!carouselSlides.length) return;
    carouselIndex = (i + carouselSlides.length) % carouselSlides.length;

    carouselSlides.forEach((s, idx) => {
        s.classList.toggle('is-active', idx === carouselIndex);
    });

    const dotsWrap = document.getElementById('carouselDots');
    if (dotsWrap) {
        Array.from(dotsWrap.children).forEach((dot, idx) => {
            dot.classList.toggle('is-active', idx === carouselIndex);
        });
    }
}

function carouselPrev() { setCarousel(carouselIndex - 1); }
function carouselNext() { setCarousel(carouselIndex + 1); }

// ======= Modal video =======
let lastFocusedEl = null;

function openVideoModal() {
    lastFocusedEl = document.activeElement;
    const modal = document.getElementById('videoModal');
    const frame = document.getElementById('videoFrame');
    if (!modal || !frame) return;

    // Placeholder (reemplaza luego por el link real)
    frame.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    showToast('Video abierto');
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const frame = document.getElementById('videoFrame');
    if (!modal || !frame) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    frame.src = 'about:blank';
    document.body.classList.remove('modal-open');

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
    showToast('Video cerrado');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('videoModal');
        if (modal && modal.classList.contains('open')) closeVideoModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeVideoModal();
        });
    }
});

// ======= Back-to-top visible + scroll suave =======
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';
    btn.style.transition = 'opacity 0.2s ease';

    window.addEventListener('scroll', () => {
        const show = window.scrollY > 600;
        btn.style.opacity = show ? '1' : '0';
        btn.style.pointerEvents = show ? 'auto' : 'none';
    });

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ======= Init on DOM load =======
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    initAccordion();
    initCarousel();
    initBackToTop();
});

