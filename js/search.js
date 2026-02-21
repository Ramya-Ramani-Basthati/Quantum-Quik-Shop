document.addEventListener("DOMContentLoaded", function () {

  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");

  if (!searchBtn || !searchInput) return;

  function performSearch() {
    const query = searchInput.value.trim();

    if (query === "") {
      alert("Please enter something to search.");
      return;
    }

    localStorage.setItem("qqs_search_query", query);
    window.location.href = "search-results.html";
  }

  searchBtn.addEventListener("click", performSearch);

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      performSearch();
    }
  });

});
