// This is a test script specifically for debugging the about page navbar
console.log("About page script loaded");

// Check if we're on the about page
if (document.querySelector(".nma-about-header")) {
  console.log("About page detected");

  // Add a direct event listener for the sticky navbar on the about page
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    console.log("About page scroll position:", scrolled);

    const navbar = document.getElementById("nmaNavbar");
    const topBar = document.querySelector(".nma-top-bar");
    const topBarHeight = topBar ? topBar.offsetHeight : 0;

    console.log("About page navbar found:", !!navbar);
    console.log("About page top bar height:", topBarHeight);

    if (scrolled > topBarHeight && navbar) {
      navbar.classList.add("nma-sticky");
      console.log("Added sticky class on about page");
    } else if (navbar) {
      navbar.classList.remove("nma-sticky");
      console.log("Removed sticky class on about page");
    }
  });

  // Force check on page load
  setTimeout(function () {
    const scrolled = window.pageYOffset;
    const navbar = document.getElementById("nmaNavbar");
    const topBar = document.querySelector(".nma-top-bar");
    const topBarHeight = topBar ? topBar.offsetHeight : 0;

    console.log("About page initial check:");
    console.log("- Scroll position:", scrolled);
    console.log("- Navbar found:", !!navbar);
    console.log("- Top bar height:", topBarHeight);

    if (scrolled > topBarHeight && navbar) {
      navbar.classList.add("nma-sticky");
      console.log("Added sticky class on about page load");
    }
  }, 1000);
}
