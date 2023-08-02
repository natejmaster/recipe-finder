$(function () {
  //Declaration of global variables used in multiple functions or events
  let apiKey = "3c587e98147391cafa125f23b8ed7455";
  let appId = "efaf20c3";
  //Variable declaration of interactive html features
  let ingredientSearchInput = $("#ingredientInput");
  let clearIngredients = $("#clear-ingredients");
  let spinner = $("#search-icon");
  let seachButton = $("#submit-ingredients");
  let indgredientbounce = $("#add-ingredient");
  //Calls previous ingredients from localStorage
  let previousIngredients = JSON.parse(localStorage.getItem("ingredients")) || [];
  ingredientSearchInput.val(previousIngredients.join(", "));
  // clears the ingredient search input field on page load
  ingredientSearchInput.val("");
  //Function to save recipe to favorites in localStorage
  function saveToLocalStorage(recipeData) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    //Check to ensure recipe isn't already in favorites, calls error modal in case of repeat
    if (favorites.some(favorite => favorite.title === recipeData.title)) {
      $('#my_modal_5 h3').text("This recipe is already in your favorites!");
      my_modal_5.showModal();
      //Pushes recipe data to list of favorites in localStorage (to be rendered in a separate document)
    } else {
      favorites.push(recipeData);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }
  //Function to ensure that when autocomplete function is active, other page elements vacate space to avoid overlap
  function adjustLayout() {
    //Checks for the presence of autocomplete suggestions in the UI
    const hasAutocompleteSuggestions = $('.ui-autocomplete').is(':visible');
    if (hasAutocompleteSuggestions) {
      //Adds or removes the class "has-suggestions" depending on case
      $('#user-input-card').addClass("has-suggestions");
    } else {
      $('#user-input-card').removeClass("has-suggestions");
    }
  }
  // Event handler to hide autocomplete suggestions when user clicks away from ingredient input box
  ingredientSearchInput.on("blur", function () {
    $(".ui-helper-hidden-accessible").hide();
    adjustLayout();
  });
  //API call to Spoonacular for ingredient autocomplete suggestions based on keystrokes
  ingredientSearchInput.autocomplete({
    source: function (request, response) {
      //Ajax call in template literal format to replace ${request.term} with current text in ingredient input
      $.ajax({
        url: `https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=4e4647d84528456f9b104d9f1dd55158&query=${request.term}`,
        method: 'GET',
        dataType: 'json',
        //Matches current input with up to 10 suggestions with names closest to what is currently in the input
        success: function (data) {
          const matches = data.map((item) => item.name);
          response(matches);
        },
        //Logs an error to the console in case of failure to fetch autocompletions
        error: function (error) {
          console.error("Error fetching ingredient suggestions:", error);
        },
      });
    },
   //Once two characters have been entered into ingredient input, the autocomplete is called and the layout is adjusted to fit suggestions
   minLength: 2,
   open: function () {
     adjustLayout();
   },
   //adjustLayout closes/deactivates when suggestions are not present
   close: function () {
     adjustLayout();
   }
 });
   //Function to render ingredients (called by event listener on search button)
   function renderIngredientList() {
    let ingredientList = $("#current-ingredient-list");
    ingredientList.empty();
    //For loop iterates once each time creating a list item, a remove icon, and rendering these to the current ingredients list
    for (let i = 0; i < previousIngredients.length; i++) {
      let listItem = $("<li>").addClass("ingredient-item");
      let ingredientText = $("<span>").text(previousIngredients[i]);
      let removeIcon = $("<span>").text("  [X]").addClass("remove-icon hover:text-red-500 hover:cursor-pointer");
      //Event listener for the remove button for individual ingredients in current ingredients
      removeIcon.on('click', function () {
        removeIngredient(i);
      });
      //Appends the text and icon to the list item, and the list item to the list
      listItem.append(ingredientText, removeIcon);
      ingredientList.append(listItem);
    }
  }
 //This function is carried out when an ingredient is removed from the current ingredient list individually. It removes that value from localStorage and re-renders the list without the removed item
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
// create click event for ingredient search button
$("#submit-ingredients").on("click", function (event) {
  event.preventDefault();
  addAnimationSpin();
  setTimeout(removeAnimationSpin, 2000);
  // call function to get recipe data
  getRecipes(previousIngredients);
});
//Event listener for clear ingredients button
$("#clear-ingredients").on("click", function (event) {
  event.preventDefault();
  addAnimationClass();
  setTimeout(removeAnimationClass, 1000);
  // Sets ingredients array in localStorage to an empty array and sets the empty array to localStorage to clear the list on the server-side as well
  previousIngredients = [];
    localStorage.setItem("ingredients", JSON.stringify(previousIngredients));
    seachButton.classList.add("hidden");
    renderIngredientList();
  });
  // Event listener for clear recipes button
  $("#clear-recipes").on("click", function (event) {
    event.preventDefault();
    addAnimationClassRecipe();
    setTimeout(removeAnimationClassRecipe, 1000);
    // // hides the recipe clear button after 1 second
    setTimeout(function () {
      clearRecipes.classList.add("hidden");
    }, 1000);
    // clear recipe container
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
 //The application's main function that calls the Edmam API to fetch recipes based on our list of ingredients
 function getRecipes(ingredients) {
  //Creates the syntax of our API query based on ingredients stored in localStorage
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
  //Following the recipe fetch, this function creates the individualized recipe cards using data from the Edmam fetch request
  function createCard(data) {
    let cardContainer = $("#recipe-container");
    cardContainer.empty();
    for (let i = 0; i < data.length; i++) {
      let recipe = data[i].recipe;
      let cardData = {
        //These pieces of information are pulled and declared to create the form of the recipe cards
        title: recipe.label,
        img: recipe.image,
        url: recipe.url,
      };
      //This portion of the function creates the card div with applicable Tailwind classes and attributes
      let card = $("<div>")
        .addClass(
          "flex flex-col shadow-xl shadow-blue-500/50 w-full card p-2 m-2 border-4 border-blue-500 border-solid rounded-lg lg:flex-row lg:flex-wrap"
        )
        .attr("id", `card-${i}`);
      //This creates a header with the title on each recipe card
      let title = $("<h3>")
        .addClass("text-blue-500 w-full text-xl text-center underline")
        .text(
          cardData.title.length > 32
            ? cardData.title.substring(0, 32) + "..."
            : cardData.title
        );
      title.attr("data-title", recipe.label);
      //This creates a link to the recipe at the bottom of each recipe card
      let url = $("<a>")
        .addClass(
          "text-xl text-white text-center bg-blue-500 hover:animate-pulse rounded lg:w-full"
        )
        .attr({ href: cardData.url, target: "_blank" })
        .text("Click here for recipe");
      //This pulls an image from the database for that recipe and stores it on the recipe card
      let img = $("<img>")
        .addClass("py-2 w-80 h-80 m-auto flex justify-center")
        .attr("src", cardData.img);
      //This creates the iframe on the recipe card that will later be populated with a Youtube clip
      let youtubeIframe = $("<iframe>")
        .addClass("youtube-iframe flex justify-center mb-4 mx-auto")
        .attr("allowfullscreen", "true");
      //This creates a button that adds a recipe to the user's favorites (which will be re-rendered on another page)
      let favBtn = $("<button>")
        .addClass("text-xl text-white text-center bg-blue-500 hover:animate-pulse mt-2 rounded lg:w-full")
        .text("Save to Favorites")
        .on('click', function () {
          saveToLocalStorage(cardData)
        });
      //All individual elements are appended to the recipe card, cards are rendered to the card container
      card.append(title, img, youtubeIframe, url, favBtn);
      cardContainer.append(card);
      //current throttling of youtube iframe population
      if (i < 3) {
        fetchYouTubeVideo(cardData.title, youtubeIframe);
      }
    }
  }
  //Function to call Youtube API and populate recipe card iframes with appropriate videos
  function fetchYouTubeVideo(title, iframeElement) {
    let youtubeApiKey = "AIzaSyDQtVi_nUX7iWI_D47-g_1GMF2ptleFlcM";
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
    function createCard(data) {
      let cardContainer = $("#recipe-container");
      cardContainer.empty();
      for (let i = 0; i < data.length; i++) {
        let recipe = data[i].recipe;
        let cardData = {
          title: recipe.label,
          img: recipe.image,
          url: recipe.url,
        };
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
         .on ('click', function() {
             saveToLocalStorage(cardData)
         });
        card.append(title, img, youtubeIframe, url, favBtn);
        cardContainer.append(card);
        if (i < 3) {
          fetchYouTubeVideo(cardData.title, youtubeIframe);
        }
      }
    }
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
    $('.addToFavBtn').on('click', event => {
    });

  }
}
});