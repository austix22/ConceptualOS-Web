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

    // 4. Internationalization (i18n) Engine - ES / EN Language Switcher
    const translations = {
        es: {
            nav_features: "Funciones",
            nav_compat: "Compatibilidad",
            nav_cos_hub: "COS HUB",
            nav_achievements: "Logros",
            nav_faq: "FAQ",
            nav_download: "Descargas",
            nav_kofi: "Ko-fi",
            nav_about: "Acerca de",
            hero_badge: "COS Launcher V1.1.0 Platinum",
            hero_title: 'Tus juegos, <br><span class="gradient-text">en un solo lugar</span>',
            hero_desc: "COS Launcher reúne tus juegos de Android y emuladores en una biblioteca organizada. Disfruta de navegación con controles, logros de RetroAchievements y accesos rápidos durante tus partidas con COS HUB.",
            stat_controls_label: "Navegación con controles",
            stat_achievements_label: "Logros de RetroAchievements",
            stat_hub_label: "Accesos rápidos en partida",
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
            ach_desc: "Desbloquea logros mientras juegas a tus títulos favoritos y mantén tu progreso sincronizado con RetroAchievements. La integración utiliza el motor <strong>rcheevos</strong>.",
            ach_check1: "Sincronización de perfil y lista de logros.",
            ach_check2: "Integración nativa con el motor rcheevos.",
            ach_check3: "Seguimiento de porcentaje completado y puntos acumulados.",
            ach_check4: "Consulta tus logros desbloqueados tanto en el menú como en COS HUB.",
            faq_subtitle: "RESOLVEMOS TUS DUDAS",
            faq_title: "Preguntas Frecuentes",
            faq_desc: "Todo lo que necesitas saber sobre compatibilidad, instalación y funcionamiento de COS Launcher.",
            faq_q1: "¿Qué dispositivos y versiones son compatibles?",
            faq_a1: "COS Launcher es compatible con Android 9.0 (Pie) en adelante, hasta Android 15. Funciona de forma fluida tanto en consolas portátiles dedicadas (Ayn Odin, Retroid Pocket, Anbernic) como en smartphones y tablets Android.",
            faq_q2: "¿Cómo funciona la navegación con controles?",
            faq_a2: "El soporte es 100% nativo. Conecta tu control por Bluetooth o USB-C y navega por toda la interfaz, biblioteca y herramientas de COS HUB utilizando la cruceta, sticks y botones sin requerir aplicaciones externas de mapeo.",
            faq_q3: "¿La aplicación incluye juegos o emuladores?",
            faq_a3: "No. COS Launcher es un organizador de biblioteca e interfaz visual. Debes tener tus propios emuladores y títulos legalmente adquiridos; la app los organiza, descarga sus carátulas y te da accesos rápidos en partida.",
            faq_q4: "¿Es segura la instalación del archivo APK directo?",
            faq_a4: "Sí, totalmente. El APK se descarga directamente desde las publicaciones oficiales compiladas. Es una app 100% libre de publicidad, sin rastreadores ni recopilación de datos invasiva. También está disponible en Google Play Store.",
            dl_title: "Obtén COS Launcher",
            dl_desc: "Descarga COS Launcher en tu dispositivo portátil o teléfono Android.",
            dl_apk_badge: "APK DIRECTO",
            dl_apk_desc: "Descarga el APK e instálalo manualmente.",
            dl_apk_btn: "Descargar APK",
            dl_store_badge: "TIENDA OFICIAL",
            dl_store_desc: "Instala y actualiza la app desde Google Play.",
            dl_store_btn: "Abrir tienda",
            dl_spec_version: "<strong>Versión:</strong> v1.1.0 Platinum",
            dl_spec_req: "<strong>Requisitos:</strong> Android 9.0 o superior",
            dl_spec_updates: "<strong>Actualizaciones:</strong> Automáticas en segundo plano",
            dl_spec_protect: "<strong>Verificación:</strong> Protegido por Google Play Protect",
            dl_trust_ads: "100 % libre de anuncios",
            dl_trust_privacy: "Sin rastreadores invasivos",
            dl_trust_compat: "Optimizado para mandos y portátiles",
            kofi_title: "Apoya el proyecto",
            kofi_desc: "¿Te gusta COS Launcher? Apoya su desarrollo independiente y sus próximas mejoras invitándome a un café en Ko-fi.",
            kofi_btn: "Ko-fi",
            about_title: "Acerca de COS Launcher",
            about_desc: "COS Launcher es una aplicación para Android que organiza juegos y emuladores en una sola biblioteca. Está diseñada para ofrecer una experiencia clara y cómoda, con navegación mediante controles, integración con RetroAchievements, gestión de recursos gráficos y accesos rápidos durante el juego con COS HUB.",
            about_pill1: "Desarrollo independiente",
            about_pill2: "100 % sin anuncios",
            about_pill3: "Compatible con controles",
            footer_rights: "&copy; 2026 COS Launcher. Todos los derechos reservados.",
            footer_created: "Creado por Austin González"
        },
        en: {
            nav_features: "Features",
            nav_compat: "Compatibility",
            nav_cos_hub: "COS HUB",
            nav_achievements: "Achievements",
            nav_faq: "FAQ",
            nav_download: "Downloads",
            nav_kofi: "Ko-fi",
            nav_about: "About",
            hero_badge: "COS Launcher V1.1.0 Platinum",
            hero_title: 'Your games, <br><span class="gradient-text">all in one place</span>',
            hero_desc: "COS Launcher brings your Android games and emulators together in one organized library. Enjoy controller-friendly navigation, RetroAchievements, and quick in-game access with COS HUB.",
            stat_controls_label: "Controller navigation",
            stat_achievements_label: "RetroAchievements System",
            stat_hub_label: "Floating Overlay",
            stat_scraping_label: "Game artwork",
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
            ach_desc: "Unlock achievements as you play your favorite titles and keep your progress in sync with RetroAchievements. The integration is powered by the <strong>rcheevos</strong> engine.",
            ach_check1: "Profile sync and achievement list.",
            ach_check2: "Native integration with the rcheevos engine.",
            ach_check3: "Track completion percentage and earned points.",
            ach_check4: "Check unlocked achievements both in the launcher and COS HUB.",
            faq_subtitle: "EVERYTHING YOU NEED TO KNOW",
            faq_title: "Frequently Asked Questions",
            faq_desc: "Key answers about compatibility, installation, and how COS Launcher works.",
            faq_q1: "Which devices and versions are supported?",
            faq_a1: "COS Launcher supports Android 9.0 (Pie) and newer, up to Android 15. It runs smoothly on both dedicated gaming handhelds (Ayn Odin, Retroid Pocket, Anbernic) and Android smartphones/tablets.",
            faq_q2: "How does controller navigation work?",
            faq_a2: "Controller support is 100% native. Connect your gamepad via Bluetooth or USB-C and navigate the entire UI, game library, and COS HUB using the D-Pad, sticks, and buttons without any button mapping apps.",
            faq_q3: "Does the app include games or emulators?",
            faq_a3: "No. COS Launcher is a visual frontend and library organizer. You need to provide your own legally acquired emulators and games; the app organizes them, downloads artwork, and gives you quick in-game access.",
            faq_q4: "Is installing via the direct APK file safe?",
            faq_a4: "Yes, completely safe. The APK is downloaded directly from official compiled releases. It is 100% ad-free, without trackers or invasive data collection. It is also available on Google Play.",
            dl_title: "Get COS Launcher",
            dl_desc: "Download COS Launcher on your handheld device or Android phone.",
            dl_apk_badge: "DIRECT APK",
            dl_apk_desc: "Download the APK and install it manually.",
            dl_apk_btn: "Download APK",
            dl_store_badge: "OFFICIAL STORE",
            dl_store_desc: "Install and update the app through Google Play.",
            dl_store_btn: "Open store",
            dl_spec_version: "<strong>Version:</strong> v1.1.0 Platinum",
            dl_spec_req: "<strong>Requirements:</strong> Android 9.0 or higher",
            dl_spec_updates: "<strong>Updates:</strong> Automatic in background",
            dl_spec_protect: "<strong>Verification:</strong> Google Play Protect certified",
            dl_trust_ads: "100% ad-free",
            dl_trust_privacy: "No invasive trackers",
            dl_trust_compat: "Optimized for gamepads & handhelds",
            kofi_title: "Support the Project",
            kofi_desc: "Enjoying COS Launcher? Support its independent development and future improvements by buying me a coffee on Ko-fi.",
            kofi_btn: "Ko-fi",
            about_title: "About COS Launcher",
            about_desc: "COS Launcher is an Android app that brings your games and emulators together in one organized library. Designed for a clear, comfortable experience, it offers controller-friendly navigation, RetroAchievements integration, game artwork management, and quick in-game access with COS HUB.",
            about_pill1: "Indie development",
            about_pill2: "100% ad-free",
            about_pill3: "Controller-friendly",
            footer_rights: "&copy; 2026 COS Launcher. All rights reserved.",
            footer_created: "Created by Austin González"
        }
    };

    let currentLang = localStorage.getItem('cos_web_lang') || 'es';

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

});
