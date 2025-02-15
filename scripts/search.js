import { jsonRecipes } from './data/recipes.js'
import { searchParameters } from './index.js'
import { displayResults } from './display.js'

const recipes = JSON.parse(jsonRecipes)

function updateResults () {
    const result = search(searchParameters)
    displayResults(result)
}

function search (searchParameters) {
    // Checks which keys of searchParameters are empty.
    const activeSearch = {
        ingredients: searchParameters.ingredients.length > 0,
        appliances: searchParameters.appliances.length > 0,
        ustensils: searchParameters.ustensils.length > 0,
        text: searchParameters.textSearch !== ''
    }
    // If all parameters are empty, return an array of numbers from 1 to 50.
    if (Object.values(activeSearch).every(item => item === false)) {
        return [...Array(50).keys()]
    }

    let idsFound = []
    //Bind the search functions to an object key
    // Object.entries(activeSearch).forEach(([key, value]) => {
    //     const searchResults = {
    //         ingredients: () => ingredientsSearch(idsFound),
    //         appliances: () => appliancesSearch(idsFound),
    //         ustensils: () => ustensilsSearch(idsFound),
    //         text: () => keywordSearch(idsFound)
    //     }
    //     if (value) {
    //         // For each existing search parameter, calls the related search function.
    //         const currentBatch = []
    //         currentBatch.push(searchResults[`${key}`]())
    //         if (currentBatch.length === 0) return []
    //         else idsFound = currentBatch.flat()
    //     }
    // })
    //console.log(searchParameters.ustensils)
    for (let i = 0; i < recipes.length; i++) {
        if (recipes[i].name.toLowerCase().includes(searchParameters.textSearch.toLowerCase())
            || recipes[i].description.toLowerCase().includes(searchParameters.textSearch.toLowerCase())) {
            idsFound.push(recipes[i].id)
        }
        else {
            for (let j = 0; j < recipes[i].ingredients.length; j++) {
                if (recipes[i].ingredients[j].ingredient.toLowerCase().includes(searchParameters.textSearch.toLowerCase()) && !idsFound.includes(recipes[i].id)) {
                    idsFound.push(recipes[i].id)
                }
            }
            
        }
    }
    if (activeSearch.ingredients) idsFound = ingredientsSearch(idsFound)    // If the ingredients search is active, calls the ingredientsSearch function.
    if (activeSearch.appliances) idsFound = appliancesSearch(idsFound)    // If the appliances search is active, calls the appliancesSearch function.
    if (activeSearch.ustensils) idsFound = ustensilsSearch(idsFound)    // If the ustensils search is active, calls the ustensilsSearch function. 


    return idsFound
}




function getRecipesById(ids) {
    const result = []
    ids.forEach(id => result.push(recipes.filter(recipe => recipe.id === id)))
    return result.flat()
}

function ustensilsSearch(ids = []) {
    let singleTagMatchR = []
    const singleTagMatchIds = []
    const tags = searchParameters.ustensils
    let recipesToParse
    // If this is the first search function called, iterates over the whole recipes object instead of the idsFound argument.
    if (ids.length === 0) recipesToParse = recipes
    else recipesToParse = getRecipesById(ids)

    tags.forEach(tag => {
        singleTagMatchR = singleTagMatchR.concat(recipesToParse.filter(recipe => recipe.ustensils.includes(tag)))
    })
    singleTagMatchR.forEach(recipe => singleTagMatchIds.push(recipe.id))
    return filterByOccurence(singleTagMatchIds, tags.length)
}

function appliancesSearch(ids = []) {
    let singleTagMatchR = []
    const singleTagMatchIds = []
    const tags = searchParameters.appliances
    let recipesToParse

    if (ids.length === 0) recipesToParse = recipes
    else recipesToParse = getRecipesById(ids)

    tags.forEach(tag => {
        singleTagMatchR = singleTagMatchR.concat(recipesToParse.filter(recipe => recipe.appliance.toLowerCase() === tag))
    })

    singleTagMatchR.forEach(recipe => singleTagMatchIds.push(recipe.id))

    return filterByOccurence(singleTagMatchIds, tags.length)
}

function ingredientsSearch(ids = []) {
    let singleTagMatchR = []
    const singleTagMatchIds = []
    const tags = searchParameters.ingredients
    let recipesToParse

    if (ids.length === 0) recipesToParse = recipes
    else recipesToParse = getRecipesById(ids)

    tags.forEach(tag => {
        singleTagMatchR = singleTagMatchR.concat(recipesToParse.filter(recipe => hasIngredient(recipe, tag)))
    })

    singleTagMatchR.forEach(recipe => singleTagMatchIds.push(recipe.id))

    return filterByOccurence(singleTagMatchIds, tags.length)
}


// tableau d'id des recettes qui ont match 1 ou plusieurs tags
// 1 ID par match donc on peut retrouver plusieurs occurences pour 1 id
// Cette fonction retourne uniquement les recettes correspondant à tous les tags sélectionnées

function filterByOccurence(arrayOfMatchingIds, idOccurence) {
    const idCount = {}
    const result = []

    arrayOfMatchingIds.forEach(id => {
        if (idCount[id] === undefined) idCount[id] = 1
        else idCount[id] += 1
    })

    Object.entries(idCount).forEach(([id, count]) => {
        if (count === idOccurence) result.push(parseInt(id))
    })

    return result

}

function hasIngredient(recipe, tag) {
    if (recipe.ingredients.find(object => object.ingredient.toLowerCase().includes(tag))) return true
    return false
}

export { updateResults }