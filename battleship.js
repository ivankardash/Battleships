var view = {
	displayMessage: function(msg){
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location){
		var neededCell = document.getElementById(location);
		neededCell.setAttribute("class", "hit");
	},
	displayMiss: function(location){
		var neededCell = document.getElementById(location);
		neededCell.setAttribute("class", "miss");
	}
}
var model = {
	status: true,
	boardSize: 7,
	numShips: 3,
	shipLength:3,
	shipsSunck: 0,
	ships: [{location: ["06","16","26"], hits:["","",""]},
			{location: ["24","34","44"], hits:["","",""]},
			{location: ["10","11","12"], hits:["","",""]}],
	fire: function(guess){
		for(var i = 0; i < this.numShips; i++){
			var ship = this.ships[i];
			var index = ship.location.indexOf(guess);
			if (index >= 0 ){
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if(this.isSunk(ship)){
					view.displayMessage("You sank my battleship!");
					this.shipsSunck++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed");		
		return false;
	},
	isSunk: function(ship){
		for(var i = 0; i < this.shipLength; i++){
			if(ship.hits[i] !== "hit"){
				return false;
			}
		}
		return true;
	}
}
var controller = {
	guesses: 0,
	processGuess: function(guess){
		var location = this.parseGuess(guess);
		if(location && model.status){
			this.guesses++;
			var hit = model.fire(location);
			if(hit && model.numShips === model.shipsSunck){
				view.displayMessage("You Sunk all battle ships, in " + controller.guesses + " guesses");
				model.status = false;
			}
		}
	},
	parseGuess: function(guess){
		var alphabet = ["A","B","C","D","E","F","G"];
		if(guess === null || guess.length !== 2){
			alert("Ooops, please enter a letter and number on the board!");
		} else {
			var fistChar = guess.charAt(0);
			var row = alphabet.indexOf(fistChar);
			var column = guess.charAt(1);
			if(isNaN(row) || isNaN(column)){
				alert("Ooops, that isn't on the board.");
			} else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
				alert("Ooops, that's off the board.");
			} else {
				return row + column;
			}
		}
		return null;
	}
} 
function init(){
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
}
function handleFireButton(){
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess);
	guessInput.value = "";
	console.log("-");
}
function handleKeyPress(e){
	var fireButton = document.getElementById("fireButton");
	if(e.keyCode === 13){
		fireButton.click();
		return false;
	}
}
window.onload = init;