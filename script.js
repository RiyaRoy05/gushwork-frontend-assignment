/**
 * Main Application Script
 * Initializes all client-side dynamic functionalities such as Modals, Sliders, and Carousel.
 */

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileMenu();
  initHeroCarousel();
  initFAQ();
  initApplicationsSlider();
  initCatalogueModal();
  initQuoteModal();
});


/**
 * Initialize sticky header functionality
 * Toggles header visibility based on scroll position relative to the hero section.
 */
function initStickyHeader() {
  const header = document.querySelector(".header");
  const hero = document.querySelector(".hero-section");
  let lastScrollTop = 0;

  if (!header || !hero) return;

  window.addEventListener("scroll", () => {
    const curScroll = window.pageYOffset || document.documentElement.scrollTop;
    const heroBottom = hero.offsetTop + hero.offsetHeight;

    if (curScroll > heroBottom) {
      header.classList.add("header--fixed");
      if (curScroll > lastScrollTop) {
        header.classList.add("header--visible");
      } else {
        header.classList.remove("header--visible");
      }
    } else {
      header.classList.remove("header--fixed", "header--visible");
    }
    lastScrollTop = Math.max(0, curScroll);
  }, { passive: true });
}


/**
 * Initialize mobile menu toggle
 * Handles the opening and closing of the hamburger menu navigation.
 */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    hamburger.classList.toggle('hamburger--open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}


/**
 * Initialize hero carousel and zoom lens functionality
 * Handles main image switching via thumbnails and sets up the magnifying lens effect.
 */
function initHeroCarousel() {
  const mainImage = document.getElementById("zoom-image");
  const thumbnails = document.querySelectorAll(".thumb-box");
  const wrapper = document.querySelector(".hero-image-wrapper");
  const lens = document.getElementById("zoom-lens");
  const result = document.getElementById("zoom-result");

  if (!mainImage || thumbnails.length === 0) return;

  const images = Array.from(thumbnails).map(t => t.querySelector("img").src);
  let currentIndex = 0;

  const updateMainImage = (index) => {
    currentIndex = index;
    mainImage.src = images[currentIndex];
    thumbnails.forEach((t, i) => t.classList.toggle("active", i === currentIndex));
    if (result && result.classList.contains("result-active")) {
      result.style.backgroundImage = `url('${mainImage.src}')`;
    }
  };

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => updateMainImage(index));
  });

  document.querySelector(".hero-arrow.left")?.addEventListener("click", () => {
    updateMainImage(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  });

  document.querySelector(".hero-arrow.right")?.addEventListener("click", () => {
    updateMainImage(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  });

  if (lens && result && wrapper) {
    const moveLens = (e) => {
      const rect = mainImage.getBoundingClientRect();
      const x = Math.max(0, Math.min((e.pageX || e.touches[0].pageX) - rect.left - window.pageXOffset, rect.width)) - (lens.offsetWidth / 2);
      const y = Math.max(0, Math.min((e.pageY || e.touches[0].pageY) - rect.top - window.pageYOffset, rect.height)) - (lens.offsetHeight / 2);

      const boundedX = Math.max(0, Math.min(x, rect.width - lens.offsetWidth));
      const boundedY = Math.max(0, Math.min(y, rect.height - lens.offsetHeight));

      lens.style.left = `${boundedX}px`;
      lens.style.top = `${boundedY}px`;

      const cx = result.offsetWidth / lens.offsetWidth;
      const cy = result.offsetHeight / lens.offsetHeight;

      const naturalRatio = mainImage.naturalWidth / mainImage.naturalHeight;
      const renderedRatio = rect.width / rect.height;

      let zoomWidth, zoomHeight;
      if (naturalRatio > renderedRatio) {
        zoomHeight = rect.height * cy;
        zoomWidth = zoomHeight * naturalRatio;
      } else {
        zoomWidth = rect.width * cx;
        zoomHeight = zoomWidth / naturalRatio;
      }

      result.style.backgroundSize = `${zoomWidth}px ${zoomHeight}px`;

      const actualRenderedWidth = naturalRatio > renderedRatio ? rect.height * naturalRatio : rect.width;
      const actualRenderedHeight = naturalRatio > renderedRatio ? rect.height : rect.width / naturalRatio;

      const offsetX = (actualRenderedWidth - rect.width) / 2;
      const offsetY = (actualRenderedHeight - rect.height) / 2;

      const bgPosX = (boundedX + (lens.offsetWidth / 2)) * (zoomWidth / rect.width) - (result.offsetWidth / 2);
      const bgPosY = (boundedY + (lens.offsetHeight / 2)) * (zoomHeight / rect.height) - (result.offsetHeight / 2);

      result.style.backgroundPosition = `-${bgPosX}px -${bgPosY}px`;
    };

    wrapper.addEventListener("mouseenter", () => {
      lens.classList.add("zoom-active");
      result.classList.add("result-active");
      result.style.backgroundImage = `url('${mainImage.src}')`;
    });

    wrapper.addEventListener("mouseleave", () => {
      lens.classList.remove("zoom-active");
      result.classList.remove("result-active");
    });

    wrapper.addEventListener("mousemove", moveLens);
    wrapper.addEventListener("touchmove", moveLens, { passive: false });
  }
}

/**
 * Initialize FAQ accordion toggles
 * Handles expanding and collapsing of FAQ items.
 */
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const icon = item.querySelector(".faq-icon");

    question?.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach(faq => {
        faq.classList.remove("active");
        const otherIcon = faq.querySelector(".faq-icon");
        if (otherIcon) otherIcon.src = "assets/icons/below.svg";
      });

      if (!isActive) {
        item.classList.add("active");
        if (icon) icon.src = "assets/icons/above.svg";
      }
    });
  });
}

