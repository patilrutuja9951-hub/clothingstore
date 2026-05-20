document.addEventListener("DOMContentLoaded", () => {

  const slides = document.querySelectorAll(".slide");

  if (!slides.length) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove("active"));

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add("active");
  }

  // Show first slide (safety)
  showSlide(0);

  // Auto slide every 4 seconds
  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 4000);

});