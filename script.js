let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

searchBtn.addEventListener("click", () => {
  let userInp = document.getElementById("user-inp").value.trim();
  result.innerHTML = "";

  if (userInp.length === 0) {
    result.innerHTML = `<h3>Input Field Cannot Be Empty</h3>`;
    return;
  }

  fetch(url + userInp)
    .then((res) => res.json())
    .then((data) => {
      if (!data.meals) {
        result.innerHTML = `<h3>No Results Found</h3>`;
        return;
      }

      data.meals.forEach((meal, index) => {
        let ingredients = [];
        for (let i = 1; i <= 20; i++) {
          let ingredient = meal[`strIngredient${i}`];
          let measure = meal[`strMeasure${i}`];
          if (ingredient && ingredient.trim() !== "") {
            ingredients.push(`${measure} ${ingredient}`);
          }
        }

        const mealCard = document.createElement("div");
        mealCard.classList.add("meal-card");
        mealCard.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <div class="details">
            <h2>${meal.strMeal}</h2>
            <h4>${meal.strArea}</h4>
          </div>
          <div class="ingredient-con">
            <ul>
              ${ingredients.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
          <button class="toggle-recipe" data-id="${index}">View Recipe</button>
          <div class="recipe hidden" id="recipe-${index}">
            <pre>${meal.strInstructions}</pre>
          </div>
        `;

        result.appendChild(mealCard);
      });

      // Show/hide recipe
      document.querySelectorAll(".toggle-recipe").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          const recipeDiv = document.getElementById(`recipe-${id}`);
          recipeDiv.classList.toggle("hidden");
          btn.textContent = recipeDiv.classList.contains("hidden")
            ? "View Recipe"
            : "Hide Recipe";
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      result.innerHTML = `<h3>Something went wrong. Please try again.</h3>`;
    });
});