/**
 * Initialize the applications slider
 * Dynamically generates application cards and handles horizontal scrolling interactively.
 */
function initApplicationsSlider() {
  const applicationData = [
    {
      img: "assets/images/Fishnet-Manufacturing-Image.svg",
      title: "Fishnet Manufacturing",
      desc: "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads."
    },
    {
      img: "assets/images/Fishnet-Manufacturing-Image.svg",
      title: "Fishnet Manufacturing",
      desc: "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads."
    },
    {
      img: "assets/images/Fishnet-Manufacturing-Image.svg",
      title: "Fishnet Manufacturing",
      desc: "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads."
    },
    {
      img: "assets/images/Fishnet-Manufacturing-Image.svg",
      title: "Fishnet Manufacturing",
      desc: "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads."
    },
    {
      img: "assets/images/Fishnet-Manufacturing-Image.svg",
      title: "Fishnet Manufacturing",
      desc: "High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads."
    },
  ];

  const track = document.getElementById('applications-track');
  if (!track) return;

  track.innerHTML = applicationData.map(app => `
    <div class="application-card">
        <img src="${app.img}" alt="${app.title}" loading="lazy">
        <div class="image-gradient"></div>
        <div class="card-overlay">
            <h3>${app.title}</h3>
            <p>${app.desc}</p>
        </div>
    </div>
  `).join('');

  const nextBtn = document.querySelector('.app-arrow.right');
  const prevBtn = document.querySelector('.app-arrow.left');
  let position = 0;

  const updateSlider = () => {
    const card = track.querySelector('.application-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    const step = card.offsetWidth + gap;
    const maxScroll = -(track.scrollWidth - track.parentElement.offsetWidth);

    return { step, maxScroll };
  };

  nextBtn?.addEventListener('click', () => {
    const { step, maxScroll } = updateSlider();
    position = Math.max(position - step, maxScroll);
    track.style.transform = `translateX(${position}px)`;
  });

  prevBtn?.addEventListener('click', () => {
    const { step } = updateSlider();
    position = Math.min(position + step, 0);
    track.style.transform = `translateX(${position}px)`;
  });
}

/**
 * Initialize catalogue modal
 * Handles opening, closing, and form validation for the catalogue download modal.
 */
function initCatalogueModal() {
  const openBtn = document.getElementById('open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modal = document.getElementById('catalogue-modal');

  if (!openBtn || !closeModalBtn || !modal) return;

  const openModal = () => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeModalBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  const emailInput = modal.querySelector('input[type="email"]');
  const submitBtn = modal.querySelector('.download-brochure-btn');

  if (emailInput && submitBtn) {
    emailInput.addEventListener('input', (e) => {
      if (e.target.value.trim() !== '') {
        submitBtn.style.background = 'var(--primary-color, #2B3990)';
        submitBtn.style.cursor = 'pointer';
      } else {
        submitBtn.style.background = '#E6E8F2';
        submitBtn.style.cursor = 'not-allowed';
      }
    });
  }
}

/**
 * Initialize quote modal
 * Handles opening and closing of the quote request modal dialog.
 */
function initQuoteModal() {
  const openBtn = document.getElementById('open-quote-modal-btn');
  const closeModalBtn = document.getElementById('close-quote-modal-btn');
  const modal = document.getElementById('quote-modal');

  if (!openBtn || !closeModalBtn || !modal) return;

  const openModal = () => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeModalBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}