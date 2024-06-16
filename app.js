// API URLs
const randomMealURL = 'https://www.themealdb.com/api/json/v1/1/random.php';
const mealCategoriesURL = 'https://www.themealdb.com/api/json/v1/1/categories.php';

// DOM Elements
const randomMealImage = document.getElementById('randomMealImage');
const randomMealName = document.getElementById('randomMealName');
const searchInput = document.getElementById('searchInput');
const mealCategoriesSection = document.getElementById('mealCategoriesSection');
const categoryName = document.getElementById('categoryName');
const mealGrid = document.getElementById('mealGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modalMealName = document.getElementById('modalMealName');
const ingredientsList = document.getElementById('ingredientsList');
const closeBtn = document.getElementById('closeBtn');

// Event Listeners
window.addEventListener('DOMContentLoaded', fetchRandomMeal);
searchInput.addEventListener('input', fetchMealsByCategory);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

// Functions
function fetchRandomMeal() {
    fetch(randomMealURL)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            randomMealImage.src = meal.strMealThumb;
            randomMealName.textContent = meal.strMeal;
            randomMealImage.addEventListener('click', () => showModal(meal));
        })
        .catch(error => console.log(error));
}

function fetchMealsByCategory(event) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.trim() === '') {
        mealCategoriesSection.style.display = 'none';
        return;
    }

    fetch(mealCategoriesURL)
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            const filteredCategories = categories.filter(category =>
                category.strCategory.toLowerCase().includes(searchTerm)
            );

            if (filteredCategories.length === 0) {
                mealCategoriesSection.style.display = 'none';
            } else {
                mealCategoriesSection.style.display = 'block';
                categoryName.textContent = `Results for "${searchTerm}"`;
                displayMealCards(filteredCategories);
            }
        })
        .catch(error => console.log(error));
}

function displayMealCards(categories) {
    mealGrid.innerHTML = '';
    categories.forEach(category => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('meal-card');
        mealCard.innerHTML = `
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
            <h3>${category.strCategory}</h3>
        `;
        mealCard.addEventListener('click', () => fetchMealsByCategory({ target: { value: category.strCategory } }));
        mealGrid.appendChild(mealCard);
    });
}

function showModal(meal) {
    modalOverlay.style.display = 'block';
    modalMealName.textContent = meal.strMeal;
    displayIngredients(meal);
}

function displayIngredients(meal) {
    ingredientsList.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
    }
}