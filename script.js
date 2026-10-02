/* ==========================================================================
   Conceptual OS | COS Launcher - ABXY & PlayStation Floating Particles Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. ABXY & PlayStation Colored Symbols Floating Particles Engine (Bare Symbols)
    const initFloatingButtonsBg = () => {
        const bgContainer = document.getElementById('floatingIconsBg');
        if (!bgContainer) return;

        // Bare Controller Symbols & Signature Colors
        const controllerButtons = [
            { label: 'A', color: '#00e676' }, // Xbox Green
            { label: 'B', color: '#ff5f56' }, // Xbox Red
            { label: 'X', color: '#3b82f6' }, // Xbox Blue
            { label: 'Y', color: '#f59e0b' }, // Xbox Yellow
            { label: '△', color: '#00e676' }, // PlayStation Triangle Green
            { label: '○', color: '#ff5f56' }, // PlayStation Circle Red
            { label: '✕', color: '#3b82f6' }, // PlayStation Cross Blue
            { label: '□', color: '#ec4899' }  // PlayStation Square Pink
        ];

        const particleCount = window.innerWidth < 768 ? 24 : 42;

        for (let i = 0; i < particleCount; i++) {
            const btnElement = document.createElement('div');
            const btnData = controllerButtons[Math.floor(Math.random() * controllerButtons.length)];

            btnElement.className = 'floating-btn-particle';
            btnElement.textContent = btnData.label;

            // Size between 18px and 36px
            const size = Math.floor(Math.random() * 18) + 18;
            const leftPos = Math.random() * 95; // 0% to 95%

            // Scatter initial vertical position across 0% to 100% so screen is populated immediately on load
            const initialTop = Math.random() * 100;

            const duration = Math.random() * 16 + 14; // 14s to 30s
            const delay = Math.random() * -15; // Negative delay so animations are in-progress on load!

            btnElement.style.left = `${leftPos}%`;
            btnElement.style.top = `${initialTop}%`;
            btnElement.style.fontSize = `${size}px`;
            btnElement.style.color = btnData.color;
            btnElement.style.animationDuration = `${duration}s`;
            btnElement.style.animationDelay = `${delay}s`;

            bgContainer.appendChild(btnElement);
        }
    };

    initFloatingButtonsBg();

    // 2. Live Clock for HUD Screen Mockup
    const updateLiveClock = () => {
        const clockElement = document.getElementById('liveClock');
        if (!clockElement) return;

        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // 0 hour should be 12

        clockElement.textContent = `${hours}:${minutes} ${ampm}`;
    };

    updateLiveClock();
    setInterval(updateLiveClock, 30000);

    // 3. Mobile Navigation Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    // 4. Copy Repository URL Action
    const copyRepoUrlBtn = document.getElementById('copyRepoUrl');
    const repoUrl = 'https://github.com/austix22/ConceptualOS';

    if (copyRepoUrlBtn) {
        copyRepoUrlBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(repoUrl).then(() => {
                const originalHtml = copyRepoUrlBtn.innerHTML;
                copyRepoUrlBtn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Copiado!';
                copyRepoUrlBtn.style.borderColor = '#CEB5FF';
                copyRepoUrlBtn.style.color = '#CEB5FF';

                setTimeout(() => {
                    copyRepoUrlBtn.innerHTML = originalHtml;
                    copyRepoUrlBtn.style.borderColor = '';
                    copyRepoUrlBtn.style.color = '';
                }, 2500);
            }).catch(err => {
                console.error('Error al copiar URL:', err);
            });
        });
    }

    // 5. Internationalization (i18n) Engine - ES / EN Language Switcher
    const translations = {
        es: {
            nav_features: "Funciones",
            nav_cos_hub: "COS HUB",
            nav_achievements: "Logros",
            nav_download: "Descargas",
            nav_kofi: "Ko-fi",
            nav_about: "Acerca de",
            nav_github: "GitHub",
            hero_badge: "COS Launcher V1.1.0 PLATINUM",
            hero_title: 'Launcher para organizar <br><span class="gradient-text">tus juegos</span>',
            hero_desc: "COS Launcher transforma tu dispositivo portátil en una biblioteca de juegos. Navegación nativa con controles, logros RetroAchievements, COS HUB overlay para accesos rápidos durante el juego y sistema de scrapeo de recursos.",
            stat_controls_label: "Nativo para Controles",
            stat_achievements_label: "Logros RetroAchievements",
            stat_hub_label: "Overlay Flotante",
            stat_scraping_label: "Scrapeo de Recursos",
            mockup_hero_title: "Tu Colección Organizada",
            mockup_hero_desc: "Organiza tus juegos Android, emuladores y carátulas con scrapeo automático de recursos.",
            mockup_card_badge: '<i class="fa-solid fa-gamepad"></i> Controles Nativos',
            features_title: "Diseñado para Dispositivos Portátiles",
            features_desc: "COS Launcher organiza y potencia tu colección de juegos con scrapeo de recursos, logros y accesos rápidos en pantalla.",
            f1_title: "Navegación Nativa con Controles",
            f1_desc: "Soporte para controles en todo el sistema con navegación fluida y mapeo intuitivo.",
            f2_title: "Scrapeo y Copias de Seguridad",
            f2_desc: "Descarga automática y manual de recursos, junto con importación y exportación para copias de seguridad.",
            f3_title: "COS HUB",
            f3_desc: "Superposición flotante en pantalla con accesos rápidos durante la partida.",
            f4_title: "Sistema de Logros Integrado",
            f4_desc: "Integración nativa con RetroAchievements para desbloquear logros y realizar seguimiento a tus avances.",
            f5_title: "Seguimiento de Tiempo de Juego",
            f5_desc: "Seguimiento detallado de tiempo jugado.",
            f6_title: "Reproductor de Música",
            f6_desc: "Reproductor de sonido ambiente integrado para escuchar tu música mientras juegas, con ajuste independiente de sonido.",
            hub_subtitle: "ACCESOS RÁPIDOS EN JUEGO",
            hub_title: "COS HUB Overlay",
            hub_desc: "Mantén el control total de tu dispositivo durante tus partidas. Accede a logros del juego, reproductor de musica, gestor de controles, indicadores de almacenamiento, memoria ram, temperatura de bateria y de cpu, y nombre de procesador, controles de volumen, brillo, modo no moletar, notas rapidas del juego, acceso a capturas de pantalla del dispositivo, y vista web integrada para realizar busquedas rapidas sin interrumpir tu experiencia de juego.",
            hub_check1: "Superposición flotante fluida y transparente.",
            hub_check2: "Accesible desde acceso rápido en pantalla.",
            ach_subtitle: "SISTEMA DE LOGROS",
            ach_title: "Integración con RetroAchievements",
            ach_desc: "Desbloquea logros en tiempo real mientras juegas a tus títulos favoritos. Impulsado por el motor nativo <strong>rcheevos</strong>, Conceptual OS registra tu puntuación global y progreso con RetroAchivements.",
            ach_check1: "Sincronización de perfil y lista de logros.",
            ach_check2: "Integración nativa con el motor rcheevos.",
            dl_title: "Obtén COS Launcher",
            dl_desc: "Descarga la última versión del launcher para tu dispositivo portátil o smartphone Android.",
            dl_apk_badge: "APK DIRECTO",
            dl_apk_title: "Descargar APK directo",
            dl_apk_desc: "Obtén el archivo APK listo para instalar en tu dispositivo.",
            dl_apk_btn: "Descargar APK directo",
            dl_store_badge: "TIENDA OFICIAL",
            dl_store_title: "Google Play Store",
            dl_store_desc: "Instalación automática y segura desde la tienda oficial.",
            dl_store_btn: "Google Play Store",
            kofi_title: "Apoya el proyecto",
            kofi_desc: "Si te gusta Conceptual OS Launcher y deseas apoyar su desarrollo independiente, actualizaciones y nuevas funciones, puedes invitarme un café en Ko-fi.",
            kofi_btn: "Ko-fi",
            about_title: "Acerca de Conceptual OS",
            about_desc: "Conceptual OS es un frontend diseñado para organizar juegos nativos y de emuladores en dispositivos Android. Nacida para ofrecer una experiencia horizontal rápida y elegante, combina navegación nativa con controles, acceso a atajos mediante COS HUB, integración de logros y scrapeo automático de recursos.",
            about_pill1: "Desarrollo Independiente",
            about_pill2: "100% Sin Anuncios",
            about_pill3: "Diseñado para Mandos",
            footer_rights: "&copy; 2026 Conceptual OS / COS Launcher. Todos los derechos reservados.",
            footer_created: "Creado por Austin González"
        },
        en: {
            nav_features: "Features",
            nav_cos_hub: "COS HUB",
            nav_achievements: "Achievements",
            nav_download: "Downloads",
            nav_kofi: "Ko-fi",
            nav_about: "About",
            nav_github: "GitHub",
            hero_badge: "COS Launcher V1.1.0 PLATINUM",
            hero_title: 'Launcher to organize <br><span class="gradient-text">your games</span>',
            hero_desc: "COS Launcher transforms your handheld device into a complete gaming library. Native controller navigation, RetroAchievements integration, COS HUB overlay for quick in-game access, and resource scraping system.",
            stat_controls_label: "Native Controller Support",
            stat_achievements_label: "RetroAchievements System",
            stat_hub_label: "Floating Overlay",
            stat_scraping_label: "Resource Scraping",
            mockup_hero_title: "Your Organized Collection",
            mockup_hero_desc: "Organize your Android games, emulators, and cover art with automatic resource scraping.",
            mockup_card_badge: '<i class="fa-solid fa-gamepad"></i> Native Controls',
            features_title: "Designed for Handheld Devices",
            features_desc: "COS Launcher organizes and enhances your game collection with resource scraping, achievements, and on-screen shortcuts.",
            f1_title: "Native Controller Navigation",
            f1_desc: "System-wide controller support with smooth navigation and intuitive mapping.",
            f2_title: "Scraping & Backups",
            f2_desc: "Automatic and manual resource downloads, along with import and export for backups.",
            f3_title: "COS HUB",
            f3_desc: "Floating on-screen overlay with quick shortcuts during gameplay.",
            f4_title: "Integrated Achievement System",
            f4_desc: "Native integration with RetroAchievements to unlock achievements and track your progress.",
            f5_title: "Playtime Tracking",
            f5_desc: "Detailed tracking of total play time.",
            f6_title: "Music Player",
            f6_desc: "Integrated ambient sound player to listen to your music while playing, with independent sound controls.",
            hub_subtitle: "IN-GAME QUICK SHORTCUTS",
            hub_title: "COS HUB Overlay",
            hub_desc: "Maintain full control of your device during gameplay. Access achievements, music player, controller manager, storage indicators, RAM, battery and CPU temperature, processor name, volume controls, brightness, do not disturb mode, quick game notes, screenshots, and built-in web view without interrupting your game.",
            hub_check1: "Smooth and transparent floating overlay.",
            hub_check2: "Accessible via on-screen quick shortcut.",
            ach_subtitle: "ACHIEVEMENT SYSTEM",
            ach_title: "RetroAchievements Integration",
            ach_desc: "Unlock real-time achievements while playing your favorite titles. Powered by the native <strong>rcheevos</strong> engine, Conceptual OS tracks your global score and progress with RetroAchievements.",
            ach_check1: "Profile sync and achievement list.",
            ach_check2: "Native integration with the rcheevos engine.",
            dl_title: "Get COS Launcher",
            dl_desc: "Download the latest version of the launcher for your handheld device or Android smartphone.",
            dl_apk_badge: "DIRECT APK",
            dl_apk_title: "Download Direct APK",
            dl_apk_desc: "Get the APK file ready to install on your device.",
            dl_apk_btn: "Download Direct APK",
            dl_store_badge: "OFFICIAL STORE",
            dl_store_title: "Google Play Store",
            dl_store_desc: "Automatic and safe installation from the official store.",
            dl_store_btn: "Google Play Store",
            kofi_title: "Support the Project",
            kofi_desc: "If you like Conceptual OS Launcher and wish to support its independent development, updates, and new features, you can buy me a coffee on Ko-fi.",
            kofi_btn: "Ko-fi",
            about_title: "About Conceptual OS",
            about_desc: "Conceptual OS is a frontend designed to organize native and emulator games on Android devices. Built to deliver a fast and elegant landscape experience, it combines native controller navigation, COS HUB shortcuts, achievement integration, and automatic resource scraping.",
            about_pill1: "Indie Development",
            about_pill2: "100% Ad-Free",
            about_pill3: "Designed for Controllers",
            footer_rights: "&copy; 2026 Conceptual OS / COS Launcher. All rights reserved.",
            footer_created: "Created by Austin González"
        }
    };

    let currentLang = localStorage.getItem('cos_web_lang') || 'es';

    const applyLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('cos_web_lang', lang);

        const langTextElement = document.getElementById('langText');
        if (langTextElement) {
            langTextElement.textContent = lang === 'es' ? 'ES' : 'EN';
        }

        const dictionary = translations[lang];
        if (!dictionary) return;

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (dictionary[key] !== undefined) {
                element.innerHTML = dictionary[key];
            }
        });
    };

    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const nextLang = currentLang === 'es' ? 'en' : 'es';
            applyLanguage(nextLang);
        });

        langToggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const nextLang = currentLang === 'es' ? 'en' : 'es';
                applyLanguage(nextLang);
            }
        });
    }

    // Apply initial language state
    applyLanguage(currentLang);

    // 6. Interactive RetroAchievements Grid Handler
    const achGridItems = document.querySelectorAll('.ra-grid-item');
    const achMainIcon = document.getElementById('achMainIcon');
    const achMainTitle = document.getElementById('achMainTitle');
    const achMainDesc = document.getElementById('achMainDesc');
    const achMainPts = document.getElementById('achMainPts');
    const achMainProgress = document.getElementById('achMainProgress');
    const achMainCount = document.getElementById('achMainCount');

    const achDefaultState = {
        icon: 'fa-gamepad',
        title: 'Aetherium: Zero',
        desc: 'Progreso de logros',
        pts: ''
    };

    if (achGridItems.length > 0) {
        achGridItems.forEach(item => {
            item.addEventListener('click', () => {
                const isAlreadyActive = item.classList.contains('active');

                // Quitar foco a todos los items
                achGridItems.forEach(i => i.classList.remove('active'));

                if (isAlreadyActive) {
                    // Si ya estaba enfocado, al volverlo a tocar regresa al estado inicial
                    if (achMainIcon) achMainIcon.className = `fa-solid ${achDefaultState.icon}`;
                    if (achMainTitle) achMainTitle.textContent = achDefaultState.title;
                    if (achMainDesc) achMainDesc.textContent = achDefaultState.desc;
                    if (achMainPts) achMainPts.textContent = achDefaultState.pts;
                } else {
                    // Activar el item tocado y cargar sus datos sin cambiar la barra de progreso
                    item.classList.add('active');

                    const iconClass = item.getAttribute('data-icon');
                    const title = item.getAttribute('data-title');
                    const desc = item.getAttribute('data-desc');
                    const pts = item.getAttribute('data-pts');

                    if (achMainIcon && iconClass) achMainIcon.className = `fa-solid ${iconClass}`;
                    if (achMainTitle && title) achMainTitle.textContent = title;
                    if (achMainDesc && desc) achMainDesc.textContent = desc;
                    if (achMainPts && pts) achMainPts.textContent = pts;
                }
            });
        });
    }

    // 7. Interactive COS HUB Overlay Tabs Handler
    const overlayIconBtns = document.querySelectorAll('.overlay-icon-btn');
    const overlayTabViews = document.querySelectorAll('.overlay-tab-view');

    if (overlayIconBtns.length > 0 && overlayTabViews.length > 0) {
        overlayIconBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                overlayIconBtns.forEach(b => b.classList.remove('active'));
                overlayTabViews.forEach(v => v.classList.remove('active'));

                btn.classList.add('active');
                if (overlayTabViews[index]) {
                    overlayTabViews[index].classList.add('active');
                }
            });
        });
    }

});
