// js/ads-manager.js
class AdsManager {
    constructor() {
        this.adContainers = document.querySelectorAll('.ad-container');
        this.init();
    }

    init() {
        this.observeAdContainers();
        this.handleAdErrors();
    }

    observeAdContainers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadAd(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.adContainers.forEach(container => {
            observer.observe(container);
        });
    }

    loadAd(container) {
        // AdSense automatically loads ads, but we can add loading states
        container.classList.add('ad-loading');
        
        // Remove loading state after a delay (AdSense doesn't provide callbacks)
        setTimeout(() => {
            container.classList.remove('ad-loading');
        }, 2000);
    }

    handleAdErrors() {
        // Monitor for ad errors and handle gracefully
        window.addEventListener('error', (e) => {
            if (e.target.tagName === 'INS' && e.target.className.includes('adsbygoogle')) {
                const container = e.target.closest('.ad-container');
                if (container) {
                    this.showFallbackContent(container);
                }
            }
        });
    }

    showFallbackContent(container) {
        const placeholder = container.querySelector('.ad-placeholder');
        if (placeholder) {
            placeholder.innerHTML = `
                <p>Advertisement</p>
                <div class="ad-box">
                    <p>Ad temporarily unavailable</p>
                </div>
            `;
        }
    }
}

// Initialize ads manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new AdsManager();
});
