window.onload = function(){
	var canvas = document.createElement('canvas');
	ctx = canvas.getContext('2d');
	// Holds the scores of the current game
	score = 0,
	// Holds the current level
	level = 0,
	direction = 0,
	// Holds the snake in the array where the length of the array is
	// the actual length of the snake
	snake = new Array(3),
	// Holds a boolean that shows is the game is running
	active = true,
	// Holds the speed which is increased when the new level is reached
    speed = 500;

	// Initialize the matrix.
    var map = new Array(20);
    for (var i = 0; i < map.length; i++) {
        map[i] = new Array(20);
    }

	canvas.width = 204;
	canvas.height = 224;

	var body = document.getElementsByTagName('body')[0];
	body.appendChild(canvas);

	// Generates the position and render the snake on the map
	map = generateSnake(map);

	// Generates the position and render the food on the map
	map = generateFood(map);
	drawGame();

	// Main listener of the keys
	window.addEventListener('keydown', function(e) {
        if (e.keyCode === 38 && direction !== 3) {
            direction = 2; // Up
        } else if (e.keyCode === 40 && direction !== 2) {
            direction = 3; // Down
        } else if (e.keyCode === 37 && direction !== 0) {
            direction = 1; // Left
        } else if (e.keyCode === 39 && direction !== 1) {
            direction = 0; // Right
        }
    });


	function drawGame(){
		// Clears the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = snake.length - 1; i >= 0; i--) {
        	if (i === 0) {
            	switch(direction) {
                	case 0: // Right
                    	snake[0] = { x: snake[0].x + 1, y: snake[0].y }
                    	break;
                	case 1: // Left
                    	snake[0] = { x: snake[0].x - 1, y: snake[0].y }
                    	break;
                	case 2: // Up
                    	snake[0] = { x: snake[0].x, y: snake[0].y - 1 }
                    	break;
                	case 3: // Down
                    	snake[0] = { x: snake[0].x, y: snake[0].y + 1 }
                    	break;
            		}
 
            	// Checks if is not out of bound
            	if (snake[0].x < 0 || 
                	snake[0].x >= 20 ||
                	snake[0].y < 0 ||
                	snake[0].y >= 20) {
                	showGameOver();
                	return;
            	}
 
            	// If we hit the food, then we add a new element to the array and
            	// generate a new food
            	if (map[snake[0].x][snake[0].y] === 1) {
                	score += 10;
                	map = generateFood(map);
 
                	// Adds a new body piece to the array 
                	snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                	map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;
 
                	// If the score is a multiplier of 100 (such as 100, 200, 300, etc.)
                	// increases the level, which will make it go faster.
                	if ((score % 100) == 0) {
                    	level += 1;
                	}
            
            	// Checks if the head is not hitting other parts of the snake (tail)
           		} else if (map[snake[0].x][snake[0].y] === 2) {
                	showGameOver();
                	return;
            	}
 
            	map[snake[0].x][snake[0].y] = 2;
        	} else {
            	// Clears the last piece where the snake was in the previous move
            	if (i === (snake.length - 1)) {
                	map[snake[i].x][snake[i].y] = null;
            	}
 
            	snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
            	map[snake[i].x][snake[i].y] = 2;
        	}
    	}

		// Draw the border, scores and the level
		drawMain();

		// Cycling the matrix 
		for (var x = 0; x < map.length; x++) {
        	for (var y = 0; y < map[0].length; y++) {
            	if (map[x][y] === 1) {
                	ctx.fillStyle = 'black';
                	ctx.fillRect(x * 10, y * 10 + 20, 10, 10);
            	} else if (map[x][y] === 2) {
                	ctx.fillStyle = 'orange';
                	ctx.fillRect(x * 10, y * 10 + 20, 10, 10);			
            	}
        	}
    	}

    	if (active) {
    		setTimeout(drawGame, speed - (level * 50));
    	};
	}

	function drawMain(){

		ctx.lineWidth = 2;
		ctx.strokeStyle = 'black';

		ctx.strokeRect(2, 20, canvas.width - 4, canvas.height - 24);

		// Indicates the current scores and level
		ctx.font = '12px sans-serif';
		ctx.fillText('Score: ' + score + ' - Level ' + level, 2, 12);
	}

	function generateFood(map){
		// Generate a random position for the rows and cols
		var rndX = Math.round(Math.random() * 19);
		var rndY = Math.round(Math.random() * 19);

		while(map[rndX][rndY] === 2){
			rndX = Math.round(Math.random() * 19);
        	rndY = Math.round(Math.random() * 19);
		}

		map[rndX][rndY] = 1;
		return map;
	}

	function generateSnake(map){
		// Generate a random row and col for the head
		var rndX = Math.round(Math.random() * 19);
		var rndY = Math.round(Math.random() * 19);

		// Assuring that we are not out of bound
		while ((rndX - snake.length) < 0) {
        	rndX = Math.round(Math.random() * 19);
    	}

    	for (var i = 0; i < snake.length; i++) {
        	snake[i] = { x: rndX - i, y: rndY };
        	map[rndX - i][rndY] = 2;
    	}

    	return map;
	}

	function showGameOver(){
		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = 'black';
		ctx.font = '16px sans-serif';

		ctx.fillText('Game Over', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), 50);

		ctx.font = '12px sanf-serif';

		ctx.fillText('Your Score Was: ' + score, ((canvas.width / 2) - (ctx.measureText('Your Score Was: ' + score).width / 2)), 70);
	}
	
};