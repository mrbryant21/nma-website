// ===== CRECHE LEARNING FACILITIES CAROUSEL =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("Facilities carousel script loaded!");

  // Make sure we wait for all resources to load
  window.addEventListener("load", function () {
    console.log("Window fully loaded, initializing carousel");
    setTimeout(initializeFacilitiesCarousel, 100);
  });
});

function initializeFacilitiesCarousel() {
  console.log("Initializing Facilities Carousel");

  // Get all elements with proper null checks using the correct class names from HTML
  const carousel = document.getElementById("facilitiesCarousel");
  console.log("Carousel element:", carousel);

  const track = document.querySelector(".nma-facilities-carousel-track");
  console.log("Track element:", track);

  const slides = document.querySelectorAll(".nma-facilities-carousel-slide");
  console.log("Slides found:", slides.length);

  const prevBtn = document.getElementById("facilitiesPrevBtn");
  console.log("Previous button:", prevBtn);

  const nextBtn = document.getElementById("facilitiesNextBtn");
  console.log("Next button:", nextBtn);

  const indicatorsContainer = document.getElementById("facilitiesIndicators");
  console.log("Indicators container:", indicatorsContainer);

  // Exit if essential elements don't exist
  if (!carousel || !track || !slides || slides.length === 0) {
    console.log("Carousel elements not found, skipping initialization");
    return;
  }

  console.log("Initializing carousel with", slides.length, "slides");

  let currentIndex = 0;
  let isAnimating = false;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let initialTransform = 0;
  let autoplayInterval = null;

  // Calculate slide dimensions
  function getSlideWidth() {
    if (!slides[0]) return 400;
    return slides[0].offsetWidth || 400;
  }

  function getVisibleSlides() {
    const containerWidth = carousel.offsetWidth || 800;
    const slideWidth = getSlideWidth();
    return Math.max(1, Math.floor(containerWidth / slideWidth));
  }

  function getMaxIndex() {
    const visibleSlides = getVisibleSlides();
    return Math.max(0, slides.length - visibleSlides);
  }

  // Create indicator dots
  function createIndicators() {
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = "";
    const maxIndex = getMaxIndex();

    for (let i = 0; i <= maxIndex; i++) {
      const indicator = document.createElement("button");
      indicator.className = "nma-facilities-indicator";
      indicator.setAttribute("aria-label", `Slide ${i + 1}`);
      indicator.setAttribute("data-index", i);
      if (i === 0) indicator.classList.add("active");

      indicator.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        if (!isNaN(index)) {
          goToSlide(index);
          resetAutoplay(); // Reset autoplay when manually navigating
        }
      });

      indicatorsContainer.appendChild(indicator);
    }
  }

  // Update active indicator
  function updateIndicators() {
    if (!indicatorsContainer) return;

    const indicators = indicatorsContainer.querySelectorAll(
      ".nma-facilities-indicator"
    );
    indicators.forEach((indicator, index) => {
      if (indicator) {
        indicator.classList.toggle("active", index === currentIndex);
      }
    });
  }

  // Update navigation button states
  function updateButtons() {
    const maxIndex = getMaxIndex();

    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
    }

    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIndex;
      nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    }
  }

  // Move to specific slide
  function goToSlide(index) {
    if (isAnimating || !track) return;

    const maxIndex = getMaxIndex();
    const newIndex = Math.max(0, Math.min(index, maxIndex));

    if (newIndex === currentIndex) return;

    isAnimating = true;
    currentIndex = newIndex;

    const slideWidth = getSlideWidth();
    const translateX = -currentIndex * slideWidth;

    console.log(`Moving to slide ${newIndex}, translateX: ${translateX}px`);

    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(${translateX}px)`;

    updateIndicators();
    updateButtons();

    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  // Navigation functions
  function nextSlide() {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      goToSlide(currentIndex + 1);
    } else {
      // Loop back to first slide for autoplay
      goToSlide(0);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }

  // Start autoplay
  function startAutoplay() {
    stopAutoplay(); // Clear any existing interval first
    autoplayInterval = setInterval(() => {
      if (!document.hidden && !isDragging && !isAnimating) {
        nextSlide();
      }
    }, 5000); // Change slide every 5 seconds
  }

  // Stop autoplay
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Reset autoplay (called after manual navigation)
  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Touch/Mouse drag functionality
  function handleStart(e) {
    if (isAnimating || !track) return;

    console.log("Drag start detected");

    // Stop autoplay when user interacts with carousel
    stopAutoplay();

    isDragging = true;
    startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    currentX = startX;

    // Get current transform value
    const transform = getComputedStyle(track).transform;
    console.log("Current transform:", transform);

    if (transform === "none") {
      initialTransform = 0;
    } else {
      try {
        const matrix = transform.match(/matrix\(([^)]+)\)/);
        if (matrix && matrix[1]) {
          const values = matrix[1].split(",");
          initialTransform = parseFloat(values[4]) || 0;
        } else {
          initialTransform = 0;
        }
      } catch (err) {
        console.error("Error parsing transform matrix:", err);
        initialTransform = 0;
      }
    }

    console.log("Initial transform value:", initialTransform);

    track.style.transition = "none";
    track.style.cursor = "grabbing";

    // Prevent default to avoid page scroll/drag but only for mouse events
    if (e.type.includes("mouse")) {
      e.preventDefault();
    }
  }

  function handleMove(e) {
    if (!isDragging || !track) return;

    currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    const diff = currentX - startX;
    const newTransform = initialTransform + diff;

    // Apply the new transform
    track.style.transform = `translateX(${newTransform}px)`;

    // Prevent default to stop page scrolling during drag
    e.preventDefault();
  }

  function handleEnd() {
    if (!isDragging || !track) return;

    isDragging = false;
    track.style.cursor = "grab";

    const diff = currentX - startX;
    const threshold = getSlideWidth() * 0.2; // 20% of slide width

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        // Dragged right, go to previous slide
        prevSlide();
      } else if (diff < 0 && currentIndex < getMaxIndex()) {
        // Dragged left, go to next slide
        nextSlide();
      } else {
        // Reset to current position
        goToSlide(currentIndex);
      }
    } else {
      // Reset to current position
      goToSlide(currentIndex);
    }

    // Restart autoplay after interaction
    startAutoplay();
  }

  // Event listeners for navigation buttons
  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      nextSlide();
      resetAutoplay(); // Reset autoplay when manually navigating
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      prevSlide();
      resetAutoplay(); // Reset autoplay when manually navigating
    });
  }

  // Event listeners for drag functionality
  if (carousel) {
    console.log("Setting up drag functionality for carousel");

    // Mouse events
    carousel.addEventListener("mousedown", handleStart);
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);

    // Touch events - make them non-passive to prevent scrolling while dragging
    carousel.addEventListener("touchstart", handleStart, { passive: false });
    carousel.addEventListener("touchmove", handleMove, { passive: false });
    carousel.addEventListener("touchend", handleEnd);

    // Prevent context menu on drag
    carousel.addEventListener("contextmenu", function (e) {
      if (isDragging) {
        e.preventDefault();
      }
    });

    console.log("Drag event listeners attached successfully");
  }

  // Handle focus for keyboard accessibility
  carousel.addEventListener(
    "focus",
    function () {
      stopAutoplay();
    },
    true
  );

  carousel.addEventListener(
    "blur",
    function () {
      startAutoplay();
    },
    true
  );

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (carousel.contains(document.activeElement)) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
        resetAutoplay();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
        resetAutoplay();
      }
    }
  });

  // Pause autoplay when tab is not visible
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  // Handle window resize
  function handleResize() {
    if (!track) return;

    // Reset to ensure we don't go beyond valid range
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    // Update without animation
    track.style.transition = "none";
    const slideWidth = getSlideWidth();
    const translateX = -currentIndex * slideWidth;
    track.style.transform = `translateX(${translateX}px)`;

    createIndicators();
    updateButtons();

    // Re-enable transition after a brief delay
    setTimeout(() => {
      if (track) {
        track.style.transition = "transform 0.5s ease";
      }
    }, 50);
  }

  // Debounce function for resize events
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

  window.addEventListener("resize", debounce(handleResize, 250));

  // Initialize carousel
  createIndicators();
  updateButtons();

  // Force a recalculation of slide widths
  window.dispatchEvent(new Event("resize"));

  // Initial position
  goToSlide(0);

  // Start autoplay with a slight delay to ensure everything is rendered
  setTimeout(() => {
    startAutoplay();
    console.log("Autoplay started");
  }, 1000);

  console.log("Carousel initialized successfully");
}
