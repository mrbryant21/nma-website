// ===== MOBILE MENU TOGGLE =====
const mobileToggle = document.getElementById("mobileToggle");
const navMenu = document.getElementById("navMenu");

mobileToggle.addEventListener("click", function () {
  mobileToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nma-nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    mobileToggle.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", function (e) {
  if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
    mobileToggle.classList.remove("active");
    navMenu.classList.remove("active");
  }
});

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ===== SIDE NAVIGATION NUMBERS FUNCTIONALITY =====
let currentSlide = 1;
let slideInterval = null;
let isTransitioning = false;
let isManualNavigation = false;

const startSlideshow = () => {
  // Clear any existing interval first
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }

  // Only start if not in manual mode
  if (!isManualNavigation) {
    slideInterval = setInterval(() => {
      if (!isTransitioning && !isManualNavigation) {
        nextSlide();
      }
    }, 6000); // Consistent 6 seconds
  }
};

const stopSlideshow = () => {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
};

const showSlide = (slideNumber, isManual = false) => {
  // Validate slide number and prevent duplicate transitions
  if (
    isTransitioning ||
    slideNumber === currentSlide ||
    slideNumber < 1 ||
    slideNumber > 4
  ) {
    return false;
  }

  isTransitioning = true;

  // Set manual mode if this is manual navigation
  if (isManual) {
    isManualNavigation = true;
    stopSlideshow();
  }

  const currentSlideElement = document.querySelector(".nma-slide.active");
  const targetSlideElement = document.querySelector(
    `.nma-slide[data-slide="${slideNumber}"]`
  );
  const currentNavNumber = document.querySelector(".nma-nav-number.active");
  const targetNavNumber = document.querySelector(
    `.nma-nav-number[data-slide="${slideNumber}"]`
  );
  const header = document.querySelector(".nma-header");

  // Verify all elements exist
  if (
    !currentSlideElement ||
    !targetSlideElement ||
    !currentNavNumber ||
    !targetNavNumber ||
    !header
  ) {
    isTransitioning = false;
    if (isManual) {
      isManualNavigation = false;
    }
    return false;
  }

  // Update header background class
  header.className = header.className.replace(/slide-\d+/g, "").trim();
  header.classList.add(`slide-${slideNumber}`);

  // Update nav numbers
  currentNavNumber.classList.remove("active");
  targetNavNumber.classList.add("active");

  // Animate slide transition
  currentSlideElement.classList.add("slide-out-left");
  targetSlideElement.classList.add("slide-in-right");

  setTimeout(() => {
    // Clean up current slide
    currentSlideElement.classList.remove("active", "slide-out-left");

    // Activate target slide
    targetSlideElement.classList.add("active");
    targetSlideElement.classList.remove("slide-in-right");

    // Update current slide
    currentSlide = slideNumber;
    isTransitioning = false;

    // If this was manual navigation, restart auto after delay
    if (isManual) {
      setTimeout(() => {
        isManualNavigation = false;
        startSlideshow();
      }, 8000); // 8 second pause after manual navigation
    }
  }, 800);

  return true;
};

const nextSlide = () => {
  const nextSlideNumber = currentSlide >= 4 ? 1 : currentSlide + 1;
  showSlide(nextSlideNumber, false);
};

// Manual navigation event listeners
document.querySelectorAll(".nma-nav-number").forEach((number) => {
  number.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const slideNumber = parseInt(this.dataset.slide);

    // Validate slide number
    if (isNaN(slideNumber) || slideNumber < 1 || slideNumber > 4) {
      return;
    }

    // Only proceed if it's a different slide and not currently transitioning
    if (slideNumber !== currentSlide && !isTransitioning) {
      showSlide(slideNumber, true); // true indicates manual navigation
    }
  });

  // Prevent any other click events on navigation numbers
  number.addEventListener("mousedown", function (e) {
    e.stopPropagation();
  });
});

// ===== DROPDOWN MENU ENHANCEMENTS =====
document.querySelectorAll(".nma-dropdown").forEach((dropdown) => {
  let timeout;

  dropdown.addEventListener("mouseenter", function () {
    clearTimeout(timeout);
    const menu = this.querySelector(".nma-dropdown-menu");
    menu.style.display = "block";
  });

  dropdown.addEventListener("mouseleave", function () {
    const menu = this.querySelector(".nma-dropdown-menu");
    timeout = setTimeout(() => {
      menu.style.display = "none";
    }, 200);
  });
});

// ===== ACADEMIC STAGES HOVER EFFECTS =====
document.querySelectorAll(".nma-stage-item").forEach((stage) => {
  stage.addEventListener("mouseenter", function () {
    // Add a subtle animation effect
    this.style.transform = "translateY(-8px) scale(1.05)";
  });

  stage.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// ===== HERO BUTTON ANIMATION =====
document.querySelector(".nma-hero-btn").addEventListener("click", function (e) {
  // Create ripple effect
  const ripple = document.createElement("span");
  const rect = this.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.classList.add("ripple");

  this.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
});

// ===== PARALLAX EFFECT FOR HEADER =====
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const header = document.querySelector(".nma-header");
  const rate = scrolled * -0.5;

  if (header) {
    header.style.transform = `translateY(${rate}px)`;
  }
});

// ===== LOADING ANIMATION =====
document.addEventListener("DOMContentLoaded", function () {
  // Add fade-in animation to header content
  const stages = document.querySelector(".nma-academic-stages");

  setTimeout(() => {
    if (stages) {
      stages.style.opacity = "1";
      stages.style.transform = "translateY(0)";
    }
  }, 600);

  // Initialize slider properly
  setTimeout(() => {
    // Clear any existing intervals
    stopSlideshow();

    // Reset variables
    currentSlide = 1;
    isTransitioning = false;
    isManualNavigation = false;

    // Ensure header has correct initial class
    const header = document.querySelector(".nma-header");
    if (header) {
      header.className = header.className.replace(/slide-\d+/g, "").trim();
      header.classList.add("slide-1");
    }

    // Clean up all slides and nav numbers first
    document.querySelectorAll(".nma-slide").forEach((slide) => {
      slide.classList.remove("active", "slide-in-right", "slide-out-left");
    });
    document.querySelectorAll(".nma-nav-number").forEach((nav) => {
      nav.classList.remove("active");
    });

    // Set slide 1 and nav 1 as active
    const firstSlide = document.querySelector('.nma-slide[data-slide="1"]');
    const firstNavNumber = document.querySelector(
      '.nma-nav-number[data-slide="1"]'
    );

    if (firstSlide && firstNavNumber) {
      firstSlide.classList.add("active");
      firstNavNumber.classList.add("active");
    }

    // Start slideshow after everything is initialized
    setTimeout(() => {
      startSlideshow();
    }, 1000);
  }, 2000);
});
