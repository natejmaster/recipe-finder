$(function() {

  function displayFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    // Clear the existing favorite recipe container
    let favoriteContainer = $("#favorite-container");
    let noFavoritesMessage = $("#no-favorites-message");
    favoriteContainer.empty();
    // Loop through each saved favorite recipe and create a card for it
    for (let i = 0; i < favorites.length; i++) {
      let cardData = favorites[i];
      let card = $("<div>")
        .addClass("flex flex-col shadow-xl card w-full p-2 m-2 border-4 border-blue-500 border-solid rounded-lg lg:flex-row lg:flex-wrap lg:justify-center lg:w-2/5 lg:mx-auto lg:items-center")
        .attr("id", `fav-card-${i}`);
      let title = $("<h3>")
        .addClass("text-blue-500 w-full text-xl text-center underline")
        .text(cardData.title.length > 32 ? cardData.title.substring(0, 32) + "..." : cardData.title);
      title.attr("data-title", cardData.title);
      let url = $("<a>")
        .addClass("text-xl text-white text-center bg-blue-500 hover:animate-pulse rounded lg:w-full")
        .attr({ href: cardData.url, target: "_blank" })
        .text("Click here for recipe");
      let img = $("<img>")
        .addClass("py-2 w-80 h-80 m-auto flex justify-center")
        .attr("src", cardData.img);
      let removeBtn = $("<button>")
      .addClass("text-xl text-white text-center bg-blue-500 mt-2 hover:animate-pulse rounded lg:w-full")
      .on("click", function() {
        favorites.splice(i, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        displayFavorites();
      })
      .text("Remove this recipe from my favorites");
      card.append(title, img, url, removeBtn);
      favoriteContainer.append(card);
      if (favorites.length > 0) {
        noFavoritesMessage.hide();
      } else {
        noFavoritesMessage.show();
      }
    }
  }
  displayFavorites();
});