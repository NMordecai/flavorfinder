const API_KEY = "24046ec9-e11d-4c1e-ad2b-a9095dcb2903";
const BASE_URL = "https://forkify-api.herokuapp.com/api/v2/recipes";
const CACHE_DURATION_MINUTES = 10;

const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");
const noResultsMessage = document.getElementById("noResultsMessage");
const recipeResults = document.getElementById("recipeResults");

// Show/Hide Messages
function showMessage(el, msg = null) {
    if (msg) {
        const span = el.querySelector("span");
        if (span) span.textContent = msg;
    }
    el.classList.remove("hidden");
}
function hideMessages() {
    errorMessage.classList.add("hidden");
    noResultsMessage.classList.add("hidden");
}
function toggleLoading(show) {
    loadingIndicator.classList.toggle("hidden", !show);
}

// Main fetch function
async function fetchRecipes(query) {
    if (!query.trim()) {
        showMessage(errorMessage, "Please enter a search term.");
        return;
    }

    toggleLoading(true);
    hideMessages();

    const url = `${BASE_URL}?search=${encodeURIComponent(query)}`;

    const cacheKey = btoa(url);
    const cachedData = localStorage.getItem(cacheKey);
    const now = new Date().getTime();

    if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_DURATION_MINUTES * 60 * 1000) {
            displayRecipes(data);
            toggleLoading(false);
            return;
        }
    }

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': API_KEY
            }
        });

        if (!response.ok) {
            const errorJson = await response.json();
            throw new Error(errorJson.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const recipes = data.data.recipes;

        if (recipes.length === 0) {
            showMessage(noResultsMessage);
        } else {
            displayRecipes(recipes);
            localStorage.setItem(cacheKey, JSON.stringify({ data: recipes, timestamp: now }));
        }
    } catch (err) {
        console.error("Fetch error:", err);
        showMessage(errorMessage, `Failed to fetch recipes: ${err.message}`);
    } finally {
        toggleLoading(false);
    }
}

// Display results
function displayRecipes(recipes) {
    recipeResults.innerHTML = "";

    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.className = "bg-white shadow-md rounded-lg overflow-hidden";

        card.innerHTML = `
            <img src="${recipe.image_url}" alt="${recipe.title}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-bold text-gray-800 mb-2">${recipe.title}</h3>
                <p class="text-gray-600 text-sm">By ${recipe.publisher}</p>
                <a href="https://forkify-api.herokuapp.com/api/v2/recipes/${recipe.id}" target="_blank" class="block mt-4 text-blue-600 hover:underline">View Recipe</a>
            </div>
        `;

        recipeResults.appendChild(card);
    });
}

// Event listeners
document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    fetchRecipes(query);
});

document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchRecipes(e.target.value);
    }
});
