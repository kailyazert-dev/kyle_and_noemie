const textesPromise = fetch('index.json').then(res => res.json());

document.getElementById('btn-oui').addEventListener('click', async () => {
    gameOver = true;
    btnNon.style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    const page2 = document.getElementById('page-2');
    page2.style.display = 'flex';
    requestAnimationFrame(() => requestAnimationFrame(() => page2.style.opacity = '1'));

    const textes = await textesPromise;
    const texte1 = textes.texte1;
    const el = document.getElementById('typed');
    let i = 0;
    const interval = setInterval(() => {
        el.textContent += texte1[i];
        i++;
        if (i >= texte1.length) {
            clearInterval(interval);
            document.getElementById('curseur').style.display = 'none';
            const btnSuivant = document.getElementById('btn-suivant');
            btnSuivant.style.display = 'block';
            requestAnimationFrame(() => requestAnimationFrame(() => btnSuivant.style.opacity = '1'));
            const think_card1 = textes.think_card1;
            const think_card2 = textes.think_card2;
            const think_card3 = textes.think_card3;

            let cardsShown = false;
            let currentInterval = null;
            let petalsStarted = false;
            let particlesStarted = false;
            let charsStarted = false;

            function startCharacters() {
                const cv = document.getElementById('c-chars');
                cv.style.display = 'block';
                cv.width = cv.offsetWidth || window.innerWidth;
                cv.height = 70;
                const cx = cv.getContext('2d');
                const S = window.innerWidth < 600 ? 3 : 4;
                const P = [null,'#f5c5a3','#2c1a0e','#5c3d1e','#c87050','#5c8ab4','#3d2d5c','#e8a0b4','#f0ddd0','#1a1209'];

                const BOY = [
                    [[0,3,3,3,3,0,0,0],[0,3,1,1,1,3,0,0],[0,0,1,2,1,1,0,0],[0,0,1,1,1,1,0,0],[0,0,0,1,0,0,0,0],[0,5,5,5,5,5,5,5],[0,5,5,5,5,0,0,0],[0,0,6,6,0,6,0,0],[0,6,6,0,0,6,0,0],[9,9,0,0,0,6,0,0],[9,0,0,0,0,9,9,0]],
                    [[0,3,3,3,3,0,0,0],[0,3,1,1,1,3,0,0],[0,0,1,2,1,1,0,0],[0,0,1,1,1,1,0,0],[0,0,0,1,0,0,0,0],[0,5,5,5,5,5,5,5],[0,5,5,5,5,0,0,0],[0,0,6,6,0,6,0,0],[0,0,6,0,0,6,6,0],[0,0,6,0,0,0,9,9],[0,9,9,0,0,0,9,0]],
                ];
                const GIRL = [
                    [[0,0,4,4,4,4,0,0],[0,0,4,1,1,4,4,0],[0,0,1,1,2,1,0,0],[0,0,1,1,1,1,0,0],[0,0,0,0,1,0,0,0],[7,7,7,7,7,7,7,0],[0,0,0,7,7,7,7,0],[0,7,7,7,7,7,7,0],[0,0,8,8,0,8,0,0],[0,9,9,0,0,8,0,0],[0,9,0,0,0,9,9,0]],
                    [[0,0,4,4,4,4,0,0],[0,0,4,1,1,4,4,0],[0,0,1,1,2,1,0,0],[0,0,1,1,1,1,0,0],[0,0,0,0,1,0,0,0],[7,7,7,7,7,7,7,0],[0,0,0,7,7,7,7,0],[0,7,7,7,7,7,7,0],[0,0,8,0,0,8,8,0],[0,0,8,0,0,0,9,9],[0,9,9,0,0,0,9,0]],
                ];
                const HEART = [
                    [0,1,1,0,1,1,0],
                    [1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1],
                    [0,1,1,1,1,1,0],
                    [0,0,1,1,1,0,0],
                    [0,0,0,1,0,0,0],
                ];

                function drawChar(frames, fi, x, y) {
                    frames[fi].forEach((row, ry) => row.forEach((c, rx) => {
                        if (!c) return;
                        cx.fillStyle = P[c]; cx.fillRect(x + rx*S, y + ry*S, S, S);
                    }));
                }
                function drawHeart(x, y) {
                    HEART.forEach((row, ry) => row.forEach((p, rx) => {
                        if (!p) return;
                        cx.fillStyle = '#e8305a';
                        cx.fillRect(x + rx*S, y + ry*S, S, S);
                    }));
                }

                const CW = 8*S, CH = 11*S, baseY = cv.height - CH - 2;
                let bx = -CW*3, frame = 0, ft = 0, bob = 0;

                (function loop() {
                    cx.clearRect(0, 0, cv.width, cv.height);
                    bx += 1;
                    if (bx > cv.width + CW) bx = -CW * 3;
                    if (++ft % 15 === 0) frame = (frame+1) % 2;
                    bob += 0.06;
                    const gx = bx + CW;
                    drawChar(BOY, frame, bx, baseY);
                    drawChar(GIRL, frame, gx, baseY);
                    const heartX = bx + CW - 3*S + Math.round(Math.sin(bob) * 0) ;
                    const heartY = baseY - 8*S + Math.round(Math.sin(bob) * S);
                    drawHeart(heartX, heartY);
                    requestAnimationFrame(loop);
                })();
            }

            function startPetals() {
                const cv = document.getElementById('c-petals');
                cv.width = window.innerWidth; cv.height = window.innerHeight;
                cv.style.display = 'block';
                const cx = cv.getContext('2d');
                const cols = ['#e8a0b4','#f4c2d0','#f9d0dd','#e07090','#fce4ec'];
                const petals = Array.from({length: 40}, () => ({
                    x: Math.random() * cv.width,
                    y: Math.random() * -cv.height,
                    size: Math.random() * 10 + 6,
                    vy: Math.random() * 1.2 + 0.6,
                    vx: (Math.random() - 0.5) * 0.8,
                    angle: Math.random() * Math.PI * 2,
                    spin: (Math.random() - 0.5) * 0.04,
                    sway: Math.random() * Math.PI * 2,
                    swaySpeed: Math.random() * 0.02 + 0.01,
                    swayAmp: Math.random() * 1.2 + 0.4,
                    c: cols[Math.floor(Math.random() * cols.length)],
                    a: Math.random() * 0.4 + 0.6,
                }));
                function drawPetal(x, y, size, angle, color, alpha) {
                    cx.save();
                    cx.globalAlpha = alpha;
                    cx.translate(x, y);
                    cx.rotate(angle);
                    cx.fillStyle = color;
                    cx.beginPath();
                    cx.moveTo(0, 0);
                    cx.bezierCurveTo(size * 0.6, -size * 0.4, size * 1.1, size * 0.3, size * 0.5, size * 0.8);
                    cx.bezierCurveTo(size * 0.1, size * 1.1, -size * 0.3, size * 0.6, 0, 0);
                    cx.fill();
                    cx.restore();
                }
                (function loop() {
                    cx.clearRect(0, 0, cv.width, cv.height);
                    petals.forEach(p => {
                        p.sway += p.swaySpeed;
                        p.x += p.vx + Math.sin(p.sway) * p.swayAmp;
                        p.y += p.vy;
                        p.angle += p.spin;
                        if (p.y > cv.height + 20) { p.y = -20; p.x = Math.random() * cv.width; }
                        drawPetal(p.x, p.y, p.size, p.angle, p.c, p.a);
                    });
                    requestAnimationFrame(loop);
                })();
            }

            function startParticles() {
                const cv = document.getElementById('c-particles');
                cv.width = window.innerWidth; cv.height = window.innerHeight;
                cv.style.display = 'block';
                const cx = cv.getContext('2d');
                const cols = ['#e8a0b4','#f4c2d0','#ffd080','#fff0e0','#ffcce0'];
                const ps = Array.from({length: 70}, () => ({
                    x:  Math.random() * cv.width, y: Math.random() * cv.height,
                    r:  Math.random() * 2 + 0.5,
                    vy: -(Math.random() * 0.6 + 0.2),
                    vx: (Math.random() - 0.5) * 0.2,
                    a:  Math.random() * 0.6 + 0.2,
                    ph: Math.random() * Math.PI * 2,
                    sp: Math.random() * 0.03 + 0.01,
                    c:  cols[Math.floor(Math.random() * cols.length)]
                }));
                (function loop() {
                    cx.clearRect(0, 0, cv.width, cv.height);
                    ps.forEach(p => {
                        p.x += p.vx; p.y += p.vy; p.ph += p.sp;
                        if (p.y < -5) { p.y = cv.height + 5; p.x = Math.random() * cv.width; }
                        const a = p.a * (0.4 + 0.6 * Math.abs(Math.sin(p.ph)));
                        cx.save();
                        cx.globalAlpha = a;
                        cx.shadowBlur = p.r * 6; cx.shadowColor = p.c; cx.fillStyle = p.c;
                        cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2); cx.fill();
                        cx.strokeStyle = p.c; cx.lineWidth = 0.5;
                        const l = p.r * 3;
                        cx.beginPath();
                        cx.moveTo(p.x-l, p.y); cx.lineTo(p.x+l, p.y);
                        cx.moveTo(p.x, p.y-l); cx.lineTo(p.x, p.y+l);
                        cx.stroke(); cx.restore();
                    });
                    requestAnimationFrame(loop);
                })();
            }

            function playThinkCard(text, cardIndex) {
                if (currentInterval) clearInterval(currentInterval);
                document.querySelectorAll('#page-3 .card').forEach(c => c.classList.remove('active'));
                if (cardIndex !== undefined) document.querySelectorAll('#page-3 .card')[cardIndex].classList.add('active');
                const el2 = document.getElementById('typed2');
                const curseur2 = document.getElementById('curseur2');
                el2.innerHTML = '';
                curseur2.style.display = 'inline-block';
                let j = 0;
                currentInterval = setInterval(() => {
                    if (text[j] === '\n') {
                        el2.innerHTML += '<br>';
                    } else {
                        el2.innerHTML += text[j];
                    }
                    j++;
                    if (j >= text.length) {
                        clearInterval(currentInterval);
                        curseur2.style.display = 'none';
                        if (!cardsShown) {
                            cardsShown = true;
                            document.querySelectorAll('#page-3 .card').forEach((card, idx) => {
                                setTimeout(() => card.classList.add('visible'), idx * 200);
                            });
                        }
                        if (cardIndex === 0 && !petalsStarted) {
                            petalsStarted = true;
                            startPetals();
                        }
                        if (cardIndex === 1 && !particlesStarted) {
                            particlesStarted = true;
                            startParticles();
                        }
                        if (cardIndex === 2 && !charsStarted) {
                            charsStarted = true;
                            startCharacters();
                            const btns = document.getElementById('btns-final');
                            btns.style.display = 'flex';
                            requestAnimationFrame(() => requestAnimationFrame(() => btns.style.opacity = '1'));
                        }
                    }
                }, 40);
            }

            const cards3 = document.querySelectorAll('#page-3 .card');
            cards3[0].addEventListener('click', () => { if (!cards3[0].classList.contains('active')) playThinkCard(think_card1, 0); });
            cards3[1].addEventListener('click', () => { if (!cards3[1].classList.contains('active')) playThinkCard(think_card2, 1); });
            cards3[2].addEventListener('click', () => { if (!cards3[2].classList.contains('active')) playThinkCard(think_card3, 2); });

            btnSuivant.addEventListener('click', () => {
                document.getElementById('page-2').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('page-2').style.display = 'none';
                    const page3 = document.getElementById('page-3');
                    page3.style.display = 'flex';
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        page3.style.opacity = '1';
                        playThinkCard(think_card1, 0);
                    }));
                }, 800);
            });
        }
    }, 40);
});

