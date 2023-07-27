$(function () {
  //Declares input as JS interactive element
  let ingredientSearchInput = $('#ingredientInput');
  //Declares variables for Edmam API key and App ID, both necessary for any call to the API.
  let apiKey = "3c587e98147391cafa125f23b8ed7455";
  let appId = "efaf20c3"
  //PreviousIngredients array contains any ingredients left in local storage with each item separated by a comma
  let previousIngredients = JSON.parse(localStorage.getItem('ingredients')) || [];
  ingredientSearchInput.val(previousIngredients.join(', '));

  //This function renders (or re-renders) the ingreident list every time there is a change made from the current ingrdient list
  function renderIngredientList() {
    let ingredientList = $("#current-ingredient-list");
    ingredientList.empty();
    for (let i = 0; i < previousIngredients.length; i++) {
      let listItem = $("<li>").text(previousIngredients[i]);
      ingredientList.append(listItem);
    }
  }

  // This renders the ingredient list on page load (if anything is in there from the last use)
  renderIngredientList();

  // Click event for the add ingredient button
  $("#add-ingredient").on("click", function (event) {
    event.preventDefault();
    // This ensures that the ingredient gets added to the list as long as it's not already on the list.
    let ingredient = ingredientSearchInput.val().trim();
    if (ingredient && !previousIngredients.includes(ingredient)) {
      //It adds the ingredient to this list of previous ingredients and updates the previousIngredients variable in localStorage
      previousIngredients.push(ingredient);
      localStorage.setItem('ingredients', JSON.stringify(previousIngredients));
      ingredientSearchInput.val(previousIngredients.join(', '));
      //The input is cleared for the next entry, and the render function is called to add the new input to the rendered list
      ingredientSearchInput.val("");
      renderIngredientList();
    } 
    //Find a way to do this without using an alert or get rid of it
    //else {
      //These are alerts if the input is blank or the ingredient is already on the list
      //if (!ingredient) {
        //alert("Please enter an ingredient before adding.");
      //} else {
        //alert("Ingredient already added. Please enter a different ingredient.");
     // }
    //}
  });

  // create click event for ingredient search button
  $("#submit-ingredients").on("click", function (event) {
    event.preventDefault();
    // call function to get recipe data
    getRecipes(previousIngredients);
  });

  $("#clear-ingredients").on("click", function (event) {
    event.preventDefault();
    // Clear ingredient list
    previousIngredients = [];
    localStorage.setItem('ingredients', JSON.stringify(previousIngredients));
    renderIngredientList();
  });

  // This function crafts the query URL that we will use to call the Edmam API
  function getRecipes(ingredients) {
    let queryURL = "https://api.edamam.com/search?q=" + encodeURIComponent(ingredients.join(',')) + "&app_id=" + appId + "&app_key=" + apiKey;
    //This is the ajax fetch call and runs the function createCard with the most popular results from the API
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      createCard(response.hits);
    });
  }
  //The createCard function uses data fetched from the API and populates the recipe container with new results
  function createCard(data) {
    let cardContainer = $("#recipe-container");
    //If there was already content in this container, any new iteration of this function will repopulate with new cards instead of adding to what's already there
    cardContainer.empty();
    //For loop produces three pieces of data in the card, the name of the recipe, the recipe-image, and a link to the recipe
    for (let i = 0; i < data.length; i++) {
      let recipe = data[i].recipe;
      let cardData = {
        title: recipe.label,
        img: recipe.image,
        url: recipe.url,
      };
      //This renders the data as HTML elements and gives them the attributes associated with the data. It appends this information to the card and appends the card to the card container
      let card = $("<div>").addClass("card");
      let title = $("<h3>").text(cardData.title);
      let url = $("<a>").attr("href", cardData.url).text("Click here for recipe");
      let img = $("<img>").attr("src", cardData.img);
      card.append(title, img, url);
      cardContainer.append(card);
    }
  }
});
        //This code loads the IFrame Player API code asynchronously.
        //var tag = document.createElement('script');

        //tag.src = "https://www.youtube.com/iframe_api";
        //var firstScriptTag = document.getElementsByTagName('script')[0];
        //firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        //var player;
        //function onYouTubeIframeAPIReady() {
          //player = new YT.Player('player', {
            //height: '390',
            //width: '640',
            //videoId: 'M7lc1UVf-VE',
            //playerVars: {
              //'playsinline': 1
            //},
            //events: {
              //'onReady': onPlayerReady,
              //'onStateChange': onPlayerStateChange
            //}
          //});
        //}

        // 4. The API will call this function when the video player is ready.
        //function onPlayerReady(event) {
          //event.target.playVideo();
        //}
