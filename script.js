const canvas = document.getElementById('gameCanvas');
const scoreText = document.getElementById('scoreText');
const restart = document.getElementById('restartButton');
let isPaused = false
let score = 0;


class Piece {
	constructor(){
		this.type = this.getRandomInt(1, 7);
		this.x = 150;
		this.y = 0;
		this.rotation = 0;
	}

	getRandomInt = function (min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	pieces = {
		1: [ [[1, 1, 1, 1]], [[1], [1], [1], [1]] ],
		2: [ [[1, 1], [1, 1]] ],
		3: [ [[1, 0],[1, 0],[1, 1]], [[0, 0, 1],[1, 1, 1]], [[1, 1], [0, 1], [0, 1]], [[1, 1, 1], [1, 0, 0]]],
		4: [ [[1, 1, 0], [0, 1, 1]], [[0, 1], [1, 1], [1, 0]]],
		5: [ [[1, 1, 1], [0, 1, 0]], [[0, 1], [1, 1], [0, 1]], [[0, 1, 0], [1, 1, 1]], [[1, 0], [1, 1], [1, 0]]],
		6: [ [[0, 1, 1], [1, 1, 0]], [[1, 0], [1, 1], [0, 1]]],
		7: [ [[0, 1],[0, 1],[1, 1]], [[1, 1, 1],[0, 0, 1]], [[1, 1], [1, 0], [1, 0]], [[1, 0, 0], [1, 1, 1]]]
	}
}



let board = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]];


let gamePiece = new Piece();

const restartGame = () => {
	board.forEach((row, i) => {
		row.forEach((item, j) => {
			board[i][j] = 0
		})
	})
	gamePiece = new Piece()
	score = 0
	restart.style.display = "none";
	isPaused = false
	changeFrame()
	
}

const moveValidation = (xDifference, yDifference) => {
	const piece = gamePiece.pieces[gamePiece.type][gamePiece.rotation]
	let x = gamePiece.x/30;
	let y = gamePiece.y/30;
	let xChange = xDifference/30
	let yChange = yDifference/30
	let isValid = true;
	for (var i = 0; i < piece.length; i++) {
		for (var j = 0; j < piece[0].length; j++) {
			if (board[i + y][j + x + xChange] + piece[i][j] === 2) {
				isValid = false
			}else if (board[i + y + yChange][j + x] + piece[i][j] === 2) {
				isValid = false
			}
		}
	}
	return isValid
}

const rotationValidation = (newRotation) => {
	const newLength = gamePiece.pieces[gamePiece.type][newRotation][0].length
	let isValid = true
	if (!(gamePiece.x <= (300 - newLength*30))) {
		isValid = false
	}
	return isValid
}

const checkFill = () => {
	if (board[2].includes(1)) {
		isPaused = true
		console.log(isPaused )
		restart.style.display = "block"
	}
}

const changeFrame = () => {
	if (!isPaused) {
		resetBoard()
		drawArray()
		drawGamePiece()
		autoDown()
		updateScore()
	}
	

}


const changePosition = (e) => {
	const pieces = gamePiece.pieces
	const xlength = gamePiece.pieces[gamePiece.type][gamePiece.rotation][0].length
	const yLength = gamePiece.pieces[gamePiece.type][gamePiece.rotation].length
	let keyCode = e.keyCode
	if (keyCode === 37 && gamePiece.x != 0 && moveValidation(-30, 0)) {
		gamePiece.x -= 30
	}else if(keyCode === 39 && gamePiece.x != (300 - xlength*30) && moveValidation(30, 0)){
		gamePiece.x += 30
	}else if (keyCode === 38) {
		let newRotation;
		if (gamePiece.pieces[gamePiece.type].length -1 === gamePiece.rotation){
			newRotation = 0
		}else{
			newRotation = gamePiece.rotation + 1;
		}
		if (rotationValidation(newRotation)){
			gamePiece.rotation = newRotation
		}
	}else if (keyCode === 40 && (600 - (gamePiece.y + yLength*30)) > 0 && moveValidation(0, 30)){
		gamePiece.y += 30
	}else if (keyCode === 32 && !isPaused) {
		drop()
	}
	if (!isPaused) {
		resetBoard()
		drawArray()
		drawGamePiece()
	}
	
	
}

const drop = () => {
	const length = gamePiece.pieces[gamePiece.type][gamePiece.rotation].length;
	let yDifference = 0;
	while ((600 - (gamePiece.y + yDifference + length*30)) > 0 ){
		if (!moveValidation(0, yDifference)){
			break;
		}else {
			yDifference += 30
		}
	}
	gamePiece.y += (yDifference - 30)
}

const autoDown = () => {
	const length = gamePiece.pieces[gamePiece.type][gamePiece.rotation].length
	const pieces = gamePiece.pieces;
	if ((600 - (gamePiece.y + length*30)) > 0 && moveValidation(0, 30) === true) {
		gamePiece.y += 30
	}else {
		addToArray()
		removeFilledLines()
		drawArray()
		checkFill()
		gamePiece= new Piece()
	}
}

const addToArray = () => {
	const piece = gamePiece.pieces[gamePiece.type][gamePiece.rotation]
	const x = gamePiece.x/30
	const y = gamePiece.y/30
	piece.forEach((row, i) => {
		row.forEach((block, j) => {
			if (board[i + y][j + x] === 0) {
				board[i + y][j + x] = block
			}
			
		})
	})
}


const drawGamePiece = () => {
	const fill = gamePiece.pieces[gamePiece.type][gamePiece.rotation];
	let context = canvas.getContext('2d');
	let x = gamePiece.x;
	let y = gamePiece.y;
	fill.forEach((row, i) => {
		row.forEach((block, j) => {
			if (block === 1) {
				let image = new Image()
				image.src = './square2.png'
				context.drawImage(image, x+(j*30), y + (i*30), 30, 30)
			}
		})
	})
}


const drawArray = () => {
	const context = canvas.getContext('2d');
	
	board.forEach((item, i) => {
		item.forEach((fill, j) => {
			if (fill === 1){
				let image = new Image()
				image.src = './square2.png'
				context.drawImage(image, (j*30),(i*30), 30, 30 )
			}
		})
	})
}

const updateScore = () => {
	scoreText.textContent=score
}

const removeFilledLines = () => {
	let amount = 0;
	board.forEach((row, i) => {
		if (!row.includes(0)) {
			board.splice(i, 1)
			board.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
			amount += 1;
		}
	})
	score += 100*amount
}

const resetBoard = () => {
	const context = canvas.getContext('2d')
	context.clearRect(0, 0, canvas.width, canvas.height);
}


restart.addEventListener('click', restartGame)
document.addEventListener('keydown', changePosition)
setInterval(changeFrame, 500)