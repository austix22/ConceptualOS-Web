/**
 * Conceptual Live Wallpaper - Native Particle Engine & Interactive Settings Controller
 * Ported directly from Android Studio Project (AmbientParticleEngine.kt & MainActivity.kt)
 * Official Developer: Austin González (ConceptualOS)
 */

(function () {
    'use strict';

    // Definiciones de Estilos y Paletas Oficiales exactas a las tarjetas informativas
    const STYLE_DATA = {
        gamer: {
            id: 'gamer',
            nameEs: 'Gamer',
            nameEn: 'Gamer',
            symbols: ['A', 'B', 'X', 'Y', '△', '○', '□', '×'],
            colors: ['#00e676', '#ff5f56', '#3b82f6', '#f59e0b', '#ec4899', '#00f0a0', '#ff4568', '#00a4ef']
        },
        stardust: {
            id: 'stardust',
            nameEs: 'Polvo Estelar & Galaxia',
            nameEn: 'Stardust & Galaxy',
            symbols: ['★', '✦', '✧', '✵', '✶', '✸'],
            colors: ['#e879f9', '#a855f7', '#6366f1'] // 3 tonos de la tarjeta: Nebulosa lila, Violeta cósmico, Índigo galáctico
        },
        code: {
            id: 'code',
            nameEs: 'Código',
            nameEn: 'Code',
            symbols: ['0', '1', '</>', '{ }', '[ ]', 'λ', 'π', '&&', '||', ';'],
            colors: ['#00ff66', '#10b981', '#22c55e'] // 3 tonos de la tarjeta: Matrix Neón, Matrix Clásico, Matrix Oscuro
        },
        runes: {
            id: 'runes',
            nameEs: 'Runas Místicas',
            nameEn: 'Mystic Runes',
            symbols: ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚷ', 'ᛗ'],
            colors: ['#38bdf8', '#0284c7', '#e2e8f0'] // 3 tonos de la tarjeta: Brillo arcano, Magia nórdica, Piedra ancestral
        },
        kanji: {
            id: 'kanji',
            nameEs: 'Kanjis & Bushido',
            nameEn: 'Kanjis & Bushido',
            symbols: ['義', '勇', '仁', '礼', '誠', '名', '忠', '信', '智', '忍', '克', '和'],
            colors: ['#ff5a79', '#ff1e42', '#be123c'] // 3 tonos de la tarjeta: Rojo claro/neón, Rojo carmesí, Rojo rubí
        }
    };

    // Colores oficiales icónicos para el estilo Gamer
    // Botones Xbox: A (verde), B (rojo), Y (amarillo), X (azul)
    // Botones PlayStation: △ (verde), ○ (rojo), × (azul celeste), □ (rosa magenta)
    const GAMER_OFFICIAL_COLORS = {
        'A': '#00e676', // Xbox Verde
        'B': '#ff5f56', // Xbox Rojo
        'Y': '#f59e0b', // Xbox Amarillo
        'X': '#3b82f6', // Xbox Azul
        '△': '#00f0a0', // PlayStation Triángulo (Verde / Menta)
        '○': '#ff4568', // PlayStation Círculo (Rojo / Coral)
        '×': '#00a4ef', // PlayStation Cruz / X (Azul celeste)
        '□': '#ec4899', // PlayStation Cuadrado (Rosa / Magenta)
        '+': '#00a4ef'
    };

    const BG_COLORS = {
        dark: '#0F111A',
        black: '#000000',
        navy: '#0A1128'
    };

    // Default configuration matching Android app SharedPreferences
    const DEFAULT_CONFIG = {
        style: 'gamer',
        count: 45,
        paletteMode: 'official', // 'official', 'custom'
        isGrayscale: false,
        customColorsCount: 3,
        customColors: ['#00E5FF', '#FF4081', '#FFD700', '#7C4DFF', '#00E676'],
        bgColor: 'dark',
        speedMultiplier: 1.0,
        movementMode: 'random', // 'random', 'vertical'
        isRotationEnabled: true
    };

    /**
     * Motor de Renderizado Nativo Canvas Ultra-Nítido
     * Idéntico a AmbientParticleEngine.kt
     */
    class AmbientParticleEngine {
        constructor(canvas, config) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d', { alpha: false });
            this.config = Object.assign({}, DEFAULT_CONFIG, config);

            this.particles = [];
            this.time = 0;
            this.lastTimestamp = performance.now();
            this.animationFrameId = null;

            this.initParticles();
            this.setupCanvasSize();
            this.bindEvents();
            this.start();
        }

        setupCanvasSize() {
            const rect = this.canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Subpixel crispness
            this.width = rect.width || 340;
            this.height = rect.height || 736;

            this.canvas.width = Math.round(this.width * dpr);
            this.canvas.height = Math.round(this.height * dpr);
            this.dpr = dpr;
        }

        initParticles() {
            this.particles = [];
            const style = STYLE_DATA[this.config.style] || STYLE_DATA.gamer;
            const symbols = style.symbols;
            const officialColors = style.colors;

            const activeCustom = (this.config.customColors || []).slice(0, this.config.customColorsCount || 3);

            for (let i = 0; i < this.config.count; i++) {
                const symbol = symbols[Math.floor(Math.random() * symbols.length)];

                let colorHex;
                if (this.config.paletteMode === 'custom' && activeCustom.length > 0) {
                    colorHex = activeCustom[Math.floor(Math.random() * activeCustom.length)];
                } else if (this.config.style === 'gamer' && GAMER_OFFICIAL_COLORS[symbol]) {
                    // Colores oficiales asignados específicamente a cada botón de consola
                    colorHex = GAMER_OFFICIAL_COLORS[symbol];
                } else {
                    colorHex = officialColors[Math.floor(Math.random() * officialColors.length)];
                }

                // Tamaño variado y sutil, equiparable a las letras de la interfaz del móvil (aprox 12px - 18px)
                const sizeFactor = Math.random();

                this.particles.push({
                    x: Math.random(),
                    y: Math.random(),
                    sizeFactor: sizeFactor,
                    alpha: Math.floor(Math.random() * 70 + 185) / 255, // 0.72 a 1.0
                    symbol: symbol,
                    directionX: (Math.random() * 2 - 1) * 0.008,
                    directionY: (Math.random() * 2 - 1) * 0.008,
                    color: colorHex,
                    rotationSpeed: (Math.random() * 2 - 1) * 0.8
                });
            }
        }

        updateConfig(newConfig) {
            const needsReinit =
                newConfig.count !== this.config.count ||
                newConfig.style !== this.config.style ||
                newConfig.paletteMode !== this.config.paletteMode ||
                JSON.stringify(newConfig.customColors) !== JSON.stringify(this.config.customColors) ||
                newConfig.customColorsCount !== this.config.customColorsCount;

            this.config = Object.assign({}, this.config, newConfig);

            if (needsReinit) {
                this.initParticles();
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => {
                this.setupCanvasSize();
            });
        }

        draw() {
            const ctx = this.ctx;
            const w = this.canvas.width;
            const h = this.canvas.height;
            const dpr = this.dpr || 1;

            // 1. Fondo de pantalla
            const bgHex = BG_COLORS[this.config.bgColor] || BG_COLORS.dark;
            ctx.fillStyle = bgHex;
            ctx.fillRect(0, 0, w, h);

            const effTime = this.time * this.config.speedMultiplier;
            const isGrayscale = !!this.config.isGrayscale;
            const grayscaleColor = '#E5E5E5';
            const movementMode = this.config.movementMode;
            const isRotationEnabled = this.config.isRotationEnabled;

            ctx.save();
            ctx.scale(dpr, dpr);

            const screenWidth = this.width;
            const screenHeight = this.height;

            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];

                // Fórmulas exactas de deriva nativa en AmbientParticleEngine.kt
                let driftX, driftY;
                if (movementMode === 'vertical') {
                    driftX = p.x;
                    driftY = (p.y - (effTime * 0.012)) % 1.0;
                } else {
                    driftX = (p.x + (effTime * p.directionX)) % 1.0;
                    driftY = (p.y + (effTime * p.directionY)) % 1.0;
                }

                const drawX = driftX * screenWidth;
                const drawY = driftY * screenHeight;

                const activeColor = isGrayscale ? grayscaleColor : p.color;
                // Partículas del tamaño de las letras con sutil variación proporcional (aprox 12px a 18px)
                const fontSize = Math.round(screenWidth * (0.036 + p.sizeFactor * 0.018));

                ctx.save();
                ctx.translate(drawX, drawY);

                if (isRotationEnabled) {
                    // Giro fluido en grados idéntico a Android
                    const rotationAngleDeg = (effTime * p.rotationSpeed * 25.0) % 360.0;
                    ctx.rotate((rotationAngleDeg * Math.PI) / 180.0);
                }

                ctx.globalAlpha = p.alpha;

                if (p.symbol === '△') {
                    // Triángulo equilátero perfecto (todos sus 3 lados miden exactamente igual)
                    const s = fontSize * 0.95;
                    const h = s * (Math.sqrt(3) / 2); // Altura equilátera exacta: h = s * √3 / 2 (~0.866s)
                    const topY = -h * (2 / 3);
                    const botY = h / 3;
                    const halfS = s / 2;

                    ctx.beginPath();
                    ctx.moveTo(0, topY);
                    ctx.lineTo(halfS, botY);
                    ctx.lineTo(-halfS, botY);
                    ctx.closePath();

                    ctx.strokeStyle = activeColor;
                    ctx.lineWidth = Math.max(1.8, fontSize * 0.13);
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';
                    ctx.stroke();
                } else {
                    ctx.fillStyle = activeColor;
                    ctx.font = `bold ${fontSize}px "Outfit", "Plus Jakarta Sans", "Segoe UI Symbol", sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(p.symbol, 0, 0);
                }

                ctx.restore();
            }

            ctx.restore();
        }

        renderLoop(timestamp) {
            const deltaMs = Math.min(timestamp - this.lastTimestamp, 64);
            this.lastTimestamp = timestamp;

            // En Android time += 0.016f cada frame de ~60hz
            this.time += (deltaMs / 1000) * 1.0;

            this.draw();

            this.animationFrameId = requestAnimationFrame((ts) => this.renderLoop(ts));
        }

        start() {
            if (!this.animationFrameId) {
                this.lastTimestamp = performance.now();
                this.animationFrameId = requestAnimationFrame((ts) => this.renderLoop(ts));
            }
        }

        stop() {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }
    }

    /**
     * Controlador UI para el Diálogo de Opciones (MainActivity.kt)
     */
    class WallpaperUIController {
        constructor(engine) {
            this.engine = engine;
            this.config = Object.assign({}, engine.config);
            this.editingColorIndex = 0;

            this.loadSavedConfig();
            this.cacheElements();
            this.bindEvents();
            this.updateAllSubtitles();
            this.updateClock();
            setInterval(() => this.updateClock(), 30000);
        }

        loadSavedConfig() {
            try {
                const saved = localStorage.getItem('cos_wp_config');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    this.config = Object.assign({}, this.config, parsed);
                    this.engine.updateConfig(this.config);
                }
            } catch (e) {
                console.warn('Error loading saved wallpaper config', e);
            }
        }

        saveConfig() {
            try {
                localStorage.setItem('cos_wp_config', JSON.stringify(this.config));
            } catch (e) {
                console.warn('Error saving wallpaper config', e);
            }
        }

        cacheElements() {
            this.modal = document.getElementById('wpConfigModal');
            this.openBtn = document.getElementById('openWpConfigModalBtn');
            this.closeBtn = document.getElementById('wpConfigModalCloseBtn');
            this.liveTimeEl = document.getElementById('wpLiveTime');

            // Category Subtitle labels in the 7 cards
            this.subStyle = document.getElementById('wpValStyle');
            this.subCount = document.getElementById('wpValCount');
            this.subPalette = document.getElementById('wpValPalette');
            this.subBg = document.getElementById('wpValBg');
            this.subSpeed = document.getElementById('wpValSpeed');
            this.subDirection = document.getElementById('wpValDirection');
            this.subRotation = document.getElementById('wpValRotation');

            // Color customization containers
            this.customColorSection = document.getElementById('wpCustomColorSection');
            this.colorSlotsContainer = document.getElementById('wpColorSlotsRow');
            this.colorCountChips = document.querySelectorAll('.wp-count-chip');
            this.neonColorDots = document.querySelectorAll('.wp-neon-dot');
            this.nativeColorPicker = document.getElementById('wpNativeColorPicker');
        }

        updateClock() {
            if (!this.liveTimeEl) return;
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');
            this.liveTimeEl.textContent = `${h}:${m}`;
        }

        bindEvents() {
            // Category Card Accordion Toggle
            const catCards = document.querySelectorAll('.wp-cat-card');
            catCards.forEach((card) => {
                const header = card.querySelector('.wp-cat-header');
                if (!header) return;
                header.addEventListener('click', () => {
                    const isExpanded = card.classList.contains('expanded');
                    // Opcional: Acordeón exclusivo (cierra los otros)
                    catCards.forEach((c) => {
                        if (c !== card) c.classList.remove('expanded');
                    });
                    if (!isExpanded) {
                        card.classList.add('expanded');
                    } else {
                        card.classList.remove('expanded');
                    }
                    if (window.SFX && typeof window.SFX.click1 === 'function') {
                        window.SFX.click1();
                    }
                });
            });

            // Option item selection (Radio buttons)
            const optionItems = document.querySelectorAll('.wp-opt-item');
            optionItems.forEach((opt) => {
                opt.addEventListener('click', (e) => {
                    const group = opt.getAttribute('data-group');
                    const val = opt.getAttribute('data-value');
                    this.applyOptionChange(group, val, opt);
                });
            });

            // Chips para cantidad de colores personalizados (1 a 5)
            if (this.colorCountChips) {
                this.colorCountChips.forEach((chip) => {
                    chip.addEventListener('click', () => {
                        const count = parseInt(chip.getAttribute('data-count'), 10) || 3;
                        this.config.customColorsCount = count;
                        this.colorCountChips.forEach((c) => c.classList.remove('active'));
                        chip.classList.add('active');
                        this.renderColorSlots();
                        this.engine.updateConfig(this.config);
                        this.saveConfig();
                        this.updateAllSubtitles();
                        if (window.SFX && typeof window.SFX.click1 === 'function') {
                            window.SFX.click1();
                        }
                    });
                });
            }

            // Neon Palette Preset Dots
            if (this.neonColorDots) {
                this.neonColorDots.forEach((dot) => {
                    dot.addEventListener('click', () => {
                        const hex = dot.getAttribute('data-hex');
                        if (hex) {
                            this.setCustomColor(this.editingColorIndex, hex);
                        }
                    });
                });
            }

            // Color picker nativo
            if (this.nativeColorPicker) {
                this.nativeColorPicker.addEventListener('input', (e) => {
                    this.setCustomColor(this.editingColorIndex, e.target.value);
                });
                this.nativeColorPicker.addEventListener('change', (e) => {
                    this.setCustomColor(this.editingColorIndex, e.target.value);
                });
            }

            // Botón Abrir panel multicolor para la bolita enfocada
            const openPickerBtn = document.getElementById('wpOpenColorPickerBtn');
            if (openPickerBtn) {
                openPickerBtn.addEventListener('click', () => {
                    if (this.nativeColorPicker) {
                        const currentColors = this.config.customColors || DEFAULT_CONFIG.customColors;
                        const hex = currentColors[this.editingColorIndex] || '#00E5FF';
                        this.nativeColorPicker.value = hex;
                        this.nativeColorPicker.click();
                    }
                    if (window.SFX && typeof window.SFX.click1 === 'function') {
                        window.SFX.click1();
                    }
                });
            }

            // Quick sync con las tarjetas de la galería (#estilos)
            const styleCards = document.querySelectorAll('.wallpaper-card');
            styleCards.forEach((sc) => {
                sc.addEventListener('click', () => {
                    const style = sc.getAttribute('data-wp-style');
                    const mode = sc.getAttribute('data-wp-mode');
                    if (mode === 'mono') {
                        this.applyOptionChange('palette', 'monochrome');
                    } else if (style) {
                        this.applyOptionChange('style', style);
                        this.applyOptionChange('palette', 'official');
                    }
                });
            });

            // Botón Establecer Fondo en Vivo en el teléfono
            const applyBtn = document.getElementById('wpApplyToPhoneBtn');
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    this.engine.updateConfig(this.config);
                    this.saveConfig();

                    const phoneBezel = document.querySelector('.wp-phone-bezel');
                    if (phoneBezel) {
                        phoneBezel.classList.remove('wp-applied-flash');
                        void phoneBezel.offsetWidth;
                        phoneBezel.classList.add('wp-applied-flash');
                    }

                    if (typeof closePluginModal === 'function') {
                        closePluginModal('wpConfigModal');
                    }

                    if (window.SFX && typeof window.SFX.click1 === 'function') {
                        window.SFX.click1();
                    }
                });
            }
        }

        applyOptionChange(group, val, optElement) {
            let needsUpdate = false;

            switch (group) {
                case 'style':
                    this.config.style = val;
                    needsUpdate = true;
                    break;
                case 'count':
                    this.config.count = parseInt(val, 10) || 45;
                    needsUpdate = true;
                    break;
                case 'palette':
                    if (val === 'monochrome') {
                        this.config.isGrayscale = true;
                    } else if (val === 'custom') {
                        this.config.isGrayscale = false;
                        this.config.paletteMode = 'custom';
                    } else {
                        this.config.isGrayscale = false;
                        this.config.paletteMode = 'official';
                    }
                    needsUpdate = true;
                    break;
                case 'bg':
                    this.config.bgColor = val;
                    needsUpdate = true;
                    break;
                case 'speed':
                    this.config.speedMultiplier = parseFloat(val) || 1.0;
                    needsUpdate = true;
                    break;
                case 'direction':
                    this.config.movementMode = val;
                    needsUpdate = true;
                    break;
                case 'rotation':
                    this.config.isRotationEnabled = val === 'true';
                    needsUpdate = true;
                    break;
            }

            if (needsUpdate) {
                // Update active state in UI
                const groupItems = document.querySelectorAll(`.wp-opt-item[data-group="${group}"]`);
                groupItems.forEach((item) => {
                    const itemVal = item.getAttribute('data-value');
                    if (itemVal === val) {
                        item.classList.add('active');
                        item.setAttribute('aria-checked', 'true');
                    } else {
                        item.classList.remove('active');
                        item.setAttribute('aria-checked', 'false');
                    }
                });

                // Mostrar/Ocultar sección de colores personalizados
                if (group === 'palette') {
                    if (this.customColorSection) {
                        if (this.config.paletteMode === 'custom' && !this.config.isGrayscale) {
                            this.customColorSection.style.display = 'block';
                            this.renderColorSlots();
                        } else {
                            this.customColorSection.style.display = 'none';
                        }
                    }
                }

                this.engine.updateConfig(this.config);
                this.saveConfig();
                this.updateAllSubtitles();

                if (window.SFX && typeof window.SFX.click1 === 'function') {
                    window.SFX.click1();
                }
            }
        }

        renderColorSlots() {
            if (!this.colorSlotsContainer) return;
            this.colorSlotsContainer.innerHTML = '';
            const count = this.config.customColorsCount || 3;
            const currentColors = this.config.customColors || DEFAULT_CONFIG.customColors;

            for (let i = 0; i < count; i++) {
                const hex = currentColors[i] || DEFAULT_CONFIG.customColors[i] || '#00E5FF';
                const slot = document.createElement('button');
                slot.type = 'button';
                slot.className = `wp-color-slot ${i === this.editingColorIndex ? 'active' : ''}`;
                slot.style.backgroundColor = hex;
                slot.setAttribute('title', `Editar Color #${i + 1} (${hex})`);
                slot.setAttribute('aria-label', `Color ${i + 1}`);

                // Bolita limpia de color (sin icono de lápiz)
                slot.innerHTML = '';

                slot.addEventListener('click', () => {
                    this.editingColorIndex = i;
                    document.querySelectorAll('.wp-color-slot').forEach((s, idx) => {
                        s.classList.toggle('active', idx === i);
                    });
                    if (window.SFX && typeof window.SFX.click1 === 'function') {
                        window.SFX.click1();
                    }
                });

                this.colorSlotsContainer.appendChild(slot);
            }
        }

        setCustomColor(index, hex) {
            if (!this.config.customColors) {
                this.config.customColors = [...DEFAULT_CONFIG.customColors];
            }
            this.config.customColors[index] = hex;
            this.renderColorSlots();
            this.engine.updateConfig(this.config);
            this.saveConfig();
            this.updateAllSubtitles();
        }

        updateAllSubtitles() {
            const isEs = (document.documentElement.lang || 'en').startsWith('es');

            // 1. Estilo
            if (this.subStyle) {
                const s = STYLE_DATA[this.config.style] || STYLE_DATA.gamer;
                this.subStyle.textContent = isEs ? s.nameEs : s.nameEn;
            }

            // 2. Cantidad
            if (this.subCount) {
                const c = this.config.count;
                if (c === 20) this.subCount.textContent = isEs ? 'Sutil' : 'Subtle';
                else if (c === 70) this.subCount.textContent = isEs ? 'Densa' : 'Dense';
                else this.subCount.textContent = isEs ? 'Balanceada' : 'Balanced';
            }

            // 3. Paleta
            if (this.subPalette) {
                if (this.config.isGrayscale) {
                    this.subPalette.textContent = isEs ? 'Monocromo (Gris)' : 'Monochrome (Grayscale)';
                } else if (this.config.paletteMode === 'custom') {
                    const count = this.config.customColorsCount || 3;
                    this.subPalette.textContent = isEs
                        ? `Personalizado (${count} Colores)`
                        : `Custom (${count} Colors)`;
                } else {
                    this.subPalette.textContent = isEs ? 'Paleta Oficial del Estilo' : 'Official Style Palette';
                }
            }

            // 4. Color de Fondo
            if (this.subBg) {
                const bg = this.config.bgColor;
                if (bg === 'black') this.subBg.textContent = isEs ? 'Negro (AMOLED)' : 'Black (AMOLED)';
                else if (bg === 'navy') this.subBg.textContent = isEs ? 'Azul Noche' : 'Navy Blue';
                else this.subBg.textContent = isEs ? 'Oscuro' : 'Dark';
            }

            // 5. Velocidad
            if (this.subSpeed) {
                const sp = this.config.speedMultiplier;
                if (sp === 0.5) this.subSpeed.textContent = isEs ? 'Lenta (0.5X)' : 'Slow (0.5X)';
                else if (sp === 2.0) this.subSpeed.textContent = isEs ? 'Rápida (2.0X)' : 'Fast (2.0X)';
                else this.subSpeed.textContent = isEs ? 'Normal (1.0X)' : 'Normal (1.0X)';
            }

            // 6. Dirección
            if (this.subDirection) {
                const dir = this.config.movementMode;
                this.subDirection.textContent =
                    dir === 'vertical' ? 'Vertical' : isEs ? 'Aleatorio' : 'Random';
            }

            // 7. Rotación
            if (this.subRotation) {
                const rot = this.config.isRotationEnabled;
                this.subRotation.textContent = rot
                    ? isEs
                        ? 'Activado'
                        : 'Enabled'
                    : isEs
                    ? 'Desactivado'
                    : 'Disabled';
            }

            // Sincronizar radio buttons activos
            this.syncRadioButtons();
        }

        syncRadioButtons() {
            // Style
            document.querySelectorAll('.wp-opt-item[data-group="style"]').forEach((el) => {
                el.classList.toggle('active', el.getAttribute('data-value') === this.config.style);
            });
            // Count
            document.querySelectorAll('.wp-opt-item[data-group="count"]').forEach((el) => {
                el.classList.toggle('active', parseInt(el.getAttribute('data-value'), 10) === this.config.count);
            });
            // Palette
            const activePalValue = this.config.isGrayscale
                ? 'monochrome'
                : this.config.paletteMode === 'custom'
                ? 'custom'
                : 'official';
            document.querySelectorAll('.wp-opt-item[data-group="palette"]').forEach((el) => {
                el.classList.toggle('active', el.getAttribute('data-value') === activePalValue);
            });
            if (this.customColorSection) {
                this.customColorSection.style.display = activePalValue === 'custom' ? 'block' : 'none';
            }
            // BG
            document.querySelectorAll('.wp-opt-item[data-group="bg"]').forEach((el) => {
                el.classList.toggle('active', el.getAttribute('data-value') === this.config.bgColor);
            });
            // Speed
            document.querySelectorAll('.wp-opt-item[data-group="speed"]').forEach((el) => {
                el.classList.toggle('active', parseFloat(el.getAttribute('data-value')) === this.config.speedMultiplier);
            });
            // Direction
            document.querySelectorAll('.wp-opt-item[data-group="direction"]').forEach((el) => {
                el.classList.toggle('active', el.getAttribute('data-value') === this.config.movementMode);
            });
            // Rotation
            document.querySelectorAll('.wp-opt-item[data-group="rotation"]').forEach((el) => {
                el.classList.toggle('active', (el.getAttribute('data-value') === 'true') === this.config.isRotationEnabled);
            });

            // Color Chips
            if (this.colorCountChips) {
                this.colorCountChips.forEach((c) => {
                    c.classList.toggle('active', parseInt(c.getAttribute('data-count'), 10) === this.config.customColorsCount);
                });
            }
        }
    }

    // Inicialización global al cargar el DOM
    document.addEventListener('DOMContentLoaded', () => {
        const phoneCanvas = document.getElementById('wpPhoneCanvas');
        if (!phoneCanvas) return;

        // Ocultar la imagen estática si aún existiera
        const phoneImg = document.getElementById('wpPhoneImg');
        if (phoneImg) phoneImg.style.display = 'none';

        // Crear instancia del motor de renderizado
        const engine = new AmbientParticleEngine(phoneCanvas);

        // Crear controlador de opciones y UI
        const controller = new WallpaperUIController(engine);

        // Exponer globalmente para integraciones
        window.COS_WallpaperEngine = engine;
        window.COS_WallpaperController = controller;

        // Reaccionar al cambio de idioma del sitio web
        const langToggleBtn = document.getElementById('langToggleBtn');
        if (langToggleBtn) {
            langToggleBtn.addEventListener('click', () => {
                setTimeout(() => controller.updateAllSubtitles(), 120);
            });
        }
    });
})();
