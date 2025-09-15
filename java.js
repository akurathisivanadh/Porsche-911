const splashScreen = document.getElementById('splash-screen');
const logo = document.getElementById('splash-logo');
const contentWrapper = document.getElementById('content-wrapper');
const navbar = document.getElementById('navbar');
const body = document.body;

logo.addEventListener('animationend', () => {
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.style.display = 'none';
            contentWrapper.style.opacity = '1';
            navbar.style.transform = 'translateY(0)';
            body.style.overflow = 'auto';
            setTimeout(() => {
                document.querySelectorAll('#main-content .pop-up-text').forEach((el, index) => {
                    setTimeout(() => el.classList.add('visible'), index * 200);
                });
                document.getElementById('main-content').classList.add('visible');
            }, 100);
        }, { once: true });
    }, 500);
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.3 });

const animatedElements = document.querySelectorAll('.animate-on-scroll, .pop-up-text, .page-transition');
animatedElements.forEach((el) => observer.observe(el));

const modal = document.getElementById('model-lineup-modal');
const openModalBtn = document.getElementById('open-modal-link');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalSlider = modal.querySelector('.modal-slider');
const modalSlides = modal.querySelectorAll('.modal-slide');
const modalDotsContainer = modal.querySelector('.slider-dots');
let currentModalSlide = 0;

openModalBtn.addEventListener('click', () => {
    modal.classList.add('visible');
    body.style.overflow = 'hidden';
    goToModalSlide(0);
});
closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('visible');
    body.style.overflow = 'auto';
    contentWrapper.style.display = 'block';
    navbar.style.display = 'flex';
    document.getElementById('models-section').scrollIntoView({ behavior: 'smooth' });
});

modalSlides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    dot.addEventListener('click', () => goToModalSlide(i));
    modalDotsContainer.appendChild(dot);
});

const modalDots = modalDotsContainer.querySelectorAll('.dot');

function goToModalSlide(slideIndex) {
    modalSlider.style.transform = `translateX(-${slideIndex * 100}%)`;
    currentModalSlide = slideIndex;
    modalSlides.forEach(slide => slide.classList.remove('active'));
    modalSlides[slideIndex].classList.add('active');
    updateModalDots();
}
function updateModalDots() {
    modalDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentModalSlide);
    });
}
goToModalSlide(0);

const exploreButtons = document.querySelectorAll('.explore-button');
const backToMainBtns = document.querySelectorAll('.back-to-main-btn');

exploreButtons.forEach(button => {
    button.addEventListener('click', () => {
        const model = button.dataset.model;
        const targetContainer = document.getElementById(`${model}-details-container`);
        if (targetContainer) {
            modal.classList.remove('visible');
            contentWrapper.style.display = 'none';
            navbar.style.display = 'none';
            targetContainer.classList.add('visible');
            targetContainer.querySelector('main').scrollTop = 0;
        }
    });
});

backToMainBtns.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const detailsWrapper = button.closest('.details-wrapper');
        const modelName = detailsWrapper.id.split('-')[0];
        const modelOrder = ['carrera', 'gts', 'turbo'];
        const slideIndex = modelOrder.indexOf(modelName);
        detailsWrapper.classList.remove('visible');
        const modal = document.getElementById('model-lineup-modal');
        modal.classList.add('visible');
        body.style.overflow = 'hidden';
        if (slideIndex !== -1) {
            goToModalSlide(slideIndex);
        }
    });
});

function setupDetailsPage(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const detailSections = container.querySelectorAll('.full-page-section');
    const detailDots = container.querySelectorAll('.details-dot');

    const detailsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const textContainer = entry.target.querySelector('.animated-text');
            if (entry.isIntersecting) {
                const id = entry.target.id;
                detailDots.forEach(dot => {
                    dot.classList.toggle('active', dot.getAttribute('data-section') === id);
                });
                if (textContainer) textContainer.classList.add('visible');
            } else {
                if (textContainer) textContainer.classList.remove('visible');
            }
        });
    }, {
        root: container.querySelector('main'),
        threshold: 0.6
    });

    detailSections.forEach(section => {
        detailsObserver.observe(section);
    });
}

setupDetailsPage('carrera-details-container');
setupDetailsPage('gts-details-container');
setupDetailsPage('turbo-details-container');

const swipeableSlider = document.querySelector('.swipeable-slider');
const swipeableSlides = document.querySelectorAll('.swipeable-slide');
const prevBtn = document.getElementById('swipeable-prev');
const nextBtn = document.getElementById('swipeable-next');

const firstSlideClone = swipeableSlides[0].cloneNode(true);
swipeableSlider.appendChild(firstSlideClone);

let currentSwipeableSlide = 0;
const totalSlides = swipeableSlides.length;

function goToSwipeableSlide(index) {
    swipeableSlider.style.transition = 'transform 0.5s ease-in-out';
    swipeableSlider.style.transform = `translateX(-${index * 100}%)`;
    swipeableSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === (index % totalSlides));
    });
}

nextBtn.addEventListener('click', () => {
    currentSwipeableSlide++;
    goToSwipeableSlide(currentSwipeableSlide);
});

prevBtn.addEventListener('click', () => {
    if (currentSwipeableSlide <= 0) {
        currentSwipeableSlide = totalSlides;
    }
    currentSwipeableSlide--;
    goToSwipeableSlide(currentSwipeableSlide);
});

swipeableSlider.addEventListener('transitionend', () => {
    if (currentSwipeableSlide >= totalSlides) {
        swipeableSlider.style.transition = 'none';
        currentSwipeableSlide = 0;
        swipeableSlider.style.transform = `translateX(-${currentSwipeableSlide * 100}%)`;
    }
});

if (window.location.hash === "#footer") {
    window.history.replaceState(null, null, " ");
}

goToSwipeableSlide(0);
