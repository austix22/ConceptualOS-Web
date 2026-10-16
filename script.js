/* ==========================================================================
   Conceptual OS | COS Launcher - ABXY & PlayStation Floating Particles Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 0. High-Performance Web Audio SFX Engine (Zero-Latency, Instant Preload & Fallback)
    const SFX = (() => {
        let audioCtx = null;
        const soundBuffers = {};
        const audioElements = {};
        const soundSources = {
            click_1: 'm4a/click_1.m4a',
            click_2: 'm4a/click_2.m4a',
            juegoabrir: 'm4a/juegoabrir.mp3'
        };

        const getAudioContext = () => {
            if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    audioCtx = new AudioContextClass();
                }
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {});
            }
            return audioCtx;
        };

        // Preload sound using Web Audio API buffer (instantaneous decode)
        const loadSoundBuffer = async (name, url) => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const ctx = getAudioContext();
                if (ctx) {
                    ctx.decodeAudioData(arrayBuffer, (decoded) => {
                        soundBuffers[name] = decoded;
                    }, () => {});
                }
            } catch (err) {
                // If fetch / decode fails (e.g. file:// protocol restriction), fallback smoothly
            }
        };

        // Preload HTMLAudioElements as instant fallback pool
        const initAudioElements = () => {
            Object.keys(soundSources).forEach(key => {
                const el = document.getElementById(key === 'click_1' ? 'sfxClick1' : (key === 'click_2' ? 'sfxClick2' : 'sfxJuegoAbrir')) || new Audio(soundSources[key]);
                el.preload = 'auto';
                el.load();
                audioElements[key] = el;
                loadSoundBuffer(key, soundSources[key]);
            });
        };

        initAudioElements();

        // Unlock audio context on any user interaction so first touch produces immediate sound without delay
        const unlockAudio = () => {
            getAudioContext();
            ['pointerdown', 'touchstart', 'mousedown', 'keydown'].forEach(evt => {
                window.removeEventListener(evt, unlockAudio, true);
            });
        };
        ['pointerdown', 'touchstart', 'mousedown', 'keydown'].forEach(evt => {
            window.addEventListener(evt, unlockAudio, { capture: true, once: true });
        });

        const play = (name, volume = 0.85) => {
            const ctx = getAudioContext();
            // Try Web Audio API first for zero-latency instant triggering
            if (ctx && soundBuffers[name]) {
                try {
                    const source = ctx.createBufferSource();
                    const gainNode = ctx.createGain();
                    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
                    source.buffer = soundBuffers[name];
                    source.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    source.start(0);
                    return;
                } catch (e) {
                    // fall back to Audio element
                }
            }

            // Fallback via HTMLAudioElement clone to prevent queue delays or overlaps
            try {
                const baseEl = audioElements[name] || document.getElementById(name === 'click_1' ? 'sfxClick1' : (name === 'click_2' ? 'sfxClick2' : 'sfxJuegoAbrir'));
                if (baseEl) {
                    const clone = baseEl.cloneNode(true);
                    clone.volume = volume;
                    const p = clone.play();
                    if (p && typeof p.catch === 'function') {
                        p.catch(() => {});
                    }
                }
            } catch (err) {}
        };

        return {
            click1: (vol = 0.85) => play('click_1', vol),
            click2: (vol = 0.85) => play('click_2', vol),
            juegoAbrir: (vol = 0.9) => play('juegoabrir', vol),
            unlock: unlockAudio
        };
    })();

    // Global tactile click / tap listener for interactive elements (supports pointerdown & click without duplicate triggers)
    const interactiveSelector = [
        'a',
        'button',
        '[role="button"]',
        '.overlay-icon-btn',
        '.ra-grid-item',
        '.tool-card',
        '.tool-button',
        '.music-btn',
        '.badge-pill',
        '.nav-item-pill',
        '.tab-pill',
        '.action-pill',
        '.tool-chip',
        '.kofi-nav-pill',
        '.lang-toggle-pill',
        '.faq-item-header',
        '.accordion-header',
        '.hero-btn',
        '.btn',
        '.btn-kofi',
        '.download-btn',
        '.os-filter-pill',
        '.social-link'
    ].join(',');

    let lastInteractionTime = 0;
    const triggerTactileClick = (e) => {
        // Debounce touchstart/pointerdown/click duplicates
        const now = Date.now();
        if (now - lastInteractionTime < 90) return;

        // Skip gallery cards (which play juegoabrir) and modal close (which plays click_2)
        const galleryCard = e.target.closest('.gallery-card');
        const isLightboxClose = e.target.closest('#lightboxCloseBtn, .lightbox-close, #lightboxOverlay, .lightbox-overlay');
        if (galleryCard || isLightboxClose) return;

        const target = e.target.closest(interactiveSelector);
        if (target) {
            lastInteractionTime = now;
            SFX.click1();
        }
    };

    document.addEventListener('pointerdown', triggerTactileClick, { capture: true, passive: true });
    document.addEventListener('click', triggerTactileClick, { capture: true, passive: true });

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

    // 4. Internationalization (i18n) Engine - ES / EN Language Switcher
    const translations = {
        es: {
            nav_features: "Funciones",
            nav_compat: "Compatibilidad",
            nav_cos_hub: "COS HUB",
            nav_achievements: "Logros",
            nav_gallery: "Galería",
            nav_faq: "FAQ",
            nav_download: "Descargas",
            nav_kofi: "Ko-fi",
            nav_about: "Acerca de",
            hero_badge: "COS Launcher V1.1.0 Platinum",
            hero_title: 'Tus juegos, <br><span class="gradient-text">en un solo lugar</span>',
            hero_desc: "COS Launcher reúne tus juegos de Android y emuladores en una biblioteca organizada. Disfruta de navegación con controles, logros de RetroAchievements y accesos rápidos durante tus partidas con COS HUB.",
            stat_controls_label: "Navegación con controles",
            stat_achievements_val: "Logros",
            stat_achievements_label: "Logros de RetroAchievements",
            stat_hub_label: "Accesos rápidos en partida",
            stat_scraping_val: "Recursos",
            stat_scraping_label: "Recursos gráficos",
            mockup_hero_title: "Tu Colección Organizada",
            mockup_hero_desc: "Organiza tus juegos de Android, emuladores y carátulas con recursos gráficos descargados automáticamente.",
            mockup_card_badge: '<i class="fa-solid fa-gamepad"></i> Compatible con controles',
            features_title: "Diseñado para dispositivos portátiles",
            features_desc: "Organiza tu colección de juegos con recursos gráficos, logros y accesos rápidos en pantalla.",
            f1_title: "Navegación con controles",
            f1_desc: "Recorre la interfaz con tus controles y disfruta de una navegación fluida e intuitiva.",
            f2_title: "Recursos y copias de seguridad",
            f2_desc: "Descarga recursos gráficos de forma automática o manual, e importa o exporta copias de seguridad.",
            f3_title: "COS HUB",
            f3_desc: "Abre una superposición flotante con herramientas y accesos rápidos mientras juegas.",
            f4_title: "Sistema de Logros Integrado",
            f4_desc: "Conecta con RetroAchievements para desbloquear logros y seguir tu progreso.",
            f5_title: "Seguimiento de Tiempo de Juego",
            f5_desc: "Consulta cuánto tiempo has dedicado a cada juego.",
            f6_title: "Reproductor de Música",
            f6_desc: "Escucha música mientras juegas y ajusta su volumen de forma independiente.",
            compat_subtitle: "ECOSISTEMA INTEGRADO",
            compat_title: "Compatibilidad Amplia",
            compat_desc: "COS Launcher está diseñado para comunicarse con tus emuladores favoritos, mandos físicos y dispositivos Android sin configuraciones complicadas.",
            compat_c1_title: "Emuladores y Juegos",
            compat_c1_desc: "Lanza directamente tus títulos favoritos. Compatible con todos los emuladores actuales y juegos nativos de Android.",
            compat_c2_title: "Mandos",
            compat_c2_desc: "Navegación nativa Plug & Play. Compatible con todos los controles Bluetooth o USB-C.",
            compat_c3_title: "Dispositivos y Sistema",
            compat_c3_desc: "Optimizado para consolas portátiles dedicadas (Ayn Odin, Retroid Pocket, Anbernic, Logitech G Cloud), smartphones y tablets con Android 9.0 o superior.",
            hub_subtitle: "ACCESOS RÁPIDOS DURANTE LA PARTIDA",
            hub_title: "COS HUB Overlay",
            hub_desc: "COS HUB reúne herramientas útiles sin sacarte de la partida. Consulta tus logros, controla el volumen y el brillo, revisa el almacenamiento y el estado del dispositivo, administra tus controles, toma notas y capturas de pantalla, o realiza una búsqueda rápida desde el navegador integrado.",
            hub_check1: "Superposición flotante fluida y transparente.",
            hub_check2: "Abre COS HUB desde el acceso rápido en pantalla.",
            hub_check3: "Reproductor de música con control de volumen independiente.",
            hub_check4: "Navegador web integrado para consultar guías y trucos al instante.",
            hub_check5: "Monitoreo en tiempo real de batería, almacenamiento y controles.",
            ach_subtitle: "SISTEMA DE LOGROS",
            ach_title: "Integración con RetroAchievements",
            ach_desc: "Revive tus juegos favoritos con la emoción de los logros modernos. COS Launcher se conecta de forma directa con tu cuenta de RetroAchievements utilizando el motor oficial <strong>rcheevos</strong>, permitiéndote competir, sumar puntos y llevar un registro de tus hazañas.",
            ach_check1: "Sincronización de perfil y lista de logros.",
            ach_check2: "Integración nativa con el motor rcheevos.",
            ach_check3: "Seguimiento de porcentaje completado y puntos acumulados.",
            ach_check4: "Consulta tus logros desbloqueados tanto en el menú como en COS HUB.",
            gallery_subtitle: "INTERFAZ Y CAPTURAS",
            gallery_title: "COS Launcher en acción",
            gallery_desc: "Un recorrido visual por el sistema diseñado para consolas portátiles y dispositivos Android. Fluido, personalizable y 100% pensado para controles.",
            gallery_zoom_hint: "Ampliar captura",
            gallery_item1_tag: "01 • INICIO",
            gallery_item1_title: "Pantalla de Inicio",
            gallery_item1_desc: "Dashboard principal con juegos, filtro de recientes, logros desbloqueados recientemente y videos de novedades. En la parte superior: cápsula de conexión, hora, cápsula de batería, nombre de usuario e icono de perfil.",
            gallery_item2_tag: "02 • PANEL",
            gallery_item2_title: "Panel de Fondo e Iconos",
            gallery_item2_desc: "Vista completa de juegos con información detallada, tiempo de juego acumulado, última vez jugado y logros.",
            gallery_item3_tag: "03 • JUEGOS",
            gallery_item3_title: "Pestaña de Juegos",
            gallery_item3_desc: "Metadatos completos (desarrollador, año, jugadores, calificación), cápsula superior de logros, y atajos rápidos para gameplay, opciones y favoritos.",
            gallery_item4_tag: "04 • LOGROS",
            gallery_item4_title: "Progreso de Logros",
            gallery_item4_desc: "Ventana emergente con logros bloqueados y desbloqueados, porcentaje de avance y puntaje oficial de RetroAchievements.",
            gallery_item5_tag: "05 • FABRICANTES",
            gallery_item5_title: "Filtro por Fabricante",
            gallery_item5_desc: "Organización visual por marcas (Android, Nintendo, Sony) con opción de añadir nuevas consolas.",
            gallery_item6_tag: "06 • CONSOLAS",
            gallery_item6_title: "Navegador de Consolas",
            gallery_item6_desc: "Selector directo de sistemas con especificación de generación y conteo de juegos.",
            gallery_item7_tag: "07 • RETROACHIEVEMENTS",
            gallery_item7_title: "Perfil y Mis Logros",
            gallery_item7_desc: "Panel de sincronización con puntuación global, avatar de usuario, acceso rápido a la página RetroAchievements interna y catálogo de juegos con logros activos.",
            gallery_item8_tag: "08 • DESCARGAS",
            gallery_item8_title: "Centro de Descargas",
            gallery_item8_desc: "Gestor de enlaces para la descarga de emuladores organizados por plataforma. Todos los enlaces son oficiales y provienen directamente de sus propios creadores.",
            faq_subtitle: "RESOLVEMOS TUS DUDAS",
            faq_title: "Preguntas Frecuentes",
            faq_desc: "Todo lo que necesitas saber sobre compatibilidad, instalación y funcionamiento de COS Launcher.",
            faq_q1: "¿Qué dispositivos y versiones de Android son compatibles?",
            faq_a1: "COS Launcher es compatible con Android 9.0 (Pie) en adelante, hasta Android 15. Está optimizado para funcionar con máxima fluidez tanto en consolas portátiles dedicadas (Ayn Odin, Retroid Pocket, Anbernic, Logitech G Cloud) como en smartphones, tablets y dispositivos Android TV.",
            faq_q2: "¿Cómo funciona la navegación con controles?",
            faq_a2: "El soporte es 100% nativo. Puedes conectar tu control por Bluetooth o USB-C y navegar por toda la interfaz, biblioteca y herramientas de COS HUB utilizando la cruceta, sticks y botones sin requerir aplicaciones externas de mapeo.",
            faq_q3: "¿La aplicación incluye juegos o emuladores?",
            faq_a3: "No. COS Launcher es un organizador de biblioteca e interfaz visual de alto rendimiento (frontend). Debes poseer tus propios emuladores y juegos (ROMs) legalmente adquiridos; la aplicación se encarga de organizarlos, descargar sus carátulas y brindarte lanzamientos directos e instantáneos.",
            faq_q4: "¿Es segura la instalación directa del APK o Google Play Store?",
            faq_a4: "Sí, totalmente. COS Launcher está construido bajo el principio de privacidad por diseño: es una aplicación 100% libre de publicidad, sin rastreadores invasivos ni recolección de datos personales. Puedes descargar el APK oficial compilado directamente o instalarlo desde Google Play Store.",
            faq_q5: "¿Cómo funciona la integración con RetroAchievements (Logros)?",
            faq_a5: "Solo debes vincular tu cuenta de RetroAchievements desde la app. COS Launcher sincronizará automáticamente tus logros obtenidos, mostrará tu progreso en tiempo real dentro de tu perfil y desplegará un menú superpuesto (Overlay) durante tus partidas para consultar y seguir tus logros al instante.",
            faq_q6: "¿Cómo funciona la descarga de recursos e información de los juegos?",
            faq_a6: "El scraping de recursos se realiza mediante conexión con ScreenScraper y SteamGridDB utilizando tus cuentas y claves API. Al configurarlas en la app, COS Launcher obtiene e integra iconos en alta definición, fondos de pantalla (banners), vistas previas en video e información de cada juego.",
            dl_title: "Obtén COS Launcher",
            dl_desc: "Descarga COS Launcher en tu dispositivo portátil o teléfono Android.",
            dl_apk_badge: "APK DIRECTO",
            dl_apk_desc: "Instala la aplicación manualmente en tu dispositivo Android.",
            dl_apk_btn: "Descargar APK",
            dl_store_badge: "TIENDA OFICIAL",
            dl_store_desc: "Instala y actualiza la aplicación desde la tienda oficial.",
            dl_store_btn: "Abrir tienda",
            dl_spec_version: "<strong>Versión:</strong> v1.1.0 Platinum",
            dl_spec_req: "<strong>Requisitos:</strong> Android 9.0 o superior",
            dl_apk_security: "<strong>Seguridad:</strong> 100% libre de anuncios y virus",
            dl_spec_updates: "<strong>Actualizaciones:</strong> Automáticas",
            dl_spec_protect: "<strong>Seguridad:</strong> Verificado por Google Play Protect",
            kofi_title: "Apoya el proyecto",
            kofi_desc: "COS Launcher es y seguirá siendo 100% gratuito, libre de publicidad y sin ningún tipo de cobro oculto. Desarrollarlo y pulir cada detalle requiere muchas horas de código, pruebas y optimización; si la app te resulta útil en tus partidas y quieres mostrar tu agradecimiento, invitarme a un café en Ko-fi es una gran forma de valorar mi tiempo y darme un empujón de energía para seguir mejorándola.",
            kofi_btn: "Ko-fi",
            about_title: "Acerca de COS Launcher",
            about_desc: "Creemos que encender tu dispositivo y ponerte a jugar debería ser algo inmediato, sin interfaces saturadas, configuraciones complejas ni distracciones innecesarias. COS Launcher transforma cualquier dispositivo Android en un entorno de consola limpio y directo, donde tu colección de juegos, carátulas y logros se sienten integrados de forma natural con tus controles. Un desarrollo independiente pensado para ofrecer ligereza, privacidad y comodidad real desde la primera partida.",
            about_pill1: "Desarrollo independiente",
            about_pill2: "100 % sin anuncios",
            about_pill3: "Compatible con controles",
            footer_rights: "&copy; 2026 COS Launcher. Todos los derechos reservados.",
            footer_dev_text: "Desarrollado por"
        },
        en: {
            nav_features: "Features",
            nav_compat: "Compatibility",
            nav_cos_hub: "COS HUB",
            nav_achievements: "Achievements",
            nav_gallery: "Gallery",
            nav_faq: "FAQ",
            nav_download: "Downloads",
            nav_kofi: "Ko-fi",
            nav_about: "About",
            hero_badge: "COS Launcher V1.1.0 Platinum",
            hero_title: 'Your games, <br><span class="gradient-text">all in one place</span>',
            hero_desc: "COS Launcher brings your Android games and emulators together in one organized library. Enjoy controller-friendly navigation, RetroAchievements, and quick in-game access with COS HUB.",
            stat_controls_label: "Controller navigation",
            stat_achievements_val: "Achievements",
            stat_achievements_label: "RetroAchievements",
            stat_hub_label: "Floating Overlay",
            stat_scraping_val: "Assets",
            stat_scraping_label: "Graphic assets",
            mockup_hero_title: "Your Organized Collection",
            mockup_hero_desc: "Organize your Android games, emulators, and cover art with automatic resource scraping.",
            mockup_card_badge: '<i class="fa-solid fa-gamepad"></i> Native Controls',
            features_title: "Designed for handheld devices",
            features_desc: "Organize your game collection with artwork, achievements, and on-screen shortcuts.",
            f1_title: "Controller-friendly navigation",
            f1_desc: "Navigate the interface with your controller and enjoy a smooth, intuitive experience.",
            f2_title: "Artwork & backups",
            f2_desc: "Download game artwork automatically or manually, and import or export backups.",
            f3_title: "COS HUB",
            f3_desc: "Open a floating overlay with useful tools and shortcuts while you play.",
            f4_title: "Integrated Achievement System",
            f4_desc: "Connect to RetroAchievements to unlock achievements and track your progress.",
            f5_title: "Playtime Tracking",
            f5_desc: "See how much time you have spent playing each game.",
            f6_title: "Music Player",
            f6_desc: "Listen to music while you play and adjust its volume independently.",
            compat_subtitle: "INTEGRATED ECOSYSTEM",
            compat_title: "Broad Compatibility",
            compat_desc: "COS Launcher seamlessly connects with your favorite emulators, physical controllers, and Android handhelds.",
            compat_c1_title: "Emulators & Games",
            compat_c1_desc: "Launch your favorite titles directly. Compatible with all current Android emulators and native mobile games.",
            compat_c2_title: "Controllers",
            compat_c2_desc: "Native Plug & Play navigation. Compatible with all Bluetooth or USB-C controllers.",
            compat_c3_title: "Devices & Android",
            compat_c3_desc: "Optimized for dedicated gaming handhelds (Ayn Odin, Retroid Pocket, Anbernic, Logitech G Cloud), Android phones, and tablets running Android 9.0 or higher.",
            hub_subtitle: "QUICK ACCESS WHILE YOU PLAY",
            hub_title: "COS HUB Overlay",
            hub_desc: "COS HUB brings useful tools together without pulling you out of your game. Check achievements, adjust volume and brightness, review storage and device status, manage your controller, take notes and screenshots, or run a quick search in the built-in browser.",
            hub_check1: "Smooth and transparent floating overlay.",
            hub_check2: "Open COS HUB from the on-screen quick shortcut.",
            hub_check3: "Music player with independent background volume control.",
            hub_check4: "Built-in web browser to check game guides and cheats instantly.",
            hub_check5: "Real-time monitoring of battery, storage, and controllers.",
            ach_subtitle: "ACHIEVEMENT SYSTEM",
            ach_title: "RetroAchievements Integration",
            ach_desc: "Relive your favorite games with the thrill of modern achievements. COS Launcher connects directly to your RetroAchievements account using the official <strong>rcheevos</strong> engine, allowing you to compete, earn points, and track your gaming feats.",
            ach_check1: "Profile sync and achievement list.",
            ach_check2: "Native integration with the rcheevos engine.",
            ach_check3: "Track completion percentage and earned points.",
            ach_check4: "Check unlocked achievements both in the launcher and COS HUB.",
            gallery_subtitle: "INTERFACE & SCREENSHOTS",
            gallery_title: "COS Launcher in Action",
            gallery_desc: "A visual walkthrough of the system built for gaming handhelds and Android devices. Smooth, customizable, and 100% controller-driven.",
            gallery_zoom_hint: "Expand screenshot",
            gallery_item1_tag: "01 • HOME",
            gallery_item1_title: "Home Dashboard",
            gallery_item1_desc: "Main dashboard with games, recent filter, recently unlocked achievements, and news videos. Top status capsule features connection, clock, battery status, username, and profile icon.",
            gallery_item2_tag: "02 • PANEL",
            gallery_item2_title: "Backdrop Panel & Icons",
            gallery_item2_desc: "Full game view with detailed information, total play time, last played status, and achievements.",
            gallery_item3_tag: "03 • GAMES",
            gallery_item3_title: "Games Tab",
            gallery_item3_desc: "Complete metadata (developer, release year, players, rating), top achievement capsule, and quick shortcuts for gameplay, options, and favorites.",
            gallery_item4_tag: "04 • ACHIEVEMENTS",
            gallery_item4_title: "Achievement Progress",
            gallery_item4_desc: "Pop-up modal displaying locked and unlocked achievements, completion progress bar, and official RetroAchievements score.",
            gallery_item5_tag: "05 • MANUFACTURERS",
            gallery_item5_title: "Manufacturer Filter",
            gallery_item5_desc: "Browse your library categorized by manufacturers (Android, Nintendo, Sony) with the option to add new consoles.",
            gallery_item6_tag: "06 • CONSOLES",
            gallery_item6_title: "Console Browser",
            gallery_item6_desc: "Direct system selector with generation details and game count.",
            gallery_item7_tag: "07 • RETROACHIEVEMENTS",
            gallery_item7_title: "Profile & Achievements",
            gallery_item7_desc: "Official RetroAchievements profile hub showing global score, avatar, quick access to internal RetroAchievements web view, and active game catalogue with achievements.",
            gallery_item8_tag: "08 • DOWNLOADS",
            gallery_item8_title: "Download Center",
            gallery_item8_desc: "Platform-organized link manager for downloading emulators. All links are official and point directly to their original creators.",
            faq_subtitle: "EVERYTHING YOU NEED TO KNOW",
            faq_title: "Frequently Asked Questions",
            faq_desc: "Key answers about compatibility, installation, and how COS Launcher works.",
            faq_q1: "Which devices and Android versions are supported?",
            faq_a1: "COS Launcher supports Android 9.0 (Pie) and above, up to Android 15. It is optimized to run with maximum fluidity on dedicated gaming handhelds (Ayn Odin, Retroid Pocket, Anbernic, Logitech G Cloud) as well as smartphones, tablets, and Android TV devices.",
            faq_q2: "How does controller navigation work?",
            faq_a2: "Controller support is 100% native. You can connect your controller via Bluetooth or USB-C and navigate the entire interface, library, and COS HUB tools using the D-pad, analog sticks, and buttons without needing external mapping apps.",
            faq_q3: "Does the application include games or emulators?",
            faq_a3: "No. COS Launcher is a high-performance frontend visual interface and library organizer. You must provide your own legally acquired emulators and games (ROMs); the app takes care of organizing them, downloading artwork, and providing instant direct game launches.",
            faq_q4: "Is installing directly via APK or Google Play Store safe?",
            faq_a4: "Yes, completely safe. COS Launcher is built with privacy-by-design principles: it is 100% ad-free, with zero invasive trackers or personal data collection. You can download the official compiled APK directly or install it from the Google Play Store.",
            faq_q5: "How does RetroAchievements integration work?",
            faq_a5: "Simply link your RetroAchievements account from the app. COS Launcher will automatically sync your earned achievements, display your real-time progress on your profile, and provide an in-game overlay menu to track and view your achievements on the fly.",
            faq_q6: "How does game assets and details scraping work?",
            faq_a6: "Asset and metadata scraping connects directly to ScreenScraper and SteamGridDB using your accounts and API keys. Once configured in the app, COS Launcher fetches and integrates high-definition icons, background banners, video previews, and details for each game.",
            dl_title: "Get COS Launcher",
            dl_desc: "Download COS Launcher on your handheld device or Android phone.",
            dl_apk_badge: "DIRECT APK",
            dl_apk_desc: "Install the application manually on your Android device.",
            dl_apk_btn: "Download APK",
            dl_store_badge: "OFFICIAL STORE",
            dl_store_desc: "Install and update the application from the official store.",
            dl_store_btn: "Open store",
            dl_spec_version: "<strong>Version:</strong> v1.1.0 Platinum",
            dl_spec_req: "<strong>Requirements:</strong> Android 9.0 or higher",
            dl_apk_security: "<strong>Security:</strong> 100% ad-free & virus-free",
            dl_spec_updates: "<strong>Updates:</strong> Automatic",
            dl_spec_protect: "<strong>Security:</strong> Verified by Google Play Protect",
            kofi_title: "Support the Project",
            kofi_desc: "COS Launcher is and will always remain 100% free, ad-free, and without hidden fees. Developing and refining every detail takes countless hours of coding, testing, and optimization; if you find the app useful and want to show appreciation, buying me a coffee on Ko-fi is a wonderful way to support my time and fuel future improvements.",
            kofi_btn: "Ko-fi",
            about_title: "About COS Launcher",
            about_desc: "We believe turning on your device and jumping into a game should be effortless—free from cluttered menus, complex setups, and unnecessary distractions. COS Launcher transforms any Android device into a clean, dedicated console environment where your game library, artwork, and achievements blend naturally with your controllers. An independent project built for responsiveness, privacy, and genuine comfort.",
            about_pill1: "Indie development",
            about_pill2: "100% ad-free",
            about_pill3: "Controller-friendly",
            footer_rights: "&copy; 2026 COS Launcher. All rights reserved.",
            footer_dev_text: "Developed by"
        }
    };

    let currentLang = localStorage.getItem('cos_web_lang') || 'es';
    let updateLightboxContent = () => {};

    function updateDndSubText() {
        const dndBtnEl = document.getElementById('dndBtn');
        const dndSubTextEl = document.getElementById('dndSubText');
        if (!dndSubTextEl || !dndBtnEl) return;
        const isActive = dndBtnEl.classList.contains('active');
        if (typeof currentLang !== 'undefined' && currentLang === 'en') {
            dndSubTextEl.textContent = isActive ? 'Enabled' : 'Disabled';
        } else {
            dndSubTextEl.textContent = isActive ? 'Activado' : 'Desactivado';
        }
    }

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

        updateDndSubText();
        updateLightboxContent();
        const sysNoteInput = document.getElementById('sysNoteInput');
        if (sysNoteInput) {
            sysNoteInput.placeholder = lang === 'en' ? 'Write a note...' : 'Escribe una nota...';
        }
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
            const handleAchClick = () => {
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
            };

            item.addEventListener('click', handleAchClick);
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    SFX.click1();
                    handleAchClick();
                }
            });
        });
    }

    // 7. Interactive COS HUB Overlay Tabs Handler
    const overlayIconBtns = document.querySelectorAll('.overlay-icon-btn');
    const overlayTabViews = document.querySelectorAll('.overlay-tab-view');

    if (overlayIconBtns.length > 0 && overlayTabViews.length > 0) {
        overlayIconBtns.forEach((btn, index) => {
            const handleTabClick = () => {
                overlayIconBtns.forEach(b => b.classList.remove('active'));
                overlayTabViews.forEach(v => v.classList.remove('active'));

                btn.classList.add('active');
                if (overlayTabViews[index]) {
                    overlayTabViews[index].classList.add('active');
                }
            };

            btn.addEventListener('click', handleTabClick);
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    SFX.click1();
                    handleTabClick();
                }
            });
        });
    }

    // Helper: Universal Slider Controller (Handles Mouse, Touch, Pointer, and Native Range Input)
    const setupSlider = (sliderBox, nativeInput, onValueChange) => {
        if (!nativeInput) return;

        const updateValue = (rawVal) => {
            const num = Math.min(100, Math.max(0, parseFloat(rawVal) || 0));
            nativeInput.value = num;
            onValueChange(num);
        };

        nativeInput.addEventListener('input', (e) => updateValue(e.target.value));
        nativeInput.addEventListener('change', (e) => updateValue(e.target.value));

        if (sliderBox) {
            let isDragging = false;

            const updateFromPointer = (e) => {
                const rect = sliderBox.getBoundingClientRect();
                if (rect.width <= 0) return;
                const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
                const percent = Math.round((offsetX / rect.width) * 100);
                updateValue(percent);
            };

            sliderBox.addEventListener('pointerdown', (e) => {
                isDragging = true;
                try { sliderBox.setPointerCapture(e.pointerId); } catch (_) {}
                updateFromPointer(e);
            });

            sliderBox.addEventListener('pointermove', (e) => {
                if (isDragging) updateFromPointer(e);
            });

            const stopDragging = (e) => {
                if (isDragging) {
                    isDragging = false;
                    try { sliderBox.releasePointerCapture(e.pointerId); } catch (_) {}
                }
            };

            sliderBox.addEventListener('pointerup', stopDragging);
            sliderBox.addEventListener('pointercancel', stopDragging);
        }

        // Initialize on setup
        updateValue(nativeInput.value || 0);
    };

    // 8. Tab 3: Interactive System Tools (Volume, Brightness, Do Not Disturb, Notes)
    const sysVolSlider = document.getElementById('sysVolSlider');
    const sysVolFill = document.getElementById('sysVolFill');
    const sysVolThumb = document.getElementById('sysVolThumb');
    const sysVolVal = document.getElementById('sysVolVal');
    const sysVolIcon = document.getElementById('sysVolIcon');
    const sysVolBox = sysVolSlider ? sysVolSlider.closest('.tool-slider-box') : null;

    if (sysVolSlider) {
        setupSlider(sysVolBox, sysVolSlider, (val) => {
            const num = Math.round(val);
            if (sysVolVal) sysVolVal.textContent = `${num}%`;
            if (sysVolFill) sysVolFill.style.width = `${val}%`;
            if (sysVolThumb) sysVolThumb.style.left = `calc(7px + (${val} / 100) * (100% - 14px))`;
            if (sysVolIcon) {
                if (num === 0) {
                    sysVolIcon.className = 'fa-solid fa-volume-xmark';
                } else if (num < 50) {
                    sysVolIcon.className = 'fa-solid fa-volume-low';
                } else {
                    sysVolIcon.className = 'fa-solid fa-volume-high';
                }
            }
        });
    }

    const sysBrightSlider = document.getElementById('sysBrightSlider');
    const sysBrightFill = document.getElementById('sysBrightFill');
    const sysBrightThumb = document.getElementById('sysBrightThumb');
    const sysBrightVal = document.getElementById('sysBrightVal');
    const sysBrightBox = sysBrightSlider ? sysBrightSlider.closest('.tool-slider-box') : null;

    if (sysBrightSlider) {
        setupSlider(sysBrightBox, sysBrightSlider, (val) => {
            const num = Math.round(val);
            if (sysBrightVal) sysBrightVal.textContent = `${num}%`;
            if (sysBrightFill) sysBrightFill.style.width = `${val}%`;
            if (sysBrightThumb) sysBrightThumb.style.left = `calc(7px + (${val} / 100) * (100% - 14px))`;
        });
    }

    // Do Not Disturb (No molestar) Toggle Button
    const dndBtn = document.getElementById('dndBtn');
    if (dndBtn) {
        const toggleDnd = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            dndBtn.classList.toggle('active');
            updateDndSubText();
        };

        dndBtn.addEventListener('click', toggleDnd);
        dndBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDnd(e);
            }
        });
    }

    // 9. Tab 4: Interactive Music Player (Soundtrack 01, Audio playback, Seek bar, Volume)
    const bgMusicAudio = document.getElementById('bgMusicAudio');
    const musicPlayPauseBtn = document.getElementById('musicPlayPauseBtn');
    const musicPlayIcon = document.getElementById('musicPlayIcon');
    const musicSeekSlider = document.getElementById('musicSeekSlider');
    const musicProgressFill = document.getElementById('musicProgressFill');
    const musicSeekThumb = document.getElementById('musicSeekThumb');
    const musicCurrentTime = document.getElementById('musicCurrentTime');
    const musicTotalTime = document.getElementById('musicTotalTime');
    const musicVolSlider = document.getElementById('musicVolSlider');
    const musicVolFill = document.getElementById('musicVolFill');
    const musicVolThumb = document.getElementById('musicVolThumb');
    const musicVolVal = document.getElementById('musicVolVal');

    const formatAudioTime = (seconds) => {
        if (isNaN(seconds) || seconds === Infinity || seconds < 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (bgMusicAudio) {
        bgMusicAudio.volume = 0.6;

        if (musicPlayPauseBtn) {
            musicPlayPauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (bgMusicAudio.paused) {
                    const playPromise = bgMusicAudio.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            if (musicPlayIcon) musicPlayIcon.className = 'fa-solid fa-pause';
                            musicPlayPauseBtn.classList.add('playing');
                        }).catch(err => {
                            console.warn('Audio play prevented:', err);
                        });
                    }
                } else {
                    bgMusicAudio.pause();
                    if (musicPlayIcon) musicPlayIcon.className = 'fa-solid fa-play';
                    musicPlayPauseBtn.classList.remove('playing');
                }
            });
        }

        const handleDuration = () => {
            if (bgMusicAudio.duration && !isNaN(bgMusicAudio.duration) && musicTotalTime) {
                musicTotalTime.textContent = formatAudioTime(bgMusicAudio.duration);
            }
        };

        bgMusicAudio.addEventListener('loadedmetadata', handleDuration);
        bgMusicAudio.addEventListener('durationchange', handleDuration);
        bgMusicAudio.addEventListener('canplay', handleDuration);

        let isSeekingMusic = false;

        bgMusicAudio.addEventListener('timeupdate', () => {
            if (!isSeekingMusic && bgMusicAudio.duration) {
                const current = bgMusicAudio.currentTime;
                const duration = bgMusicAudio.duration;
                const percent = (current / duration) * 100;

                if (musicCurrentTime) musicCurrentTime.textContent = formatAudioTime(current);
                if (musicTotalTime && (musicTotalTime.textContent === '00:00' || musicTotalTime.textContent === '--:--')) {
                    musicTotalTime.textContent = formatAudioTime(duration);
                }
                if (musicProgressFill) musicProgressFill.style.width = `${percent}%`;
                if (musicSeekSlider) musicSeekSlider.value = percent;
                if (musicSeekThumb) musicSeekThumb.style.left = `calc(7px + (${percent} / 100) * (100% - 14px))`;
            }
        });

        bgMusicAudio.addEventListener('ended', () => {
            if (musicPlayIcon) musicPlayIcon.className = 'fa-solid fa-play';
            if (musicPlayPauseBtn) musicPlayPauseBtn.classList.remove('playing');
            bgMusicAudio.currentTime = 0;
            if (musicCurrentTime) musicCurrentTime.textContent = '00:00';
            if (musicProgressFill) musicProgressFill.style.width = '0%';
            if (musicSeekSlider) musicSeekSlider.value = 0;
            if (musicSeekThumb) musicSeekThumb.style.left = `calc(7px + 0 * (100% - 14px))`;
        });

        const musicSeekBox = musicSeekSlider ? musicSeekSlider.closest('.tool-slider-box') : null;
        if (musicSeekSlider) {
            setupSlider(musicSeekBox, musicSeekSlider, (percent) => {
                if (bgMusicAudio.duration) {
                    const target = (percent / 100) * bgMusicAudio.duration;
                    bgMusicAudio.currentTime = target;
                    if (musicCurrentTime) musicCurrentTime.textContent = formatAudioTime(target);
                }
                if (musicProgressFill) musicProgressFill.style.width = `${percent}%`;
                if (musicSeekThumb) musicSeekThumb.style.left = `calc(7px + (${percent} / 100) * (100% - 14px))`;
            });
        }

        const musicVolBox = musicVolSlider ? musicVolSlider.closest('.tool-slider-box') : null;
        if (musicVolSlider) {
            setupSlider(musicVolBox, musicVolSlider, (val) => {
                const num = Math.round(val);
                if (musicVolVal) musicVolVal.textContent = `${num}%`;
                if (musicVolFill) musicVolFill.style.width = `${val}%`;
                if (musicVolThumb) musicVolThumb.style.left = `calc(7px + (${val} / 100) * (100% - 14px))`;
                bgMusicAudio.volume = num / 100;
            });
        }
    }

    // 8. Gallery Showcase & Lightbox Handler
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightboxModal = document.getElementById('galleryLightbox');
    const lightboxTrack = document.getElementById('lightboxTrack');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxTag = document.getElementById('lightboxTag');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
    const lightboxNextBtn = document.getElementById('lightboxNextBtn');

    const galleryData = [
        {
            tagKey: 'gallery_item1_tag',
            titleKey: 'gallery_item1_title',
            descKey: 'gallery_item1_desc'
        },
        {
            tagKey: 'gallery_item2_tag',
            titleKey: 'gallery_item2_title',
            descKey: 'gallery_item2_desc'
        },
        {
            tagKey: 'gallery_item3_tag',
            titleKey: 'gallery_item3_title',
            descKey: 'gallery_item3_desc'
        },
        {
            tagKey: 'gallery_item4_tag',
            titleKey: 'gallery_item4_title',
            descKey: 'gallery_item4_desc'
        },
        {
            tagKey: 'gallery_item5_tag',
            titleKey: 'gallery_item5_title',
            descKey: 'gallery_item5_desc'
        },
        {
            tagKey: 'gallery_item6_tag',
            titleKey: 'gallery_item6_title',
            descKey: 'gallery_item6_desc'
        },
        {
            tagKey: 'gallery_item7_tag',
            titleKey: 'gallery_item7_title',
            descKey: 'gallery_item7_desc'
        },
        {
            tagKey: 'gallery_item8_tag',
            titleKey: 'gallery_item8_title',
            descKey: 'gallery_item8_desc'
        }
    ];

    let currentGalleryIdx = 0;

    updateLightboxContent = (animate = false) => {
        if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
        const item = galleryData[currentGalleryIdx];
        if (!item) return;

        if (lightboxTrack) {
            if (!animate) {
                lightboxTrack.style.transition = 'none';
            } else {
                lightboxTrack.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
            }
            lightboxTrack.style.transform = `translateX(-${currentGalleryIdx * 100}%)`;
            if (!animate) {
                void lightboxTrack.offsetWidth;
                lightboxTrack.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        }

        const dict = translations[currentLang] || translations.es;
        if (animate && lightboxCaption) {
            lightboxCaption.classList.add('slide-fade');
            setTimeout(() => {
                if (lightboxTag) lightboxTag.innerHTML = dict[item.tagKey] || '';
                if (lightboxTitle) lightboxTitle.innerHTML = dict[item.titleKey] || '';
                if (lightboxDesc) lightboxDesc.innerHTML = dict[item.descKey] || '';
                if (lightboxCounter) lightboxCounter.textContent = `${currentGalleryIdx + 1} / ${galleryData.length}`;
                lightboxCaption.classList.remove('slide-fade');
            }, 120);
        } else {
            if (lightboxTag) lightboxTag.innerHTML = dict[item.tagKey] || '';
            if (lightboxTitle) lightboxTitle.innerHTML = dict[item.titleKey] || '';
            if (lightboxDesc) lightboxDesc.innerHTML = dict[item.descKey] || '';
            if (lightboxCounter) lightboxCounter.textContent = `${currentGalleryIdx + 1} / ${galleryData.length}`;
        }
    };

    const openLightbox = (idx, animate = false) => {
        currentGalleryIdx = (idx + galleryData.length) % galleryData.length;
        if (lightboxModal) {
            const isAlreadyActive = lightboxModal.classList.contains('active');
            if (!isAlreadyActive) {
                SFX.juegoAbrir();
                lightboxModal.classList.add('active');
                lightboxModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                updateLightboxContent(false);
            } else {
                updateLightboxContent(animate);
            }
        }
    };

    const closeLightbox = () => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            SFX.click2();
            lightboxModal.classList.remove('active');
            lightboxModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    if (galleryCards.length > 0) {
        galleryCards.forEach(card => {
            const idx = parseInt(card.getAttribute('data-gallery-index'), 10);
            card.addEventListener('click', () => openLightbox(idx, false));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(idx, false);
                }
            });
        });
    }

    if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
    }

    if (lightboxPrevBtn) {
        lightboxPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            SFX.click1();
            openLightbox(currentGalleryIdx - 1, true);
        });
    }

    if (lightboxNextBtn) {
        lightboxNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            SFX.click1();
            openLightbox(currentGalleryIdx + 1, true);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            openLightbox(currentGalleryIdx - 1, true);
        } else if (e.key === 'ArrowRight') {
            openLightbox(currentGalleryIdx + 1, true);
        }
    });

    // Touch swipe support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    const lightboxViewport = document.querySelector('.lightbox-viewport');
    if (lightboxViewport) {
        lightboxViewport.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxViewport.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diffX = touchEndX - touchStartX;
            if (Math.abs(diffX) > 40) {
                if (diffX < 0) {
                    openLightbox(currentGalleryIdx + 1, true);
                } else {
                    openLightbox(currentGalleryIdx - 1, true);
                }
            }
        }, { passive: true });
    }

});
