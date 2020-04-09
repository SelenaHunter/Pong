let canvas;
let canvasContext;
let ballX = 50; //coordinates
let ballY = 10; //coordinates
let ballSpeedX = 8;
let ballSpeedY = 8;
let ballRadius = 10;

let paddle1Y = 100;
let paddle2Y = 100;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 5;
let showingWinScreen = false;

function handleMouseClick(event) {
	if (showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas')
	canvasContext = canvas.getContext('2d')
	canvasContext.font = "30px Verdana";

	let framesPerSecond = 24;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);

	// Listen for mouse movement to pass it to player1's paddle.
	canvas.addEventListener('mousemove',
		function(event) {
			let mousePos = calculateMousePosition(event)
			paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
		})

	// Listen for mouse clicks (used only during winning screen)
	canvas.addEventListener('mousedown', handleMouseClick)
}

function moveEverything() {
	// If the winning screen is showing, stop everything from moving.
	if (showingWinScreen) {
		return;
	}

	// Move the AI.
	computerMovement()
	
	// Move the ball.
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	
	// If the ball comes in contact with the right paddle, bounce it back. If not, reset the ball.
	if (ballX >= (canvas.width - ballRadius)) {
		if (ballY > paddle2Y && 
			ballY < paddle2Y + PADDLE_HEIGHT) {
				ballSpeedX = -ballSpeedX;

				// Increase the speed of the ball if the ball is hit on the edges of the paddle.
				let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2)
				ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++
			ballReset()
		}
	}
	
	// If the ball comes in contact with the left edge and hits the paddle, bounce it back. If it misses the paddle, reset the ball.
	if (ballX < 0) {
		// If the ball's coordinates touch the paddle, from the top edge to the bottom edge
		if (ballY > paddle1Y && 
			ballY < paddle1Y + PADDLE_HEIGHT) {
				ballSpeedX = -ballSpeedX;

				// Increase the speed of the ball if the ball is hit on the edges of the paddle.
				let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2)
				ballSpeedY = deltaY * 0.35;
			} else {
				player2Score++
				ballReset()
		}	
	}
	
	// If the ball comes in contact with the top or bottom edges, bounce it back.
	if (ballY >= (canvas.height - ballRadius) || ballY <= (0 + ballRadius)) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for (let i=0; i<canvas.height; i+=40) {
		makeRect(canvas.width/2-1, i, 2, 20, 'white')
	}
}

function drawEverything() {	
	// Draw the background.
	makeRect(0, 0, canvas.width, canvas.height, 'black')
	
	if (showingWinScreen) {
		canvasContext.fillStyle = '#00a597';

		if (player1Score >= WINNING_SCORE) {
			canvasContext.fillText('Left player won!', 150, canvas.height/2 - 50)
			
		} else if (player2Score >= WINNING_SCORE) {
			canvasContext.fillText('Right player won!', 150, canvas.height/2 - 50)
		}
		canvasContext.fillText('Click to continue', 150, canvas.height/2)
		return;
	}

	drawNet()

	// Draw player1 paddle
	makeRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, '#00a597')
	
	// Draw player2 paddle
	makeRect(canvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, '#00a597')
	
	// This function draws the ball
	makeCirc(ballX, ballY, ballRadius, '#00e1ff')

	// Draw the scores.
	canvasContext.fillText(player1Score, 100, 50)
	canvasContext.fillText(player2Score, canvas.width-100, 50)
}






function calculateMousePosition(event) {
	// This code accounts for where on the page the canvas physially is. The mouseX and mouseY values are returned in relation to the canvas.
	let rect = canvas.getBoundingClientRect();
	let root = document.documentElement;
	let mouseX = event.clientX - rect.left - root.scrollLeft;
	let mouseY = event.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY
	}
}

function computerMovement() {
	// Get the center value of the player 2 paddle and use that to track the ball.
	let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2)

	// Move the AI paddle towards the ball. Check if the middle two fourths of the AI paddle is close to the ball (the PADDLE_HEIGHT/4), and ignore chasing the ball while its trajectory is within the middle two fourths.
	if (paddle2YCenter < ballY - (PADDLE_HEIGHT/4)) {
		paddle2Y += 6;
	} else if (paddle2YCenter > ballY + (PADDLE_HEIGHT/4) ) {
		paddle2Y -= 6;
	}
}

function ballReset() {
	// Check the score before resetting the ball. If either player has a winning score, move on to the win screen.
	if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
	}
	ballX = canvas.width/2;
	ballY = canvas.height/2;
	ballSpeedX = -ballSpeedX;
}

// Rectangle drawing helper function
function makeRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}

// Circle drawing helper function
function makeCirc(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor
	canvasContext.beginPath()
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill()
}