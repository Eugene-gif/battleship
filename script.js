//================================================================================================
//================================================================================================
//====================== П О С Т Р О Е Н И Е   П Р И Л О Ж Е Н И Я  ==============================
//page 341
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//numShips - количество кораблей в игре
//ships - позиции кораблей и координаты попаданий
//shipsSunk - количество потопленных кораблей
//shipLength - длинна каждого корабля
//fire - метод для выполнения выстрела и проверки промаха или попадания
//isSunk - метод возвращает true если корабль потоплен
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Объект представления
var view = {
  displayMessage: function (msg) {
    var messageArea = document.getElementById('messageArea');
    messageArea.innerHTML = msg;
  },
  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute('class', 'hit');
  },
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute('class', 'miss');
  },
};

//Объект модели
var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  ships: [
    { locations: [0, 0, 0], hits: ['', '', ''] },
    { locations: [0, 0, 0], hits: ['', '', ''] },
    { locations: [0, 0, 0], hits: ['', '', ''] },
  ],
  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = 'hit';
        view.displayHit(guess);
        view.displayMessage('Попадение!');
        if (this.isSunk(ship)) {
          view.displayMessage('Вы потопили корабль!');
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage('Вы промазали.');
    return false;
  },
  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== 'hit') {
        return false;
      }
    }
    return true;
  },
  generateShipLocations: function () {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + '' + (col + i));
      } else {
        newShipLocations.push(row + i + '' + col);
      }
    }
    return newShipLocations;
  },
  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },
};

function init() {
  var fireButton = document.getElementById('fireButton');
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById('guessInput');
  guessInput.onkeypress = handleKeyPress; //заменить а новое значение

  model.generateShipLocations();
}

//Контроллер
var controller = {
  guesses: 0,
  processGuess: function (guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          'Вы потопили все корабли за  ' + this.guesses + ' выстрела(-ов)!'
        );
      }
    }
  },
};

function parseGuess(guess) {
  var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  if (guess === null || guess.length !== 2) {
    alert('Пожалуйста введите валидное значение!');
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar.toUpperCase());
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert('Ой, этого значения нет на доске');
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert('Это значение не в тему:)');
    } else {
      return row + column;
    }
  }
  return null;
}

function handleFireButton() {
  var guessInput = document.getElementById('guessInput');
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = '';
}

function handleKeyPress(e) {
  var fireButton = document.getElementById('fireButton');
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
