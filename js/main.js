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

// ===== STICKY NAVBAR AND PARALLAX EFFECT =====
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;

  // Sticky Navbar functionality - Works on all pages
  const navbar = document.getElementById("nmaNavbar");
  const topBar = document.querySelector(".nma-top-bar");
  const topBarHeight = topBar ? topBar.offsetHeight : 0;

  // Make navbar sticky after scrolling past the top bar
  if (scrolled > topBarHeight && navbar) {
    navbar.classList.add("nma-sticky");
    console.log("Adding sticky class to navbar"); // Debug log
  } else if (navbar) {
    navbar.classList.remove("nma-sticky");
    console.log("Removing sticky class from navbar"); // Debug log
  }

  // Header parallax - Check for both home and about page headers
  const homeHeader = document.querySelector(".nma-header");
  const aboutHeader = document.querySelector(".nma-about-header");

  if (homeHeader) {
    // Home page parallax
    const headerRate = scrolled * -0.5;
    homeHeader.style.transform = `translateY(${headerRate}px)`;
  }

  // About header doesn't need parallax effect

  // Facilities section parallax
  const facilitiesSection = document.querySelector(
    ".school-facilities-video-section"
  );
  if (facilitiesSection && window.innerWidth > 768) {
    const facilitiesRate = scrolled * -0.3;
    facilitiesSection.style.transform = `translateY(${facilitiesRate}px)`;
  }

  // Stats animation check
  if (!statsAnimated && isStatsInViewport()) {
    animateCounters();
  }
});

// ===== LOADING ANIMATION =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded - Initializing sticky navbar");

  // Initialize sticky navbar state on page load
  const scrolled = window.pageYOffset;
  const navbar = document.getElementById("nmaNavbar");
  const topBar = document.querySelector(".nma-top-bar");
  const topBarHeight = topBar ? topBar.offsetHeight : 0;

  console.log("Initial scroll position:", scrolled);
  console.log("Navbar found:", !!navbar);
  console.log("Top bar height:", topBarHeight);

  if (scrolled > topBarHeight && navbar) {
    navbar.classList.add("nma-sticky");
    console.log("Added sticky class on page load");
  }

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

// ===== ACADEMICS SECTION SLIDER FUNCTIONALITY =====
let academicsCurrentIndex = 0;
let academicsSlides = [];
let academicsTrack = null;
let academicsIsTransitioning = false;

// Initialize academics slider
const initAcademicsSlider = () => {
  academicsTrack = document.getElementById("academicsTrack");
  academicsSlides = document.querySelectorAll(".nma-academic-slide");

  if (!academicsTrack || academicsSlides.length === 0) {
    console.warn("Academics slider elements not found");
    return;
  }

  // Set initial position
  updateAcademicsSlider();

  // Add event listeners for navigation buttons
  const prevBtn = document.getElementById("academicsPrev");
  const nextBtn = document.getElementById("academicsNext");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (!academicsIsTransitioning) {
        prevAcademicsSlide();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!academicsIsTransitioning) {
        nextAcademicsSlide();
      }
    });
  }

  // Add click listeners to academic stage items to sync with slider
  document.querySelectorAll(".nma-stage-item").forEach((item, index) => {
    item.addEventListener("click", () => {
      if (!academicsIsTransitioning && index < academicsSlides.length) {
        goToAcademicsSlide(index);
      }
    });
  });

  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (isAcademicsSectionVisible()) {
      if (e.key === "ArrowLeft" && !academicsIsTransitioning) {
        prevAcademicsSlide();
      } else if (e.key === "ArrowRight" && !academicsIsTransitioning) {
        nextAcademicsSlide();
      }
    }
  });

  // Add touch/swipe support for mobile
  addAcademicsSwipeSupport();
};

