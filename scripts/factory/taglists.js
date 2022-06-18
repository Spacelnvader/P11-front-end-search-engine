function onlyUnique (value, index, self) {
    return self.indexOf(value) === index
}

// On push dans un tableau tous les ingrédients de notre fichier data et on les trie par ordre alphabétique
function getIngredients (recipes) {
    const totalIngredients = []
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(object => totalIngredients.push(object.ingredient.toLowerCase()))
    })
    const filteredIngredients = totalIngredients.filter(onlyUnique)
    filteredIngredients.sort((a, b) => a.localeCompare(b))
    return filteredIngredients
}

function getAppliances (recipes) {
    const allAppliances = []
    recipes.forEach(recipe => {
        allAppliances.push(recipe.appliance.toLowerCase())
    })
    const uniqueAppliances = allAppliances.filter(onlyUnique)
    return uniqueAppliances
}

function getUstensils (recipes) {
    const allUstensils = []
    recipes.forEach(recipe => recipe.ustensils.forEach(ustensil => allUstensils.push(ustensil.toLowerCase())))
    const uniqueUstensils = allUstensils.filter(onlyUnique)
    return uniqueUstensils
}

export { getIngredients, getAppliances, getUstensils }