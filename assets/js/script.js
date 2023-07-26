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

});



// create function to get the data from the spoonacular API
function getRecipe(ingredientInput) {
    var queryURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" + ingredientInput + "&number=5&apiKey=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        createCard(response);
        var recipeId1 = response[0].id;
        var recipeId2 = response[1].id;
        var recipeId3 = response[2].id;
        var recipeId4 = response[3].id;
        var recipeId5 = response[4].id;
        console.log(recipeId1);
        console.log(recipeId2);
        console.log(recipeId3);
        console.log(recipeId4);
        console.log(recipeId5);
        var recipeIdArray = [recipeId1, recipeId2, recipeId3, recipeId4, recipeId5];
        console.log(recipeIdArray);

        getLink(recipeIdArray);
    });

// create function to retrieve url data from the spoonacular API using the recipe id and loop through the data to get the url
function getLink(recipeIdArray) {
    var recipeUrlArray = [];
    for (var i = 0; i < recipeIdArray.length; i++) {
        var recipeUrl = "https://api.spoonacular.com/recipes/" + recipeIdArray[i] + "/information?apiKey=" + apiKey;
    $.ajax({
        url: recipeUrl,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        var recipeUrl = response.sourceUrl;
        console.log(recipeUrl);
    // add each url to an array
    recipeUrlArray.push(recipeUrl);
    console.log(recipeUrlArray);
});
};
};




function createCard(data) {
    // create card div 
    for (var i = 0; i < data.length; i++) {
    var cardContainer = $("#recipe-container");
    var cardData = {
        title: data[i].title,
        img: data[i].image,
        url: data[i].sourceUrl,
    };
    var card = $("<div>").addClass("card");
    var title = $("<h3>").text(cardData.title);
    var url = $("<a>").attr("href", cardData.url).text("Click here for recipe");
    var img = $("<img>").attr("src", cardData.img);
    card.append(title, img, url);
    cardContainer.append(card);
}}
}});




// var fetchButton = document.getElementById('fetch-button');

// function getApi() {
 
//   var requestUrl = 'https://api.spoonacular.com/recipes/autocomplete?' + apiKey;


//   fetch(requestUrl)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//      console.log(response)
//     })}

// fetchButton.addEventListener('click', getApi);
// });

