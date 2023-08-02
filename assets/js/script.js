//Stores all JS within a jquery function so it won't load until the HTML is done loading
$(function () {
  //Declares global variables referenced more than once
  let ingredientSearchInput = $("#ingredientInput");
  let apiKey = "3c587e98147391cafa125f23b8ed7455";
  let appId = "efaf20c3";
  //Declares specific elements acted upon by JS interactivity
  let clearIngredients = document.getElementById("clear-ingredients");
  let spinner = document.getElementById("search-icon");
  let seachButton = document.getElementById("submit-ingredients");
  let clearRecipes = document.getElementById("clear-recipes");
  let previousIngredients =
    JSON.parse(localStorage.getItem("ingredients")) || [];
  let indgredientbounce = document.getElementById("add-ingredient");
  ingredientSearchInput.val(previousIngredients.join(", "));
  // clears the input field on page load
  ingredientSearchInput.val("");
  //Function that saves favorites to local storage for access on the favorites page
  function saveToLocalStorage(recipeData) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.some(favorite => favorite.title === recipeData.title)) {
      //Modal warning if a user tries to save a recipe that's already been saved.
      $('#my_modal_5 h3').text("This recipe is already in your favorites!");
      my_modal_5.showModal();
    } else {
      //If the recipe is a new favorite, it is pushed to local storage in the favorites array
      favorites.push(recipeData);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }
  //This function adjusts the mobile and tablet layouts to move the rest of the UI slightly down when the autocomplete suggestions are active
  function adjustLayout() {
    const hasAutocompleteSuggestions = $('.ui-autocomplete').is(':visible');
    if (hasAutocompleteSuggestions) {
      $('#user-input-card').addClass("has-suggestions");
    } else {
      $('#user-input-card').removeClass("has-suggestions");
    }
  }
  // This is an event handler that hides the autocomplete suggestions when the input is not actively clicked on
  ingredientSearchInput.on("blur", function () {
    $(".ui-helper-hidden-accessible").hide();
    adjustLayout();
  });
  //This is the API request to Spoonacular that uses the live-input keystrokes and lists the 10 most similar terms
  ingredientSearchInput.autocomplete({
    source: function (request, response) {
      $.ajax({
        url: `https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=4e4647d84528456f9b104d9f1dd55158&query=${request.term}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
          const matches = data.map((item) => item.name);
          response(matches);
        },
        error: function (error) {
          console.error("Error fetching ingredient suggestions:", error);
        },
      });
    },
    //Activates the layout adjustment function and the autocomplete function when at least two characters are added to the input
    minLength: 2,
    open: function () {
      adjustLayout();
    },
    close: function () {
      adjustLayout();
    }
  });
  //This function takes the ingredients stored in localStorage and renders them to the UI in the current ingredients div
  function renderIngredientList() {
    let ingredientList = $("#current-ingredient-list");
    ingredientList.empty();
    //Each ingredient is rendered with a box that can remove the item from the list individually
    for (let i = 0; i < previousIngredients.length; i++) {
      let listItem = $("<li>").addClass("ingredient-item");
      let ingredientText = $("<span>").text(previousIngredients[i]);
      let removeIcon = $("<span>").text("  [X]").addClass("remove-icon hover:text-red-500 hover:cursor-pointer");
      //Event listener to remove individual ingredients
      removeIcon.on('click', function () {
        removeIngredient(i);
      });
      //Appends text and remove icons to the list item, appends the list item to the ingredient list
      listItem.append(ingredientText, removeIcon);
      ingredientList.append(listItem);
    }
  }
  //This function removes a single ingredient from the list without clearing the entire list
  function removeIngredient(index) {
    previousIngredients.splice(index, 1);
    localStorage.setItem('ingredients', JSON.stringify(previousIngredients));
    renderIngredientList();
  }
  // This renders the ingredient list on page load (if anything is in there from the last use)
  if (previousIngredients.length > 0) {
    renderIngredientList();
    seachButton.classList.remove("hidden");
  }
  // Click event and keydown enter event for adding ingredients to the list
  $("#add-ingredient").on("click", function (event) {
    event.preventDefault();
    addAnimationBounce();
    setTimeout(removeAnimationBounce, 500);
    // This ensures that the ingredient gets added to the list as long as it's not already on the list.
    let ingredient = ingredientSearchInput.val().trim();
    if (ingredient && !previousIngredients.includes(ingredient)) {
      //It adds the ingredient to this list of previous ingredients and updates the previousIngredients variable in localStorage
      previousIngredients.push(ingredient);
      localStorage.setItem("ingredients", JSON.stringify(previousIngredients));
      ingredientSearchInput.val(previousIngredients.join(", "));
      //The input is cleared for the next entry, and the render function is called to add the new input to the rendered list
      ingredientSearchInput.val("");
      renderIngredientList();
      seachButton.classList.remove("hidden");
    } else {
      //These are alerts if the input is blank or the ingredient is already on the list
      if (!ingredient) {
        $("#my_modal_5 h3").text("Please enter a valid ingredient!");
        my_modal_5.showModal();
      }
      if (previousIngredients.includes(ingredient)) {
        $("#my_modal_5 h3").text("Please type an ingredient not already on the list!");
        my_modal_5.showModal();
      }
    }
  });
  // This is the click event for the ingredient search button
  $("#submit-ingredients").on("click", function (event) {
    event.preventDefault();
    addAnimationSpin();
    setTimeout(removeAnimationSpin, 2000);
    // shows the recipe clear button
    clearRecipes.classList.remove("hidden");
    // call function to get recipe data
    getRecipes(previousIngredients);
  });
  //This is the click event for the clear ingredients button
  $("#clear-ingredients").on("click", function (event) {
    event.preventDefault();
    addAnimationClass();
    setTimeout(removeAnimationClass, 1000);
    // Clear ingredient list
    previousIngredients = [];
    localStorage.setItem("ingredients", JSON.stringify(previousIngredients));
    seachButton.classList.add("hidden");
    renderIngredientList();
  });
  // This is the click event for the clear recipes button
  $("#clear-recipes").on("click", function (event) {
    event.preventDefault();
    addAnimationClassRecipe();
    setTimeout(removeAnimationClassRecipe, 1000);
    // // hides the recipe clear button after 1 second
    setTimeout(function () {
      clearRecipes.classList.add("hidden");
    }, 1000);
    // This clears the recipe container
    $("#recipe-container").empty();
  });
  // function to add spin animation to clear icon
  function addAnimationClass() {
    clearIngredients.classList.add("animate-spin");
  }
  // function to remove spin animation from clear icon
  function removeAnimationClass() {
    clearIngredients.classList.remove("animate-spin");
  }
  // function to add spin to clear recipe button
  function addAnimationClassRecipe() {
    clearRecipes.classList.add("animate-spin");
  }
  // function to remove spin from clear recipe button
  function removeAnimationClassRecipe() {
    clearRecipes.classList.remove("animate-spin");
  }
  // function to add spin animation to search icon
  function addAnimationSpin() {
    spinner.classList.add("loading", "loading-spinner");
  }
  // function to remove spin animation from search icon
  function removeAnimationSpin() {
    spinner.classList.remove("loading", "loading-spinner");
  }
  // function to add bounce animation to add ingredient button
  function addAnimationBounce() {
    indgredientbounce.classList.add("animate-bounce");
  }
  // function to remove bounce animation from add ingredient button
  function removeAnimationBounce() {
    indgredientbounce.classList.remove("animate-bounce");
  }
  //This function calls the recipes from the Edmam API based on current ingredients
  function getRecipes(ingredients) {
    //This variable designs the query specifics for the UI call with the API key and the ingredients
    let queryURL =
      "https://api.edamam.com/search?q=" +
      encodeURIComponent(ingredients.join(",")) +
      "&app_id=" +
      appId +
      "&app_key=" +
      apiKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      if (response.hits.length === 0) {
        // Display the error modal with an appropriate message
        $("#my_modal_5 h3").text("No recipes found with the provided ingredients! Please remove at least one ingredient from the list and try again!");
        my_modal_5.showModal();
      } else {
        // Call the function to create recipe cards
        createCard(response.hits);
      }
    });
    //This function creates the recipe cards for each result from the Edmam API call
    function createCard(data) {
      let cardContainer = $("#recipe-container");
      cardContainer.empty();
      //For loop creates a card and individual elements for each data object from the Edmam API fetch call
      for (let i = 0; i < data.length; i++) {
        let recipe = data[i].recipe;
        let cardData = {
          title: recipe.label,
          img: recipe.image,
          url: recipe.url,
        };
        //Individual elements (the card, the title, the link to the recipe, the image, the save button, and the container iframe for the youtube video are created for each recipe)
        let card = $("<div>")
          .addClass(
            "flex flex-col shadow-xl shadow-blue-500/50 w-full card p-2 m-2 border-4 border-blue-500 border-solid rounded-lg lg:flex-row lg:flex-wrap"
          )
          .attr("id", `card-${i}`);
        let title = $("<h3>")
          .addClass("text-blue-500 w-full text-xl text-center underline")
          .text(cardData.title);
        title.attr("data-title", recipe.label);
        let url = $("<a>")
          .addClass(
            "text-xl text-white text-center bg-blue-500 hover:animate-pulse rounded lg:w-full"
          )
          .attr({ href: cardData.url, target: "_blank" })
          .text("Click here for recipe");
        let img = $("<img>")
          .addClass("py-2 w-80 h-80 m-auto flex justify-center")
          .attr("src", cardData.img);
        let youtubeIframe = $("<iframe>")
          .addClass("youtube-iframe flex justify-center mb-4 mx-auto")
          .attr("allowfullscreen", "true");
        let favBtn = $("<button>")
          .addClass("text-xl text-white text-center bg-blue-500 hover:animate-pulse mt-2 rounded lg:w-full")
          .text("Save to Favorites")
          //This is a click event for the Save to Favorites button
          .on('click', function () {
            saveToLocalStorage(cardData)
          });
        //Appends the data to each card, appends each card to the card container
        card.append(title, img, youtubeIframe, url, favBtn);
        cardContainer.append(card);
          //Runs the fetchYouTubeVideo function to push relevant Youtube videos into the iframe
          fetchYouTubeVideo(cardData.title, youtubeIframe);
      }
    }
    //This function calls YouTube's API and populates the rendered iFrames with the most popular youtube clip relevant to that dish
    function fetchYouTubeVideo(title, iframeElement) {
      let youtubeApiKey = "AIzaSyDdMfo6k-etcL7oi7YvD2TwsblpuX4nZMU";
      let query = encodeURIComponent(`${title} recipe`);
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&type=video&key=${youtubeApiKey}`;
      $.ajax({
        url: url,
        method: "GET",
      }).then(function (response) {
        if (response.items.length > 0) {
          let videoId = response.items[0].id.videoId;
          let youtubeURL = `https://www.youtube.com/embed/${videoId}`;
          // Set the iframe's src attribute to the YouTube video URL.
          iframeElement.attr("src", youtubeURL);
        } else {
          console.log("No YouTube video found for the given title.");
        }
      });
    }
  }
});