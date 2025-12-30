window.addEventListener('message', (event) => {
    const data = event.data;
    const container = document.getElementById('container');

    // Better structure:
    if (data.type === 'toggle') {
        container.style.opacity = data.show ? '1' : '0';
    }

    if (data.type === 'updateStyle') {
        if (data.ammoColor) {
            document.getElementById('ammo-clip').style.color = data.ammoColor;
            document.getElementById('ammo-clip').style.textShadow = `0 0 15px ${data.ammoColor}`;
        }

        if (data.progressColor) {
            document.documentElement.style.setProperty('--progress-color', data.progressColor);
        }
    }

    if (data.type === 'update') {
        // Positioning
        const x = (data.x * 100) + 10;
        const y = (data.y * 100) - 10;

        container.style.left = x + '%';
        container.style.top = y + '%';

        // Ammo
        const ammoClip = data.ammoClip;
        const maxClip = data.maxClip;

        document.getElementById('ammo-clip').innerText = ammoClip;

        // Segmented Bar Logic
        const barContainer = document.getElementById('ammo-bar-container');
        const currentMax = parseInt(barContainer.getAttribute('data-max') || '0');

        const MAX_SEGMENTS = 50;
        let segmentsToCreate = maxClip;
        if (maxClip > MAX_SEGMENTS) {
            segmentsToCreate = MAX_SEGMENTS;
        }

        if (currentMax !== maxClip) {
            barContainer.innerHTML = '';
            barContainer.setAttribute('data-max', maxClip);
            for (let i = 0; i < segmentsToCreate; i++) {
                const seg = document.createElement('div');
                seg.classList.add('segment');
                barContainer.appendChild(seg);
            }
        }

        const children = barContainer.children;
        const totalSegments = children.length;
        const isLowAmmo = (ammoClip / maxClip) < 0.25;

        // Calculate how many segments should be lit
        let activeSegments = ammoClip;
        if (maxClip > MAX_SEGMENTS) {
            activeSegments = Math.ceil((ammoClip / maxClip) * MAX_SEGMENTS);
        }

        for (let i = 0; i < totalSegments; i++) {
            const seg = children[i];
            if (i < activeSegments) {
                seg.classList.add('active');
                if (isLowAmmo) {
                    seg.classList.add('low-ammo');
                } else {
                    seg.classList.remove('low-ammo');
                }
            } else {
                seg.classList.remove('active');
                seg.classList.remove('low-ammo');
            }
        }
    }
});
