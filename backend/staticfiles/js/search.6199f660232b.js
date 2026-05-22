document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  const hero = document.querySelector(".hero-section");
  const categories = document.querySelector(".categories");

  // ================= LIVE SEARCH UI =================

  searchInput.addEventListener("input", () => {

    const input = searchInput.value.trim();

    if (hero) {
      hero.style.display = input ? "none" : "";
    }

    if (categories) {
      categories.style.display = input ? "none" : "";
    }

  });

  // ================= ENTER KEY SEARCH =================

  searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

      event.preventDefault();

      goToSearch();
    }

  });

  // ================= SEARCH REDIRECT =================

  window.goToSearch = function () {

    const query = searchInput.value.trim();

    if (!query) return;

    window.location.href =
      `/products.html?search=${encodeURIComponent(query)}`;
  };

});