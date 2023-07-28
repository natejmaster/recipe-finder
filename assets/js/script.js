$(function () {
    let ingredientSearchInput = $('#ingredientInput');
    let apiKey = "3c587e98147391cafa125f23b8ed7455";
    let appId = "efaf20c3"

    let previousIngredients = JSON.parse(localStorage.getItem('ingredients')) || [];
            ingredientSearchInput.val(previousIngredients.join(', '));

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

            // create function to get the data from the Edamam API
            function getRecipes(ingredients) {
                let queryURL = "https://api.edamam.com/search?q=" + encodeURIComponent(ingredients.join(',')) + "&app_id=" + appId + "&app_key=" + apiKey;

                $.ajax({
                    url: queryURL,
                    method: "GET",
                }).then(function (response) {
                    console.log(response);
                    createCard(response.hits);
                });
            }

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
                    if (cardData.title.length > 40) {
                        cardData.title = cardData.title.substring(0, 40) + "...";
                    }
                    let card = $("<div>").addClass("card w-84 h-100 flex flex-col p-2 m-2 border-4 border-blue-500 border-solid rounded-lg");
                    let title = $("<h3>").addClass("max-w-64 text-blue-500 text-xl m-auto underline truncate").text(cardData.title);
                    let url = $("<a>").addClass("text-xl text-white text-center bg-blue-500 hover:bg-blue-600 rounded").attr("href", cardData.url).text("Click here for recipe");
                    let img = $("<img>").addClass("py-2 h-5rem w-5rem m-auto flex justify-center ").attr("src", cardData.img);
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