// Check if academics section is visible
const isAcademicsSectionVisible = () => {
  const section = document.querySelector(".homepage-academics-section");
  if (!section) return false;

  const rect = section.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

// Get slides per view based on screen size
const getAcademicsSlidesPerView = () => {
  if (window.innerWidth <= 767) return 1; // Mobile: 1 slide
  if (window.innerWidth <= 1023) return 1; // Tablet: 1 slide
  return 1; // Desktop: 1 slide
};

// Calculate maximum index based on current slides per view
const getAcademicsMaxIndex = () => {
  const slidesPerView = getAcademicsSlidesPerView();

  if (slidesPerView === 1) {
    // Mobile: can navigate to any slide (0 to totalSlides - 1)
    return academicsSlides.length - 1;
  } else {
    const maxIndex = Math.max(0, academicsSlides.length - slidesPerView);
    return maxIndex;
  }
};

// Update slider position
const updateAcademicsSlider = () => {
  if (!academicsTrack || academicsSlides.length === 0) return;

  const slidesPerView = getAcademicsSlidesPerView();
  const maxIndex = getAcademicsMaxIndex();

  // Ensure current index doesn't exceed maximum
  academicsCurrentIndex = Math.max(
    0,
    Math.min(academicsCurrentIndex, maxIndex)
  );

  let translateX;

  if (slidesPerView === 1) {
    // Mobile: show one slide at a time
    translateX = -(academicsCurrentIndex * (100 / academicsSlides.length));
  } else {
    // Desktop/Tablet: each step moves by the width of one slide
    const slideWidthPercent = 100 / slidesPerView;
    translateX = -(academicsCurrentIndex * slideWidthPercent);
  }

  academicsTrack.style.transform = `translateX(${translateX}%)`;

  // Update active states
  updateAcademicsActiveStates();

  // Update navigation button states
  updateAcademicsNavButtons();
};

// Update active states for slides and stage items
const updateAcademicsActiveStates = () => {
  const slidesPerView = getAcademicsSlidesPerView();

  // Remove all active states
  academicsSlides.forEach((slide) => slide.classList.remove("active"));
  document
    .querySelectorAll(".nma-stage-item")
    .forEach((item) => item.classList.remove("active"));

  // Add active states to currently visible slides
  if (slidesPerView === 1) {
    // Mobile: only show current slide as active
    if (academicsSlides[academicsCurrentIndex]) {
      academicsSlides[academicsCurrentIndex].classList.add("active");
    }

    // Update corresponding stage item
    const stageItems = document.querySelectorAll(".nma-stage-item");
    if (stageItems[academicsCurrentIndex]) {
      stageItems[academicsCurrentIndex].classList.add("active");
    }
  } else {
    // Desktop/Tablet: show multiple slides as active
    for (
      let i = academicsCurrentIndex;
      i < academicsCurrentIndex + slidesPerView && i < academicsSlides.length;
      i++
    ) {
      academicsSlides[i].classList.add("active");

      // Also update corresponding stage item
      const stageItems = document.querySelectorAll(".nma-stage-item");
      if (stageItems[i]) {
        stageItems[i].classList.add("active");
      }
    }
  }
};

// Update navigation button states
const updateAcademicsNavButtons = () => {
  const prevBtn = document.getElementById("academicsPrev");
  const nextBtn = document.getElementById("academicsNext");

  // With looping, buttons are always enabled (just visual feedback)
  if (prevBtn) {
    prevBtn.disabled = false;
    prevBtn.style.opacity = "1";
  }

  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.style.opacity = "1";
  }
};

// Navigate to previous slide
const prevAcademicsSlide = () => {
  const maxIndex = getAcademicsMaxIndex();

  academicsIsTransitioning = true;

  if (academicsCurrentIndex > 0) {
    academicsCurrentIndex--;
  } else {
    // Loop to last valid position when at beginning
    academicsCurrentIndex = maxIndex;
  }

  updateAcademicsSlider();

  setTimeout(() => {
    academicsIsTransitioning = false;
  }, 600);
};

