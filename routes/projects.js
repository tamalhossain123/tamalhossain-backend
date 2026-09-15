/**
 * Md. Tamal Hossain Portfolio - Core Engine (Final Clean Setup)
 * Fast Preloader + Dynamic Backend Sync + Particle Canvas + Smooth Lightbox + Skills Counter
 */

(function($) {
    'use strict';

    // ব্যাকএন্ড API রুট (লোকালহোস্ট ও লাইভ উভয় মোডেই অটোমেটিক কাজ করবে)
    const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000'
        : 'https://tamalhossain-backend.onrender.com'; // ভবিষ্যতে লাইভ ব্যাকএন্ড ইউআরএল বসাবেন

    const API_BASE = `${BACKEND_URL}/api`;

    /* ==========================================================================
       1. ULTRA FAST PRELOADER
       ========================================================================== */
    function dismissPreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 200);
        }
    }
    document.addEventListener('DOMContentLoaded', dismissPreloader);
    window.addEventListener('load', dismissPreloader);
    setTimeout(dismissPreloader, 400);

    /* ==========================================================================
       2. STICKY NAVBAR ON SCROLL
       ========================================================================== */
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('nav-sticky', window.scrollY >= 50);
        }
    });

    /* ==========================================================================
       3. BACKGROUND CANVAS PARTICLES (60 FPS)
       ========================================================================== */
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 25 : 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 0.8,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4
            });
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(240, 187, 98, 0.25)';
            ctx.strokeStyle = 'rgba(240, 187, 98, 0.05)';

            particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                for (let j = idx + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ==========================================================================
       4. SKILLS SCROLL ANIMATION & NUMBER COUNTER
       ========================================================================== */
    window.triggerSkillsAnimation = function() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // প্রগ্রেস বার ফিল
                    entry.target.querySelectorAll('.skill-progress-fill').forEach(bar => {
                        const targetWidth = bar.getAttribute('data-percent') || '0';
                        bar.style.width = targetWidth + '%';
                    });

                    // সংখ্যা কাউন্ট-আপ
                    entry.target.querySelectorAll('.skill-percent').forEach(label => {
                        const targetNum = parseInt(label.getAttribute('data-target'), 10) || 0;
                        let currentNum = 0;
                        const duration = 1400;
                        const stepTime = Math.abs(Math.floor(duration / (targetNum || 1)));

                        const timer = setInterval(() => {
                            currentNum += 1;
                            label.innerText = currentNum + '%';
                            if (currentNum >= targetNum) {
                                clearInterval(timer);
                                label.innerText = targetNum + '%';
                            }
                        }, stepTime);
                    });

                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        observer.observe(skillsSection);
    };

    window.updateSkillsFromBackend = function(skills) {
        const sContainer = document.getElementById('dynSkillsList');
        if (sContainer && skills && skills.length > 0) {
            sContainer.innerHTML = skills.map(s => `
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">${s.name}</span>
                        <span class="skill-percent" data-target="${s.percentage}">0%</span>
                    </div>
                    <div class="skill-progress-track">
                        <div class="skill-progress-fill" data-percent="${s.percentage}" style="width: 0%;"></div>
                    </div>
                </div>
            `).join('');

            window.triggerSkillsAnimation();
        }
    };

    /* ==========================================================================
       5. DYNAMIC BACKEND SYNC (Profile, Skills, Timeline & Projects)
       ========================================================================== */
    function resolveImageUrl(imgUrl) {
        if (!imgUrl) return 'assets/img/profile-pic.png';
        if (imgUrl.startsWith('http') || imgUrl.startsWith('//')) return imgUrl;
        return `${BACKEND_URL}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
    }

    async function syncPortfolioWithBackend() {
        try {
            const [profRes, projRes] = await Promise.all([
                fetch(`${API_BASE}/profile`).catch(() => null),
                fetch(`${API_BASE}/projects`).catch(() => null)
            ]);

            // PROFILE & RESUME TIMELINE HYDRATION
            if (profRes && profRes.ok) {
                const prof = await profRes.json();
                
                if (prof.name) {
                    const sub = document.getElementById('dynSubtitle');
                    if (sub) sub.innerText = `- I Am ${prof.name}`;
                }
                if (prof.email) {
                    const em1 = document.getElementById('dynEmail');
                    const em2 = document.getElementById('dynContactEmail');
                    if (em1) em1.innerText = prof.email;
                    if (em2) em2.innerText = prof.email;
                }
                if (prof.phone) {
                    const ph1 = document.getElementById('dynPhone');
                    const ph2 = document.getElementById('dynContactPhone');
                    if (ph1) ph1.innerText = prof.phone;
                    if (ph2) ph2.innerText = prof.phone;
                }
                if (prof.address) {
                    const ad1 = document.getElementById('dynAddress');
                    const ad2 = document.getElementById('dynContactAddress');
                    if (ad1) ad1.innerText = prof.address;
                    if (ad2) ad2.innerText = prof.address;
                }
                if (prof.profileImage) {
                    const img = document.getElementById('dynProfileImg');
                    if (img) img.src = resolveImageUrl(prof.profileImage);
                }
                if (prof.aboutBio) {
                    const bio = document.getElementById('dynAboutBio');
                    if (bio) bio.innerHTML = `<p>${prof.aboutBio}</p>`;
                }

                // Skills
                if (prof.skills && prof.skills.length > 0) {
                    window.updateSkillsFromBackend(prof.skills);
                }

                // Education Timeline
                if (prof.education && prof.education.length > 0) {
                    const eContainer = document.getElementById('dynEduContainer');
                    if (eContainer) {
                        eContainer.innerHTML = prof.education.map(e => `
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-card">
                                    <div class="timeline-card-header">
                                        <h4 class="timeline-role">${e.degree || ''}</h4>
                                        <span class="timeline-badge">${e.year || ''}</span>
                                    </div>
                                    <h5 class="timeline-company"><i class="fa-solid fa-award me-2"></i>${e.institute || ''}</h5>
                                    <p class="timeline-desc">${e.field ? e.field + ' - ' : ''}Formal academic curriculum and practical training.</p>
                                </div>
                            </div>
                        `).join('');
                    }
                }

                // Experience Timeline
                if (prof.experience && prof.experience.length > 0) {
                    const expContainer = document.getElementById('dynExpContainer');
                    if (expContainer) {
                        expContainer.innerHTML = prof.experience.map(x => `
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-card">
                                    <div class="timeline-card-header">
                                        <h4 class="timeline-role">${x.role || ''}</h4>
                                        <span class="timeline-badge">${x.duration || ''}</span>
                                    </div>
                                    <h5 class="timeline-company"><i class="fa-regular fa-building me-2"></i>${x.company || ''}</h5>
                                    <p class="timeline-desc">${x.description || ''}</p>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            }

            // PROJECTS HYDRATION (Unified Cards & Lightbox)
            if (projRes && projRes.ok) {
                const projects = await projRes.json();
                if (projects && projects.length > 0) {
                    const grid = document.getElementById('dynPortfolioGrid');
                    if (grid) {
                        grid.innerHTML = projects.map(p => {
                            const isWeb = p.category === 'website' || p.category === 'wordpress';
                            const safeTitle = (p.title || '').replace(/'/g, "\\'");
                            const projectImg = resolveImageUrl(p.image);

                            if (isWeb) {
                                return `
                                    <div class="col-lg-4 col-md-6 col-12 mix ${p.category} mb-4">
                                        <div class="portfolio-card">
                                            <div class="browser-bar">
                                                <span class="dot dot-red"></span>
                                                <span class="dot dot-yellow"></span>
                                                <span class="dot dot-green"></span>
                                                <span class="browser-title">${p.title}</span>
                                            </div>
                                            <div class="card-screen-scroll">
                                                <img src="${projectImg}" alt="${p.title}" loading="lazy">
                                            </div>
                                            <div class="card-meta">
                                                <div class="meta-text">
                                                    <span class="meta-cat">${p.category}</span>
                                                    <h3 class="title">${p.title}</h3>
                                                    <p class="desc">${p.description || ''}</p>
                                                </div>
                                                <div class="meta-action">
                                                    ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" class="port-btn" title="Live Preview"><i class="fa fa-link"></i></a>` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            } else {
                                return `
                                    <div class="col-lg-4 col-md-6 col-12 mix ${p.category} mb-4">
                                        <div class="portfolio-card">
                                            <div class="browser-bar">
                                                <span class="dot dot-red"></span>
                                                <span class="dot dot-yellow"></span>
                                                <span class="dot dot-green"></span>
                                                <span class="browser-title">${p.title}</span>
                                            </div>
                                            <div class="card-screen-graphic">
                                                <img src="${projectImg}" alt="${p.title}" loading="lazy">
                                                <button type="button" class="graphic-zoom-overlay" onclick="openLightbox('${projectImg}', '${safeTitle}')" title="Zoom Preview">
                                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                                </button>
                                            </div>
                                            <div class="card-meta">
                                                <div class="meta-text">
                                                    <span class="meta-cat">${p.category}</span>
                                                    <h3 class="title">${p.title}</h3>
                                                    <p class="desc">${p.description || ''}</p>
                                                </div>
                                                <div class="meta-action">
                                                    <button type="button" onclick="openLightbox('${projectImg}', '${safeTitle}')" class="port-btn" title="Zoom Preview">
                                                        <i class="fa-solid fa-eye"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }
                        }).join('');
                    }
                }
            }
        } catch (err) {
            console.log('Running on fallback offline content:', err);
        }
    }

    /* ==========================================================================
       6. PORTFOLIO FILTERING
       ========================================================================== */
    document.addEventListener('DOMContentLoaded', function() {
        syncPortfolioWithBackend();
        window.triggerSkillsAnimation();

        const filterButtons = document.querySelectorAll('.portfolio_filter ul li');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');
                const items = document.querySelectorAll('#dynPortfolioGrid .mix');

                items.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue.replace('.', ''))) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Back to Top Button
        const bttBtn = document.getElementById('backToTopBtn');
        window.addEventListener('scroll', function() {
            if (bttBtn) {
                bttBtn.classList.toggle('show', window.scrollY > 350);
            }
        });
        if (bttBtn) {
            bttBtn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    });

    /* ==========================================================================
       7. LIGHTBOX CONTROLS
       ========================================================================== */
    window.openLightbox = function(imageSrc, title) {
        const modal = document.getElementById('imageLightbox');
        const img = document.getElementById('lightboxImg');
        const caption = document.getElementById('lightboxTitle');

        if (!modal || !img) return;

        img.src = imageSrc || '';
        img.alt = title || 'Project Preview';
        if (caption) caption.innerText = title || '';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function() {
        const modal = document.getElementById('imageLightbox');
        const img = document.getElementById('lightboxImg');

        if (modal) modal.classList.remove('active');
        if (img) img.src = '';
        document.body.style.overflow = '';
    };

    window.handleLightboxBackdrop = function(e) {
        if (e && e.target && e.target.id === 'imageLightbox') {
            window.closeLightbox();
        }
    };

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeLightbox();
        }
    });

    /* ==========================================================================
       8. CONTACT FORM SUBMISSION (Web3Forms)
       ========================================================================== */
    const form = document.getElementById('contactForm');
    const popup = document.getElementById('thankYouPopup');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: new FormData(form)
            })
            .then(res => {
                if (res.ok) {
                    if (popup) popup.style.display = 'flex';
                    form.reset();
                } else {
                    alert("Something went wrong, please try again.");
                }
            })
            .catch(() => alert("Network error, please try again."))
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    window.closePopup = function() {
        if (popup) popup.style.display = 'none';
    };

    /* ==========================================================================
       9. INITIALIZE AOS ANIMATIONS
       ========================================================================== */
    if (typeof AOS !== 'undefined') {
        AOS.init({ once: true, duration: 800 });
    }

})(jQuery);