class LikeIcon {
    static DEFAULT_CONFIG = {
        // heartFill: '#FF005E',
        heartFill: '#D6426F',
        strokeColor: 'currentColor',
        circleColor: '#C742DE',
        dotsColor: '#FF8FD8',
        size: 25,
        animationDuration: 200
    };

    constructor(element, animationType, config = {}) {
        this.element = element;
        this.config = { ...LikeIcon.DEFAULT_CONFIG, ...config };
        this.animationType = animationType;
        this.isLiked = false;
        
        this.initContainer();
        this.createSVGStructure();
        this.setupEventListeners();
    }

    initContainer() {
        Object.assign(this.element.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
        });
    }

    createSVGStructure() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('viewBox', '0 0 250 250');
        this.svg.style.cssText = `
            width: ${this.config.size}px;
            height: ${this.config.size}px;
            transition: transform ${this.config.animationDuration}ms ease-in-out;
        `;

        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('d', 'M22.95 45.01c20.14,-22.94 54.95,-27.14 79.81,-7.34l19.09 15.2c1.86,1.48 4.42,1.48 6.28,0l19.08 -15.2c24.28,-19.33 59.32,-16.01 79.81,7.33 19.55,22.27 19.17,56.55 -1.59,77.73l-89.65 91.41c-2.95,3.01 -6.58,4.53 -10.79,4.53 -4.22,0 -7.84,-1.52 -10.8,-4.53l-89.64 -91.41c-20.96,-21.38 -21.33,-55.26 -1.6,-77.72z');
        this.path.style.cssText = `
            stroke-width: 12px;
            stroke: ${this.config.strokeColor};
            fill: transparent;
            transition: fill 0.3s ease, stroke 0.3s ease;
        `;

        this.svg.appendChild(this.path);
        this.element.appendChild(this.svg);
    }

    setupEventListeners() {
        this.element.addEventListener('click', () => this.toggleLike());
    }

    toggleLike() {
        this.setLiked(!this.isLiked);
    }

    setLiked(state) {
        if (this.isLiked === state) return;
        this.isLiked = state;
        
        this.updateVisualState();
        this.playScaleAnimation();
        if (this.isLiked && this.animationType === 'circle') {
            this.animateCircleAndDots();
        }
    }

    updateVisualState() {
        this.path.style.fill = this.isLiked ? this.config.heartFill : 'transparent';
        this.path.style.stroke = this.isLiked ? this.config.heartFill : this.config.strokeColor;
        this.svg.classList.toggle('liked', this.isLiked);
    }

    playScaleAnimation() {
        this.svg.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.svg.style.transform = 'scale(1)';
        }, this.config.animationDuration);
    }

    animateCircleAndDots() {
        // Keep original circle animation logic intact
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '190');
        circle.setAttribute('cy', '190');
        circle.setAttribute('r', '0');
        circle.style.stroke = this.config.circleColor;
        circle.style.strokeWidth = '15px';
        circle.style.fill = 'none';
        circle.style.opacity = '1';

        this.svg.appendChild(circle);

        setTimeout(() => {
            circle.setAttribute('r', '80');
            circle.style.opacity = '0';
            circle.style.transition = 'r 0.5s ease, opacity 0.5s ease';
        }, 10);

        setTimeout(() => {
            this.svg.removeChild(circle);
        }, 500);

        // Keep original dots animation logic intact
        const positions = [
            { x: -90, y: -110 },
            { x: 100, y: -110 },
            { x: -80, y: 100 },
            { x: 80, y: 110 },
            { x: -130, y: 30 },
            { x: 130, y: 30 }
        ];

        positions.forEach((pos, index) => {
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', '125');
            dot.setAttribute('cy', '125');
            dot.setAttribute('r', '10');
            dot.style.fill = this.config.dotsColor;
            dot.style.opacity = '0';

            this.svg.appendChild(dot);

            setTimeout(() => {
                dot.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                dot.style.opacity = '1';
                dot.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            }, index * 50);

            setTimeout(() => {
                dot.style.opacity = '0';
                setTimeout(() => {
                    this.svg.removeChild(dot);
                }, 500);
            }, 500);
        });
    }
}

// Initialization
document.querySelectorAll('.like-icon-container').forEach(element => {
    new LikeIcon(element, element.dataset.animation);
});