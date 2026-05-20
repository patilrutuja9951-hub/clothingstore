document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  const hero = document.querySelector(".hero-section");
  const categories = document.querySelector(".categories");

  // 🔍 Live UI change while typing
  searchInput.addEventListener("keyup", () => {
    const input = searchInput.value.toLowerCase();

    if (hero && categories) {
      if (input.length > 0) {
        hero.style.display = "none";
        categories.style.display = "none";
      } else {
        hero.style.display = "";
        categories.style.display = "";
      }
    }
  });

  // 🔍 Redirect on Enter key
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      goToSearch();
    }
  });

  // 🔍 Search button click
  window.goToSearch = function () {
    const query = searchInput.value.trim();

    if (query !== "") {
      window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
  };

});