const btnNon = document.getElementById('btn-non');
const TRIGGER_DISTANCE = 80;
let escapeCount = 0;
let lastEffectTime = 0;
let gameOver = false;

function spawnTexts(content, color) {
    for (let i = 0; i < 15; i++) {
        const el = document.createElement('span');
        el.textContent = content;
        el.style.cssText = `
            position: fixed;
            font-size: ${1.2 + Math.random() * 2}rem;
            font-family: 'Georgia', serif;
            font-weight: bold;
            color: ${color};
            left: ${Math.random() * 90}vw;
            top: ${Math.random() * 90}vh;
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
            z-index: 999;
            transform: rotate(${-20 + Math.random() * 40}deg);
        `;
        document.body.appendChild(el);
        setTimeout(() => el.style.opacity = '1', 50);
        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 500);
        }, 2000 + Math.random() * 1000);
    }
}

function spawnEmojis() {
    const emojis = ['😂', '🤣', '😆', '😄'];
    for (let i = 0; i < 20; i++) {
        const el = document.createElement('span');
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.cssText = `
            position: fixed;
            font-size: ${1.5 + Math.random() * 2.5}rem;
            left: ${Math.random() * 90}vw;
            top: ${Math.random() * 90}vh;
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.style.opacity = '1', 50);
        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 500);
        }, 2000 + Math.random() * 1000);
    }
}

let isFixed = false;

function handlePointer(clientX, clientY) {
    if (gameOver) return;
    // page 1 masquée (on est sur #page-pense) : offsetWidth vaut 0, on ignore
    if (!btnNon.offsetWidth) return;
    const rect = btnNon.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const e = { clientX, clientY };

    if (dist < TRIGGER_DISTANCE) {
        if (!isFixed) {
            const r = btnNon.getBoundingClientRect();
            btnNon.style.position = 'fixed';
            btnNon.style.left = r.left + 'px';
            btnNon.style.top = r.top + 'px';
            isFixed = true;
        }
        const margin = 80;
        let newX, newY, attempts = 0;
        do {
            newX = margin + Math.random() * (window.innerWidth - margin * 2);
            newY = margin + Math.random() * (window.innerHeight - margin * 2);
            const fdx = clientX - newX;
            const fdy = clientY - newY;
            if (Math.sqrt(fdx * fdx + fdy * fdy) > 200) break;
            attempts++;
        } while (attempts < 15);
        btnNon.style.transform = '';
        btnNon.style.left = newX + 'px';
        btnNon.style.top = newY + 'px';
        const now = Date.now();
        if (now - lastEffectTime >= 1000) {
            lastEffectTime = now;
            escapeCount++;
            if (escapeCount === 1) spawnEmojis();
            else if (escapeCount === 2) spawnTexts('Oléééééé !', '#e8a0b4');
            else if (escapeCount === 3) spawnTexts('youhhuuuuuuu', '#f4a261');
            else if (escapeCount === 4) { spawnTexts('Oléééééé !', '#e8a0b4'); spawnEmojis(); }
            else if (escapeCount === 5) { spawnTexts('Encore raté !', '#f4a261'); spawnEmojis(); }
            else if (escapeCount === 6) {
                btnNon.style.transition += ', font-size 0.5s ease, padding 0.5s ease';
                btnNon.style.fontSize = '0.6rem';
                btnNon.style.padding = '0.3em 1em';
                const btnOui = document.getElementById('btn-oui');
                btnOui.style.transition = 'font-size 0.5s ease, padding 0.5s ease, box-shadow 0.5s ease';
                btnOui.style.fontSize = '2rem';
                btnOui.style.padding = '0.8em 2.5em';
            }
        }
    }
}

const isMobile = navigator.maxTouchPoints > 0;

if (isMobile) {
    btnNon.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const t = e.touches[0];
        handlePointer(t.clientX, t.clientY);
    }, { passive: false });
} else {
    document.addEventListener('mousemove', (e) => {
        handlePointer(e.clientX, e.clientY);
    });
}

// "Ce que je pense" : la page 1 s'effface et #page-pense prend tout l'écran,
// avec la même mécanique de cards que #page-3
let penseInterval = null;
let penseCardsShown = false;
let waPenseShown = false;

const cardsPense = document.querySelectorAll('#page-pense .card');

function playPenseCard(text, cardIndex) {
    if (penseInterval) clearInterval(penseInterval);
    cardsPense.forEach(c => c.classList.remove('active'));
    if (cardIndex !== undefined) cardsPense[cardIndex].classList.add('active');

    const el = document.getElementById('typed-pense');
    const curseur = document.getElementById('curseur-pense');
    el.innerHTML = '';
    curseur.style.display = 'inline-block';

    let i = 0;
    let rendu = '';
    let gras = false;
    penseInterval = setInterval(() => {
        if (text[i] === '\n') {
            rendu += '<br>';
            i++;
        } else if (text[i] === '*' && text[i + 1] === '*') {
            // **texte** : ouvre puis ferme le gras, la balise est insérée d'un coup
            rendu += gras ? '</strong>' : '<strong>';
            gras = !gras;
            i += 2;
        } else {
            rendu += text[i];
            i++;
        }
        // réassignation complète : le navigateur referme la balise ouverte,
        // donc le texte en cours de frappe reste bien à l'intérieur
        el.innerHTML = rendu;
        if (i >= text.length) {
            clearInterval(penseInterval);
            penseInterval = null;
            curseur.style.display = 'none';
            if (!penseCardsShown) {
                penseCardsShown = true;
                cardsPense.forEach((card, idx) => {
                    setTimeout(() => card.classList.add('visible'), idx * 200);
                });
            }
            // fin de pense_3 : on révèle le bouton WhatsApp
            if (cardIndex === 2 && !waPenseShown) {
                waPenseShown = true;
                const btnWa = document.getElementById('btn-wa-pense');
                btnWa.style.display = 'block';
                requestAnimationFrame(() => requestAnimationFrame(() => btnWa.style.opacity = '1'));
            }
        }
    }, 40);
}

document.getElementById('btn-pense').addEventListener('click', async () => {
    const pagePense = document.getElementById('page-pense');

    document.querySelector('.container').style.display = 'none';
    pagePense.style.opacity = '0';
    pagePense.classList.add('visible');
    requestAnimationFrame(() => requestAnimationFrame(() => pagePense.style.opacity = '1'));

    const textes = await textesPromise;
    // pas de cardIndex : le texte d'intro n'active aucune card
    playPenseCard(textes.pense_intro);
});

cardsPense.forEach((card, idx) => {
    card.addEventListener('click', async () => {
        if (card.classList.contains('active')) return;
        const textes = await textesPromise;
        playPenseCard([textes.pense_1, textes.pense_2, textes.pense_3][idx], idx);
    });
});