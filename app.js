// Selecting needed elements of HTML 
const grid = document.querySelector('.grid')
const flagsLeft = document.querySelector('#flags-left')
const result = document.querySelector('#result')
const startbtn = document.querySelector('.start-btn')
const resetbtn = document.querySelector('.reset-btn')
const btnSound = document.getElementById('btn-sound')
// Taking some variables which will be used further
let width = 10
let bombAmount = 20
let flags = 0
let squares = []
let isGameOver = false

//Variables needed for Displaying time 
var c = 0;
var t;
var timer_is_on = 0;

//Selecting HTML elements
const playbtn = document.querySelector('.intro button')
const intro = document.querySelector('.intro')
const match = document.querySelector('.match')

//This function brings the game into play after clicking Let's Play button
playbtn.addEventListener('click', () => {
	intro.classList.add('fadeOut')
	match.classList.add('fadeIn')
	createBoard()
})

//This a recursive function used with setTimeout which calls itself after 1s and displays LIVE time in game 
function timedCount() {
	document.querySelector('.timer').innerHTML = `${c}s`;
	c = c + 1;
	t = setTimeout("timedCount()", 1000);
}

//This function make the StartTime button invisible and calls the above function for displaying time.
function doTimer() {
	startbtn.style.display = 'none'
	document.querySelector('.blink').innerHTML = '<h3>Your time has started</h3>'
	if (!timer_is_on) {
		timer_is_on = 1;
		timedCount();
	}
}
 
// This function is used to stop the timer when the game is over i.e.won or lose
function stopCount() {
	clearTimeout(t);
	timer_is_on = 0;
}


// This function is called when reset button is clicked to reload the entire page and start a new game
resetbtn.addEventListener('click', () => {
	location.reload()
})


