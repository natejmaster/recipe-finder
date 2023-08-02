$(function() {

  function displayFavorites() {
    // grabs the favorites string and stores it in the favorites variable
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    // Clear the existing favorite recipe container
    let favoriteContainer = $("#favorite-container");
    favoriteContainer.empty();
    // Loop through each saved favorite recipe and create a card for it
    for (let i = 0; i < favorites.length; i++) {
      let cardData = favorites[i];
      let card = $("<div>")
        .addClass("flex flex-col shadow-xl w-full card p-2 m-2 border-4 border-blue-500 border-solid rounded-lg lg:flex-row lg:flex-wrap")
        .attr("id", `fav-card-${i}`);
        // creates html elements for cardData and stores them at cardData.title
      let title = $("<h3>")
        .addClass("text-blue-500 w-full text-xl text-center underline")
        .text(cardData.title.length > 32 ? cardData.title.substring(0, 32) + "..." : cardData.title);
      title.attr("data-title", cardData.title);
      //creates html elements that when clicked on direct the user to cardData.url
      let url = $("<a>")
        .addClass("text-xl text-white text-center bg-blue-500 hover:animate-pulse rounded lg:w-full")
        .attr({ href: cardData.url, target: "_blank" })
        .text("Click here for recipe");
      let img = $("<img>")
        .addClass("py-2 w-80 h-80 m-auto flex justify-center")
        .attr("src", cardData.img);
      card.append(title, img, url);
      favoriteContainer.append(card);
    }
  }
  displayFavorites();
});