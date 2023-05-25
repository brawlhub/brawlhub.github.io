// Take string and split it into array of strings. Each string is a line from the input.
function splitString(stringToSplit) {
    let arrayOfStrings = stringToSplit.split('\n');
    return arrayOfStrings;
}

// Clean up MTG decklist by removing numbers and set codes
// For example: 1 Plains (und) 87 becomes Plains
function cleanUp(array) {
    let newArray = [];
    // Loop through each line of the array
    for (let i = 0; i < array.length; i++) {
        // Discard line if it is exactly 'Commander' or 'Deck' or empty
        if (array[i] === 'Commander' || array[i] === 'Deck' || array[i] === '') {
            continue;
        }

        // Extract card name from each line
        let cardName = array[i].substring(2);
        // Remove set code and collector number from card name if they exist
        if (cardName.includes('(')) {
            cardName = cardName.substring(0, cardName.indexOf('(') - 1);
        }

        // Add card name to new array
        newArray.push(cardName);
    }
    return newArray;
}



// Take multiple arrays as input and return multidimensional array with common elements in the first column and the number of occurrences in the second column. The result should be sorted by the number of occurrences in descending order.
function compare(... arrays) {
    let result = [];
    let count = 0;
    let temp = [];
    for (let i = 0; i < arrays.length; i++) {
        for (let j = 0; j < arrays[i].length; j++) {
            if (temp.indexOf(arrays[i][j]) === -1) {
                temp.push(arrays[i][j]);
            }
        }
    }
    for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < arrays.length; j++) {
            if (arrays[j].indexOf(temp[i]) !== -1) {
                count++;
            }
        }
        result.push([temp[i], count]);
        count = 0;
    }
    result.sort(function(a, b) {
        return b[1] - a[1];
    });
    return result;
}

var deckInput = `<div class="deck" display="inline">
<label display="block" for="deck">Decklist:</label>
<textarea name="deck" id="deck" cols="30" rows="10"></textarea>
</div>`;


// Add deck input when button is clicked
function addDeck() {
    var deckInputs = document.getElementById('decks');
    // Copy deck strings to temporary array
    var tempDecks = [];
    for (let i = 0; i < deckInputs.children.length; i++) {
        tempDecks.push(deckInputs.children[i].children[1].value);
    }

    deckInputs.innerHTML += deckInput;

    // Restore deck strings from temporary array
    for (let i = 0; i < deckInputs.children.length; i++) {
        if (tempDecks[i] === undefined) {
            continue;
        }
        deckInputs.children[i].children[1].value = tempDecks[i];
    }
}

// Remove deck input when button is clicked
function removeDeck() {
    var deckInputs = document.getElementById('decks');
    var deckInput = document.getElementsByClassName('deck');
    deckInputs.removeChild(deckInput[deckInput.length - 1]);
}

function compareDecks() {
    // Get all deck inputs
    var deckInputs = document.getElementsByClassName('deck');
    // Get all decklists
    var decklists = [];
    for (let i = 0; i < deckInputs.length; i++) {
        decklists.push(deckInputs[i].children[1].value);
    }
    // Split each decklist into an array of strings in an array
    var splitDecklists = [];
    for (let i = 0; i < decklists.length; i++) {
        splitDecklists.push(splitString(decklists[i]));
    }

    // Clean up each decklist
    var cleanedDecklists = [];
    for (let i = 0; i < splitDecklists.length; i++) {
        cleanedDecklists.push(cleanUp(splitDecklists[i]));
    }
    console.log(compare(...cleanedDecklists));

    // Get tables from HTML
    var tableBody1 = document.getElementById('resultsTable1Body');
    var tableBody2 = document.getElementById('resultsTable2Body');
    var tableBody3 = document.getElementById('resultsTable3Body');

    // Clear tables
    tableBody1.innerHTML = '';
    tableBody2.innerHTML = '';
    tableBody3.innerHTML = '';


    var result = compare(...cleanedDecklists);
    console.log(cleanedDecklists)
    for (let i = 0; i < result.length; i++) {
        var tableBodyRow = document.createElement('tr');
        var tableBodyCell1 = document.createElement('td');
        var tableBodyCell2 = document.createElement('td');
        // Highlight cards that appear in all decks
        if (result[i][1] === cleanedDecklists.length) {
            tableBodyCell1.style.backgroundColor = 'yellow';
            tableBodyCell2.style.backgroundColor = 'yellow';
        }
        // Highlight cards that aren't in the first deck
        if (cleanedDecklists[0].indexOf(result[i][0]) === -1) {
            tableBodyCell1.style.backgroundColor = 'red';
            tableBodyCell2.style.backgroundColor = 'red';
        }        

        tableBodyCell1.textContent = result[i][0];
        tableBodyCell2.textContent = result[i][1];
        tableBodyRow.appendChild(tableBodyCell1);
        tableBodyRow.appendChild(tableBodyCell2);
        // Add to first table if card is in first deck but not in any other deck
        if (cleanedDecklists[0].indexOf(result[i][0]) !== -1 && result[i][1] === 1) {
            tableBody1.appendChild(tableBodyRow);
        }
        // Add to second table if card is in all decks except the first
        else if (cleanedDecklists[0].indexOf(result[i][0]) === -1 && result[i][1] === cleanedDecklists.length - 1) {
            tableBody2.appendChild(tableBodyRow);
        }
        // Add to third table otherwise
        else {
            tableBody3.appendChild(tableBodyRow);
        }
    }
    
    // Show results
    var results = document.getElementById('results');
    results.style.display = 'flex';
}

// window.onload = function() {
//     var deckInputs = document.getElementById('decks');
//     // HTML for deck input
//     console.log(deckInput)
//     deckInputs.innerHTML += deckInput;
//     deckInputs.innerHTML += deckInput; 
// }