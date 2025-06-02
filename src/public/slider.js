/* eslint-disable no-undef */
gsap.registerPlugin(ScrollTrigger);

const slider = document.querySelector('.slider');
const sections = document.querySelectorAll('.slider section');
slider.style.width = `${document.querySelectorAll('.slider section').length * 100}vw`;

// Calculate scroll distance based on number of sections and viewport width
const scrollDistance = window.innerWidth * (sections.length - 1);

gsap.to(slider, {
  x: () => `-${scrollDistance}px`,
  ease: 'none',
  scrollTrigger: {
    trigger: '.about-slider-wrapper',
    pin: true,
    scrub: 1,
    snap: {
      snapTo: 1 / (sections.length - 1),
      duration: { min: 0.5, max: 0.75 },
      delay: 0.15,
      ease: 'power1.inOut',
    },
    end: () => `+=${scrollDistance}`,
  },
});

window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
