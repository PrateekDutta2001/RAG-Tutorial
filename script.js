// ============================================
// RAG Tutorial - Interactive JavaScript
// ============================================

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// ============================================
// Navigation Functionality
// ============================================

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        navToggle.textContent = isActive ? '✕' : '☰';
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.textContent = '☰';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.textContent = '☰';
    }
});

// ============================================
// Navbar Scroll Effect
// ============================================

let lastScroll = 0;
const scrollThreshold = 50;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for shadow effect
    if (currentScroll > scrollThreshold) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on scroll (optional - can be enabled)
    // if (currentScroll > lastScroll && currentScroll > 200) {
    //     navbar.style.transform = 'translateY(-100%)';
    // } else {
    //     navbar.style.transform = 'translateY(0)';
    // }

    lastScroll = currentScroll;
});

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Active Navigation Link Highlighting
// ============================================

const sections = document.querySelectorAll('.section');
const navLinksArray = Array.from(navLinks);

function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + 150; // Offset for navbar

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinksArray.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink(); // Initial check

// ============================================
// Intersection Observer for Animations
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe content cards for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.content-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// ============================================
// Code Block Copy Functionality
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        const codeHeader = block.querySelector('.code-header');
        if (codeHeader) {
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.className = 'copy-button';
            copyButton.style.cssText = `
                position: absolute;
                right: 10px;
                top: 10px;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 4px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                transition: background 0.2s;
            `;
            
            copyButton.addEventListener('mouseenter', () => {
                copyButton.style.background = '#2563eb';
            });
            
            copyButton.addEventListener('mouseleave', () => {
                copyButton.style.background = '#3b82f6';
            });
            
            // Make header relative for positioning
            codeHeader.style.position = 'relative';
            codeHeader.appendChild(copyButton);
            
            // Copy functionality
            copyButton.addEventListener('click', () => {
                const code = block.querySelector('code').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    copyButton.style.background = '#10b981';
                    
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                        copyButton.style.background = '#3b82f6';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    copyButton.textContent = 'Error';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                });
            });
        }
    });
});

// ============================================
// Search Functionality (Optional Enhancement)
// ============================================

function initializeSearch() {
    // This can be enhanced with a search input in the navbar
    // For now, it's a placeholder for future enhancement
    console.log('Search functionality can be added here');
}

// ============================================
// Keyboard Navigation
// ============================================

document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.textContent = '☰';
    }
});

// ============================================
// Performance Optimization
// ============================================

// Throttle scroll events for better performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll handlers
const throttledScrollHandler = throttle(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', throttledScrollHandler);

// ============================================
// Initialize on DOM Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('RAG Tutorial page loaded successfully!');
    
    // Add any initialization code here
    initializeSearch();
    
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.animation = 'fadeInUp 0.8s ease forwards';
    }
});

// ============================================
// Utility Functions
// ============================================

// Debounce function for search (if implemented)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// Print Functionality
// ============================================

window.addEventListener('beforeprint', () => {
    // Close mobile menu before printing
    navMenu.classList.remove('active');
});

// ============================================
// Error Handling
// ============================================

window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
    // You can add error reporting here
});

// ============================================
// Accessibility Enhancements
// ============================================

// Add keyboard navigation for flow diagrams
document.addEventListener('DOMContentLoaded', () => {
    const flowSteps = document.querySelectorAll('.flow-step');
    flowSteps.forEach(step => {
        step.setAttribute('tabindex', '0');
        step.setAttribute('role', 'button');
        step.setAttribute('aria-label', step.querySelector('h4')?.textContent || 'Flow step');
        
        step.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                step.click();
            }
        });
    });
});

// Add ARIA labels to navigation
navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const sectionName = href.replace('#', '').replace('-', ' ');
    link.setAttribute('aria-label', `Navigate to ${sectionName} section`);
});

// ============================================
// Analytics Tracking (Optional)
// ============================================

function trackSectionView(sectionId) {
    // This can be integrated with analytics services
    console.log(`Section viewed: ${sectionId}`);
}

// Track section views
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            if (sectionId) {
                trackSectionView(sectionId);
            }
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => {
    sectionObserver.observe(section);
});