//This function creates main board for game
function createBoard() {
	flagsLeft.innerHTML = bombAmount

	
	const bombsArray = Array(bombAmount).fill('bomb') // fill the first array with bombs
	const emptyArray = Array(width * width - bombAmount).fill('valid') //fill the second array with valid elements i.e. all non-bombs
	const gameArray = emptyArray.concat(bombsArray) // concatenantion of both of above arrays
	const shuffledArray = gameArray.sort(() => Math.random() - 0.5) //get shuffled game array with random bombs

	//this loop goes width*width times and creates our elements with a click and right click function attached to them
	for (let i = 0; i < width * width; i++) {
		const square = document.createElement('div')
		square.setAttribute('id', i)
		square.classList.add(shuffledArray[i])
		grid.appendChild(square)
		squares.push(square)

		//normal click
		square.addEventListener('click', function (e) {
			btnSound.pause();
			btnSound.play()
			click(square)
		})

		//right click
		square.oncontextmenu = function (e) {
			e.preventDefault()
			addFlag(square)
		}
	}

	//This loop shows the total number of surrounding bombs around a valid element
	for (let i = 0; i < squares.length; i++) {
		let total = 0
		const isLeftEdge = (i % width === 0)
		const isRightEdge = (i % width === width - 1)

		
		if (squares[i].classList.contains('valid')) {
			//These 8 if conditions check all surrounding elements for bombs, and if present then show total no. of bombs on valid element
			if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
			if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
			if (i >= 10 && squares[i - width].classList.contains('bomb')) total++
			if (i >= 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
			if (i <= 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
			if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
			if (i <= 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
			if (i <= 89 && squares[i + width].classList.contains('bomb')) total++
			squares[i].setAttribute('data', total)
		}
	}
}

//This function adds Flag with right click on an element
function addFlag(square) {
	if (isGameOver) return
	if (!square.classList.contains('checked') && (flags <= bombAmount)) {
		if (!square.classList.contains('flag') && (flags < bombAmount)) {
			square.classList.add('flag')
			square.innerHTML = ' 🚩'
			flags++
			flagsLeft.innerHTML = bombAmount - flags
			checkForWin()
		} else if(square.classList.contains('flag')) {
			square.classList.remove('flag')
			square.innerHTML = ''
			flags--
			flagsLeft.innerHTML = bombAmount - flags
		}
	}
}

//This function evaluates the left click done on an element
function click(square) {
	let currentId = square.id
	if (isGameOver) return
	if (square.classList.contains('checked') || square.classList.contains('flag')) return
	if (square.classList.contains('bomb')) {
		gameOver(square)
	} else {
		let total = square.getAttribute('data')
		if (total != 0) {
			square.classList.add('checked')
			if (total == 1) square.classList.add('one') //adding classes to style numbers differently
			if (total == 2) square.classList.add('two') //adding classes to style numbers differently
			if (total == 3) square.classList.add('three') //adding classes to style numbers differently
			if (total == 4) square.classList.add('four') //adding classes to style numbers differently
			square.innerHTML = total
			return
		}
		checkSquare(square, currentId) // If the total is 0(zero) , only then ,this function will be called to
									  //check the neighouring elements and showing them if they are valid. 
	}
	square.classList.add('checked')
}


//check neighboring squares once square is clicked
function checkSquare(square, currentId) {
	const isLeftEdge = (currentId % width === 0)
	const isRightEdge = (currentId % width === width - 1)

	setTimeout(() => {
		if (currentId > 0 && !isLeftEdge) {
			const newId = squares[parseInt(currentId) - 1].id
			//const newId = parseInt(currentId) - 1   ....refactor
			const newSquare = document.getElementById(newId)
			click(newSquare) //A recursive approach to check for valid squares around 
		}
		if (currentId > 9 && !isRightEdge) {
			const newId = squares[parseInt(currentId) + 1 - width].id
			//const newId = parseInt(currentId) +1 -width   ....refactor
			const newSquare = document.getElementById(newId)
			click(newSquare) //A recursive approach to check for valid squares around 
		}
		if (currentId >= 10) {
			const newId = squares[parseInt(currentId - width)].id
			//const newId = parseInt(currentId) -width   ....refactor
			const newSquare = document.getElementById(newId)
			click(newSquare) //A recursive approach to check for valid squares around 
		}
		if (currentId >= 11 && !isLeftEdge) {
			const newId = squares[parseInt(currentId) - 1 - width].id
			//const newId = parseInt(currentId) -1 -width   ....refactor
			const newSquare = document.getElementById(newId)
			click(newSquare) //A recursive approach to check for valid squares around 
		}
		if (currentId <= 98 && !isRightEdge) {
			const newId = squares[parseInt(currentId) + 1].id
			//const newId = parseInt(currentId) +1   ....refactor
			const newSquare = document.getElementById(newId)
			click(newSquare) //A recursive approach to check for valid squares around 
		}
		if (currentId < 90 && !isLeftEdge) {
			const newId = squares[parseInt(currentId) - 1 + width].id
			//const newId = parseInt(currentId) -1 +width   ....refactor
			const newSquare = document.getElementById(newId)
			click(newSquare) //A recursive approach to check for valid squares around 
		}
		if (currentId <= 88 && !isRightEdge) {
			const newId = squares[parseInt(currentId) + 1 + width].id
			//const newId = parseInt(currentId) +1 +width   ....refactor
			const newSquare = document.getElementById(newId)
			click(newSquare) //A recursive approach to check for valid squares around 
		}
		if (currentId <= 89) {
			const newId = squares[parseInt(currentId) + width].id
			//const newId = parseInt(currentId) +width   ....refactor
			const newSquare = document.getElementById(newId)
			click(newSquare) //A recursive approach to check for valid squares around 
		}
	}, 10)
}

//GameOver Function
function gameOver(square) {
	result.innerHTML = 'BOOM! Game Over!'
	document.querySelector('.btn').style.display = "none"  //Asures that lets play button doesn't become visible
	document.querySelector('.blink').style.display = "none" //MAkes the bliking heading invisible 
	document.querySelector('.reset').style.display = "block" //Makes the reset button visible on screen
	document.querySelector('.timer').style.display = "none" //  makes Start time button invisible 
	stopCount() // Stops the time and
	isGameOver = true

	//show ALL the bombs
	squares.forEach(square => {
		if (square.classList.contains('bomb')) {
			square.innerHTML = '💣'
			square.classList.remove('bomb')
			square.classList.add('checked')
		}
	})
}

//check for win
function checkForWin() {
	///simplified win argument
	let matches = 0
	//Loop used to evaluate if a player win or loose
	for (let i = 0; i < squares.length; i++) {
		if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
			matches++
		}
		if (matches === bombAmount) {
			document.querySelector('.btn').style.display = "none"
			document.querySelector('.blink').style.display = "none"
			result.innerHTML = `YOU WIN!<br/>`
			isGameOver = true
			stopCount()
			document.querySelector('.reset').style.display = "block"
		}
	}
}

