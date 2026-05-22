document.addEventListener("DOMContentLoaded", () => {

  const slides = document.querySelectorAll(".slide");

  if (!slides || slides.length === 0) return;

  let currentSlide = 0;

  // ================= SHOW SLIDE =================

  function showSlide(index) {

    slides.forEach(slide => {
      slide.classList.remove("active");
    });

    currentSlide =
      (index + slides.length) % slides.length;

    slides[currentSlide].classList.add("active");
  }

  // ================= INITIAL SLIDE =================

  showSlide(0);

  // ================= AUTO SLIDER =================

  const slideInterval = setInterval(() => {

    showSlide(currentSlide + 1);

  }, 4000);

});