// Navigate to next slide
const nextAcademicsSlide = () => {
  const maxIndex = getAcademicsMaxIndex();

  academicsIsTransitioning = true;

  if (academicsCurrentIndex < maxIndex) {
    academicsCurrentIndex++;
  } else {
    // Loop back to beginning when at end
    academicsCurrentIndex = 0;
  }

  updateAcademicsSlider();

  setTimeout(() => {
    academicsIsTransitioning = false;
  }, 600);
};

// Go to specific slide
const goToAcademicsSlide = (index) => {
  const maxIndex = getAcademicsMaxIndex();
  const targetIndex = Math.max(0, Math.min(index, maxIndex));

  if (targetIndex !== academicsCurrentIndex) {
    academicsIsTransitioning = true;
    academicsCurrentIndex = targetIndex;
    updateAcademicsSlider();

    setTimeout(() => {
      academicsIsTransitioning = false;
    }, 600);
  }
};

// Add swipe support for mobile devices
const addAcademicsSwipeSupport = () => {
  if (!academicsTrack) return;

  let startX = 0;
  let endX = 0;
  const minSwipeDistance = 50;

  academicsTrack.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );

  academicsTrack.addEventListener(
    "touchend",
    (e) => {
      endX = e.changedTouches[0].clientX;
      handleAcademicsSwipe();
    },
    { passive: true }
  );

  const handleAcademicsSwipe = () => {
    const swipeDistance = startX - endX;

    if (
      Math.abs(swipeDistance) > minSwipeDistance &&
      !academicsIsTransitioning
    ) {
      if (swipeDistance > 0) {
        // Swipe left - next slide
        nextAcademicsSlide();
      } else {
        // Swipe right - previous slide
        prevAcademicsSlide();
      }
    }
  };
};

// Handle window resize
const handleAcademicsResize = () => {
  if (academicsTrack && academicsSlides.length > 0) {
    // Reset to first slide if current index is invalid for new screen size
    const maxIndex = getAcademicsMaxIndex();
    if (academicsCurrentIndex > maxIndex) {
      academicsCurrentIndex = maxIndex;
    }
    updateAcademicsSlider();
  }
};

// Add resize listener with debouncing
let academicsResizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(academicsResizeTimeout);
  academicsResizeTimeout = setTimeout(handleAcademicsResize, 250);
});

// Auto-play functionality (optional)
let academicsAutoPlay = null;
const academicsAutoPlayInterval = 5000; // 5 seconds

const startAcademicsAutoPlay = () => {
  stopAcademicsAutoPlay();
  academicsAutoPlay = setInterval(() => {
    if (!academicsIsTransitioning && isAcademicsSectionVisible()) {
      nextAcademicsSlide(); // This will now handle looping properly
    }
  }, academicsAutoPlayInterval);
};

const stopAcademicsAutoPlay = () => {
  if (academicsAutoPlay) {
    clearInterval(academicsAutoPlay);
    academicsAutoPlay = null;
  }
};

// Pause auto-play on hover
const setupAcademicsAutoPlayControls = () => {
  const section = document.querySelector(".homepage-academics-section");
  if (section) {
    section.addEventListener("mouseenter", stopAcademicsAutoPlay);
    section.addEventListener("mouseleave", startAcademicsAutoPlay);
  }
};

// Initialize academics slider when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Wait a bit for all elements to be rendered
  setTimeout(() => {
    initAcademicsSlider();
    setupAcademicsAutoPlayControls();

    // Optionally start auto-play (uncomment if desired)
    // startAcademicsAutoPlay();
  }, 1000);
});

// ===== STATISTICS COUNTER ANIMATION =====
let statsAnimated = false;

