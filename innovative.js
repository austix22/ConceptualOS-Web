/* ==========================================================================
   COS Launcher - Ultra-Innovative Interactions & 3D Tilt Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Subtle 3D Card Tilt Effect on Mouse Move
    const tiltCards = document.querySelectorAll('.bento-card, .handheld-console, .satellite-chip');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // 2. Handheld Console Screen Quick Interactive Buttons
    const quickLaunchBtn = document.getElementById('consoleQuickLaunch');
    const quickHubBtn = document.getElementById('consoleQuickHub');
    const quickAchBtn = document.getElementById('consoleQuickAch');

    if (quickLaunchBtn) {
        quickLaunchBtn.addEventListener('click', () => {
            const gameTitle = document.querySelector('.console-game-meta h3');
            if (gameTitle) {
                gameTitle.style.transform = 'scale(1.08)';
                setTimeout(() => gameTitle.style.transform = '', 300);
            }
        });
    }

    if (quickHubBtn) {
        quickHubBtn.addEventListener('click', () => {
            const hubSection = document.getElementById('neural-overlay');
            if (hubSection) {
                hubSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (quickAchBtn) {
        quickAchBtn.addEventListener('click', () => {
            const achSection = document.getElementById('achievements');
            if (achSection) {
                achSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 3. Interactive Device Selector Filter in Compatibility Section
    const deviceChips = document.querySelectorAll('.device-chip');
    if (deviceChips.length > 0) {
        deviceChips.forEach(chip => {
            chip.addEventListener('click', () => {
                deviceChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            });
        });
    }

    // 4. Keyboard Arrow Navigation Support (Web Gamepad Simulation)
    document.addEventListener('keydown', (e) => {
        // Only trigger if no inputs/modals are active
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        const lightboxActive = document.querySelector('.gallery-lightbox.active');
        if (lightboxActive) return;

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            // Soft tactile feedback
            const sfx = window.playClick1Throttled;
            if (typeof sfx === 'function') sfx();
        }
    });

});
