var view = {
	msgCounter: null,
//	messageBlock: [],
	displayMessage: function(msg){
		var index = this.msgCounter.getCount();
		var newMessageBlock = document.createElement("div");
		newMessageBlock.setAttribute("id","msg" + index);
		newMessageBlock.setAttribute("class","tn-box tn-box-color-1 tn-box-active");
		newMessageBlock.innerHTML = "<p>" + msg + "</p>";

		var msgArea = document.getElementById("msgArea");
		msgArea.appendChild(newMessageBlock);
		this.msgCounter.increment();
		
		setTimeout(function(){
			msgArea.removeChild(newMessageBlock);
			view.msgCounter.decremrnt();
		},2000)

	},
	displayHit: function(location){
		var neededCell = document.getElementById(location);
		neededCell.setAttribute("class", "hit");
	},
	displayMiss: function(location){
		var neededCell = document.getElementById(location);
		neededCell.setAttribute("class", "miss");
	},
	makeCounter: function(){
		var count = 0;
		return {
			increment: function(){
				count++;
				return count;
			},
			getCount: function(){
				return count;
			},
			decremrnt: function(){
				count--;
			}
		}
	}
}
var model = {
	status: true,
	boardSize: 7,
	numShips: 3,
	shipLength:3,
	shipsSunck: 0,
	ships: [{locations: ["0","0","0"], hits:["","",""]},
			{locations: ["0","0","0"], hits:["","",""]},
			{locations: ["0","0","0"], hits:["","",""]}],
	fire: function(guess){
		for(var i = 0; i < 3; i++){
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0 ){
				if(ship.hits[index] === "hit"){
					view.displayMessage("You shorted a battleship, enter new location!");
					return false;	
				}
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if(this.isSunk(ship)){
					view.displayMessage("You sank my battleship!");
					this.getAuraShip(ship).forEach(function(item){
						view.displayMiss(item);
					});
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
	},
	generateShiplocation: function(){
		var location;
		for(var i = 0; i < this.numShips; i++){
			do{
				location = this.generateShip();
			}while(this.collision(location))
			this.ships[i].locations = location;
		}
	},
	generateShip: function(){
		var direction = Math.floor(Math.random() * 2);
		var row,col;
		if(direction === 1){ //Горизонтал.
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		}else{ 				//Вертикал.
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}
		var newShipLocations = [];
		for(var i = 0; i < this.shipLength; i++){
			if(direction === 1){
				newShipLocations.push(row + "" + (col + i));
			}else{
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	collision: function(location){ // Столкновение
		for(var i = 0; i < this.numShips; i++){
			var ship = this.ships[i];
			var shipAura = this.getAuraShip(ship);
			for(var j = 0; j < location.length; j++){
				if(ship.locations.indexOf(location[j]) >= 0 || shipAura.indexOf(location[j]) >= 0){
					return true;		
				}
			}
		}
		return false;
	},
	getAuraShip: function(ship){
		var aura = [];
		var add = function(addToRow, addToCol){
			var newRow = row + addToRow;
			var newCol = col + addToCol;
			var newDot = newRow + ""  + newCol;
			if(ship.locations.indexOf(newDot) < 0 && aura.indexOf(newDot) < 0){
				if(newRow < model.boardSize && newCol < model.boardSize && newRow >= 0 && newCol >= 0){
		 			aura.push(newDot);
		 			return newDot;
				}
			}
			return null;
		};
		for(var i = 0; i < this.shipLength; i++){
			var location = ship.locations[i];
			var row = Number(location.charAt(0));
		 	var col = Number(location.charAt(1));
		 	add(1,0);
		 	add(0,1);
		 	add(1,1);
		 	add(1,-1);
		 	add(-1,1);
		 	add(-1,0);
		 	add(0,-1);
		 	add(-1,-1);
		}
		return aura;
	},
	openAllField: function(){
		var arrImage = document.getElementsByTagName("td");
		for(var i = 0; i < arrImage.length; i++){
			arrImage[i].click();
		}
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
		if(guess === null || guess.length !== 2){
			alert("Ooops, please enter a letter and number on the board!");
		} else {
			var row  = guess.charAt(0)
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
	var arrImage = document.getElementsByTagName("td");
	for(var i = 0; i < arrImage.length; i++){
		arrImage[i].onclick = function(eventObj){
			var selectField = eventObj.target;
			var guess = selectField.id;
			controller.processGuess(guess);
		};
	}	
	model.generateShiplocation();
	view.msgCounter = view.makeCounter();
//	model.openAllField();
}
window.onload = init;