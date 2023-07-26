// create function to get the data from the spoonacular API

function getRecipe() {
    apiKey = "299e8395c7b0429eb4fe0d1816358c93"
    var indgrediantInpupt = document.getElementById("indgrediantInput").value;
    var url = "https://api.spoonacular.com/recipes/findByIngredients?=$" + indgrediantInpupt "&number=5&apiKey=" + apiKey;
    fetch(url)  //fetching the data from the api
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
}
          