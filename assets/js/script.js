$(function () {
    let ingredientSearchInput = $('#ingredientInput');
    let apiKey = "299e8395c7b0429eb4fe0d1816358c93";
// create click event for ingredient search button
$("#submit-ingredient").on("click", function (event) {
    event.preventDefault();
    // get value from ingredient input
    var ingredientInput = $("#ingredientInput").val().trim();
    // clear ingredient input
    $("#ingredientInput").val("");
    // call function to get recipe data
    getRecipe(ingredientInput);
    // call function to create card
    createCard();
});

// create card for each recipe
function createCard() {
    // create card
    var card = $("<div>").addClass("card");
    // create card body
    var cardBody = $("<div>").addClass("card-body");
    // create card title
    var cardTitle = $("<h5>").addClass("card-title");
    // create card text
    var cardText = $("<p>").addClass("card-text");
    // create card image
    var cardImage = $("<img>").addClass("card-img-top");
    // append card title to card body
    cardBody.append(cardTitle);
    // append card text to card body
    cardBody.append(cardText);
    // append card image to card body
    cardBody.append(cardImage);
    // append card body to card
    card.append(cardBody);
    // append card to recipe container
    $("#recipe-container").append(card);
}

// create function to get the data from the spoonacular API
function getRecipe(ingredientInput) {
    var queryURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" + ingredientInput + "&number=5&apiKey=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
    });
}




var fetchButton = document.getElementById('fetch-button');

function getApi() {
 
  var requestUrl = 'https://api.spoonacular.com/recipes/autocomplete?' + apiKey;


  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
     console.log(response)
    })}

fetchButton.addEventListener('click', getApi);
});

