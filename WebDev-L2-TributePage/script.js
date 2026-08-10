/**
 * OIBSIP Web Development Level 2 Task 1 - Nikola Tesla Tribute Page Script
 * Features: Smooth scrolling, reveal-on-scroll animations, interactive header state
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Fade-In Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Attach reveal observer to cards and sections
    const cardsToAnimate = document.querySelectorAll('.bio-card, .timeline-card, .quote-wrapper');
    cardsToAnimate.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(card);
    });

    // Helper CSS injection for revealed state
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // 2. Active Header State on Scroll
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            header.style.background = 'rgba(7, 10, 20, 0.95)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(10, 13, 23, 0.85)';
        }
    });
});
