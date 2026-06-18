document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Theme Toggle Management
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check system preferences or local storage
    const currentTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const theme = htmlElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ==========================================================================
    // 2. Custom Hover Cursor System (Desktops)
    // ==========================================================================
    const cursorOutline = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    if (cursorOutline && cursorDot) {
        document.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows cursor directly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorDot.style.opacity = '1';

            // Outline follows with a slight lag/transition (via CSS transitions or JS animations)
            // Using requestAnimationFrame for ultimate smoothness
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 250, fill: 'forwards' });
            cursorOutline.style.opacity = '1';
        });

        // Hide cursors on mouse leave document
        document.addEventListener('mouseleave', () => {
            cursorOutline.style.opacity = '0';
            cursorDot.style.opacity = '0';
        });

        // Interactive element hover states
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card, .copy-btn');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // ==========================================================================
    // 3. Mobile Navigation Drawer
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ==========================================================================
    // 4. Header Scroll Style Adjustment
    // ==========================================================================
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // 5. Custom Typewriter Animation Effect
    // ==========================================================================
    const typewriterText = document.getElementById('typewriter-text');
    const words = [
        "Full Stack Developer.",
        "Python & Java Programmer.",
        "Computer Science Graduate.",
        "AI & Deep Learning Enthusiast."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typewriterText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }
    
    if (typewriterText) {
        type();
    }

    // ==========================================================================
    // 6. Intersection Observers: Scroll Reveal & Active Nav Link Highlight
    // ==========================================================================
    
    // Scroll Reveal Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Active Section Link Highlight in Nav Menu
    const sections = document.querySelectorAll('section[id]');
    const navLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3, // Highlight when section occupies 30% of viewport
        rootMargin: '-80px 0px -20% 0px' // Offset header height
    });

    sections.forEach(sec => navLinkObserver.observe(sec));

    // ==========================================================================
    // 7. Click-to-Copy Contacts Feature
    // ==========================================================================
    const copyBtns = document.querySelectorAll('.copy-btn');
    const notification = document.getElementById('notification');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Determine label based on copied text
                const textLabel = textToCopy.includes('@') ? 'Email Address' : 'Phone Number';
                notification.textContent = `${textLabel} copied to clipboard!`;
                
                // Show notification
                notification.classList.add('active');
                
                // Toggle icons for visual feedback
                const icon = btn.querySelector('i');
                icon.className = 'fa-solid fa-check';
                icon.style.color = 'var(--accent)';
                
                setTimeout(() => {
                    notification.classList.remove('active');
                    icon.className = 'fa-regular fa-copy';
                    icon.style.color = '';
                }, 2500);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });

    // ==========================================================================
    // 8. Contact Form Simulated Submit & Success Modal
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('.form-submit-btn');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        
        const actionUrl = contactForm.getAttribute('action');
        
        // If not configured, run local mock submit
        if (!actionUrl || actionUrl === '#' || actionUrl.includes('YOUR_FORMSPREE_ID')) {
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                contactForm.reset();
                successModal.classList.add('active');
            }, 1000);
            return;
        }
        
        // Otherwise, send real email using fetch POST
        const formData = new FormData(contactForm);
        
        fetch(actionUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            submitBtn.classList.remove('loading');
            if (response.ok) {
                contactForm.reset();
                successModal.classList.add('active');
            } else {
                alert('Oops! There was a problem sending your message. Please verify your form endpoint.');
            }
        })
        .catch(error => {
            submitBtn.classList.remove('loading');
            alert('Oops! There was a network connectivity error. Please check your connection and try again.');
        });
    });

    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    // Close modal when clicking on dark overlay
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });

    // ==========================================================================
    // 9. Footer Current Year dynamic population
    // ==========================================================================
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
});
