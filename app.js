const rmURL = 'https://www.themealdb.com/api/json/v1/1/random.php';
const MealCatURL = 'https://www.themealdb.com/api/json/v1/1/categories.php';
const rmImg = document.getElementById('rmImg');
const rmName = document.getElementById('rmName');
const searchText = document.getElementById('searchText');
const mcSection = document.getElementById('mcSection');
const catName = document.getElementById('catName');
const mealBox = document.getElementById('mealBox');
const modalOverView = document.getElementById('modalOverView');
const mmname = document.getElementById('mmname');
const ingredientsList = document.getElementById('ingredientsList');
const closeButton = document.getElementById('closeButton');

window.addEventListener('DOMContentLoaded', fetchRm);
searchText.addEventListener('input', fetchMealByCat);
closeButton.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

function fetchRm() {
    fetch(rmURL)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            rmImg.src = meal.strMealThumb;
            rmName.textContent = meal.strMeal;
            rmImg.addEventListener('click', () => showModal(meal));
        })
        .catch(error => console.log(error));
}

function fetchMealByCat(event) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.trim() === '') {
        mcSection.style.display = 'none';
        return;
    }

    fetch(MealCatURL)
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            const filteredCategories = categories.filter(category =>
                category.strCategory.toLowerCase().includes(searchTerm)
            );

            if (filteredCategories.length === 0) {
                mcSection.style.display = 'none';
            } else {
                mcSection.style.display = 'block';
                catName.textContent = `Results for "${searchTerm}"`;
                displayMealCards(filteredCategories);
            }
        })
        .catch(error => console.log(error));
}

function displayMealCards(categories) {
    mealBox.innerHTML = '';
    categories.forEach(category => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('meal-card');
        mealCard.innerHTML = `
            <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
            <h3>${category.strCategory}</h3>
        `;
        mealCard.addEventListener('click', () => fetchMealByCat({ target: { value: category.strCategory } }));
        mealBox.appendChild(mealCard);
    });
}

function showModal(meal) {
    modalOverView.style.display = 'block';
    mmname.textContent = meal.strMeal;
    displayIngredients(meal);
}

function displayIngredients(meal) {
    ingredientsList.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = `${measure} ${ingredient}`;
            ingredientsList.appendChild(listItem);
        }
    }
}

function closeModal() {
    modalOverView.style.display = 'none';
}

function outsideClick(event) {
    if (event.target === modalOverView) {
        modalOverView.style.display = 'none';
    }
}
