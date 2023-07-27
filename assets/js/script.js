$(function () {
    // global variables
    let ingredientSearchInput = $('#ingredientInput');
    let apiKey = "3c587e98147391cafa125f23b8ed7455";
    let appId = "efaf20c3"

    let previousIngredients = JSON.parse(localStorage.getItem('ingredients')) || [];
            ingredientSearchInput.val(previousIngredients.join(', '));
        // function to render the ingredient list
            function renderIngredientList() {
                let ingredientList = $("#current-ingredient-list");
                ingredientList.empty();
                for (let i = 0; i < previousIngredients.length; i++) {
                    let listItem = $("<li>").text(previousIngredients[i]);
                    ingredientList.append(listItem);
                }
            }

            // Render the ingredient list on page load
            renderIngredientList();

            // create click event for ingredient search button
            $("#add-ingredient").on("click", function (event) {
                event.preventDefault();
                // get value from ingredient input
                let ingredient = ingredientSearchInput.val().trim();
                if (ingredient && !previousIngredients.includes(ingredient)) {
                  previousIngredients.push(ingredient);
                  localStorage.setItem('ingredients', JSON.stringify(previousIngredients));
                  ingredientSearchInput.val(previousIngredients.join(', '));
                  ingredientSearchInput.val("");
                  renderIngredientList();
              } else {
                if (!ingredient) {
                  alert("Please enter an ingredient before adding.");
              } else {
                  alert("Ingredient already added. Please enter a different ingredient.");
              }
          }
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
// function to create the recipe cards
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
                    // create card elements
                    let card = $("<div>").addClass("card");
                    let title = $("<h3>").text(cardData.title);
                    let url = $("<a>").attr("href", cardData.url).text("Click here for recipe");
                    let img = $("<img>").attr("src", cardData.img);
                    // append card elements to card
                    card.append(title, img, url);
// append card to card container
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
