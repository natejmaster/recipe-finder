$(function () {
  let ingredientSearchInput = $("#ingredientInput");
  let apiKey = "3c587e98147391cafa125f23b8ed7455";
  let appId = "efaf20c3";
  let clearIngredients = document.getElementById("clear-ingredients");
  let spinner = document.getElementById("search-icon");
  let seachButton = document.getElementById("submit-ingredients");
  let previousIngredients =
    JSON.parse(localStorage.getItem("ingredients")) || [];
  let indgredientbounce = document.getElementById("add-ingredient");
  ingredientSearchInput.val(previousIngredients.join(", "));
  // clears the input field on page load
  ingredientSearchInput.val("");

  function adjustLayout() {
    const hasAutocompleteSuggestions = $('.ui-autocomplete').is(':visible');
    if (hasAutocompleteSuggestions) {
      $('#user-input-card').addClass("has-suggestions");
    } else {
      $('#user-input-card').removeClass("has-suggestions");
    }
  }
  // Add event handler for when the input field loses focus
  ingredientSearchInput.on("blur", function () {
    $(".ui-helper-hidden-accessible").hide();
    adjustLayout();
  });

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
    minLength: 2,
    open: function () {
      adjustLayout();
    },
    close: function () {
      adjustLayout();
    }
  });
  function renderIngredientList() {
    let ingredientList = $("#current-ingredient-list");
    ingredientList.empty();
    for (let i = 0; i < previousIngredients.length; i++) {

      let listItem = $("<li>").addClass("ingredient-item");
      let ingredientText = $("<span>").text(previousIngredients[i]);
      let removeIcon = $("<span>").text("  [X]").addClass("remove-icon hover:text-red-500 hover:cursor-pointer");
      removeIcon.on('click', function () {
        removeIngredient(i);
      });
      listItem.append(ingredientText, removeIcon);
      ingredientList.append(listItem);
    }
  }

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
    }
    //Find a way to do this without using an alert or get rid of it
    else {
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
  // function to add spin animation to clear icon
  function addAnimationClass() {
    clearIngredients.classList.add("animate-spin");
  }
  // function to remove spin animation from clear icon
  function removeAnimationClass() {
    clearIngredients.classList.remove("animate-spin");
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
  function getRecipes(ingredients) {
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
          .text(
            cardData.title.length > 32
              ? cardData.title.substring(0, 32) + "..."
              : cardData.title
          );
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
        card.append(title, img, youtubeIframe, url);
        cardContainer.append(card);
        if (i < 3) {
          fetchYouTubeVideo(cardData.title, youtubeIframe);
        }
      }
    }
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
    }
  }
});