// Function to animate counter numbers
const animateCounters = () => {
  if (statsAnimated) return;

  const counters = document.querySelectorAll(".nma-stat-number");

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        // Add plus sign for numbers over certain thresholds
        const displayValue = Math.floor(current);
        let displayText = displayValue.toString();

        // Add plus sign to specific numbers
        if (
          target >= 25 &&
          (target === 1000 || // Graduates
            target === 50 || // Teachers
            target === 800 || // Students
            target === 25) // Awards
        ) {
          if (current >= target) {
            displayText = target + "+";
          } else {
            displayText = displayValue.toString();
          }
        } else if (target === 98) {
          // Success rate - add percentage
          if (current >= target) {
            displayText = target + "%";
          } else {
            displayText = displayValue + "%";
          }
        } else {
          // Years experience - no plus sign
          displayText = displayValue.toString();
        }

        counter.textContent = displayText;
        requestAnimationFrame(updateCounter);
      } else {
        // Final display with appropriate suffix
        let finalText = target.toString();

        if (
          target === 1000 ||
          target === 50 ||
          target === 800 ||
          target === 25
        ) {
          finalText = target + "+";
        } else if (target === 98) {
          finalText = target + "%";
        }

        counter.textContent = finalText;
      }
    };

    updateCounter();
  });

  statsAnimated = true;
};

// Function to check if statistics section is in viewport
const isStatsInViewport = () => {
  const statsSection = document.querySelector(".key-statistics-section");
  if (!statsSection) return false;

  const rect = statsSection.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return rect.top <= windowHeight * 0.8 && rect.bottom >= 0;
};

// Scroll event listener for statistics animation
const handleStatsScroll = () => {
  if (!statsAnimated && isStatsInViewport()) {
    animateCounters();
  }
};

// Add scroll listener for stats animation (now handled in main scroll listener above)
// window.addEventListener("scroll", handleStatsScroll);

// Also check on page load in case section is already visible
window.addEventListener("load", () => {
  setTimeout(() => {
    if (isStatsInViewport()) {
      animateCounters();
    }
  }, 500);
});

// ===== NEWS AND EVENTS TAB FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".nma-news-tab");
  const contents = document.querySelectorAll(".nma-news-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Remove active class from all tabs and contents
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked tab
      this.classList.add("active");

      // Show corresponding content
      const targetContent = document.getElementById(targetTab + "-content");
      if (targetContent) {
        targetContent.classList.add("active");
      }

      // Add smooth transition effect
      targetContent.style.opacity = "0";
      setTimeout(() => {
        targetContent.style.opacity = "1";
      }, 150);
    });
  });
});

// ===== VIDEO MODAL FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing video modal...");

  const videoButton = document.getElementById("videoButton");
  const videoModal = document.getElementById("videoModal");
  const videoClose = document.getElementById("videoClose");
  const videoFrame = document.getElementById("videoFrame");

  console.log("Video elements found:", {
    button: !!videoButton,
    modal: !!videoModal,
    close: !!videoClose,
    frame: !!videoFrame,
  });

  // Sample video URL - replace with your actual video URL
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0";

  // Open video modal
  if (videoButton) {
    videoButton.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Video button clicked!");

      if (videoFrame && videoModal) {
        videoFrame.src = videoUrl;
        videoModal.style.display = "block";
        document.body.style.overflow = "hidden";
        console.log("Video modal should be open now");
      } else {
        console.error("Video frame or modal not found");
      }
    });
  } else {
    console.error("Video button not found!");
  }

  // Close video modal
  function closeVideoModal() {
    console.log("Closing video modal...");
    if (videoModal && videoFrame) {
      videoModal.style.display = "none";
      videoFrame.src = "";
      document.body.style.overflow = "auto";
    }
  }

  // Close button click
  if (videoClose) {
    videoClose.addEventListener("click", function (e) {
      e.preventDefault();
      closeVideoModal();
    });
  }

  // Click outside modal to close
  if (videoModal) {
    videoModal.addEventListener("click", function (e) {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      videoModal &&
      videoModal.style.display === "block"
    ) {
      closeVideoModal();
    }
  });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
    }
  });
}, observerOptions);

// Observe facilities section when it enters viewport
document.addEventListener("DOMContentLoaded", function () {
  const facilitiesSection = document.querySelector(
    ".school-facilities-video-section"
  );
  if (facilitiesSection) {
    observer.observe(facilitiesSection);
  }
});
