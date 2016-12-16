function init(){
	console.info("initialized");
	var stage = new createjs.Stage("game");
	var field = new createjs.Container();

	var background = new createjs.Shape();
	stage.addChild(background);
	background.graphics.beginFill("black").drawRect(0,0, 600, 600);
	stage.addChild(field);
	var polarGrid = {rings : [], cells : []};
	polarGrid.rings[0] = 1;
	polarGrid.rings[1] = 8;
	polarGrid.rings[2] = 16;
	polarGrid.rings[3] = 16;
	polarGrid.rings[4] = 32;
	polarGrid.rings[5] = 32;
	polarGrid.rings[6] = 64;
	//polarGrid.rings[7] =64;
	//polarGrid.rings[8] =128;
	//polarGrid.rings[9] =128
	var ringHeight = 35;
	for (var i = 0; i < 10; i++){
		for (var j = 0; j < polarGrid.rings[i]; j++)
			polarGrid.cells.push({cellRing : i, cellNum : j});
	}

	for (var i = 0; i < polarGrid.cells.length; i++){
		polarGrid.cells[i].neighbours = [];
		polarGrid.cells[i].outerNeighbours = [];
		polarGrid.cells[i].ccwNeighbour = {};
		polarGrid.cells[i].cwNeighbour = {};
		polarGrid.cells[i].links = [];
		polarGrid.cells[i].n = i;
	}

	for (var i =1; i <= polarGrid.rings[1]; i++) {
		polarGrid.cells[0].neighbours.push(polarGrid.cells[i]);
		polarGrid.cells[0].outerNeighbours.push(polarGrid.cells[i]);
		polarGrid.cells[i].neighbours.push(polarGrid.cells[0]);
	}

	for (var i = 1; i < polarGrid.cells.length; i++){
		if (i < polarGrid.cells.length - polarGrid.rings[polarGrid.rings.length - 1]) {
			if (polarGrid.cells[i].cellRing % 2 == 0) {
				var n  = i + polarGrid.rings[polarGrid.cells[i].cellRing + 1];
					polarGrid.cells[i].neighbours.push(polarGrid.cells[n]);
					polarGrid.cells[i].outerNeighbours.push(polarGrid.cells[n]);
					polarGrid.cells[n].neighbours.push(polarGrid.cells[i]);
			} else {
				var x = i + polarGrid.rings[polarGrid.cells[i].cellRing] - polarGrid.cells[i].cellNum + polarGrid.cells[i].cellNum * 2;
				polarGrid.cells[i].neighbours.push(polarGrid.cells[x]);
				polarGrid.cells[i].outerNeighbours.push(polarGrid.cells[x]);
				polarGrid.cells[x].neighbours.push(polarGrid.cells[i]);
				polarGrid.cells[i].neighbours.push(polarGrid.cells[x + 1]);
				polarGrid.cells[i].outerNeighbours.push(polarGrid.cells[x + 1]);
				polarGrid.cells[x + 1].neighbours.push(polarGrid.cells[i]);
			}
		}
		if(polarGrid.cells[i].cellNum == 0) {
			polarGrid.cells[i].neighbours.push(polarGrid.cells[i + 1]);
			polarGrid.cells[i].ccwNeighbour = polarGrid.cells[i + 1];
			polarGrid.cells[i].neighbours.push(polarGrid.cells[i + polarGrid.rings[polarGrid.cells[i].cellRing] - 1]);
			polarGrid.cells[i].cwNeighbour = polarGrid.cells[i + polarGrid.rings[polarGrid.cells[i].cellRing] - 1];
		} else
			if (polarGrid.cells[i].cellNum == polarGrid.rings[polarGrid.cells[i].cellRing] - 1) {
				polarGrid.cells[i].neighbours.push(polarGrid.cells[i - polarGrid.rings[polarGrid.cells[i].cellRing] + 1]);
				polarGrid.cells[i].ccwNeighbour = polarGrid.cells[i - polarGrid.rings[polarGrid.cells[i].cellRing] + 1];
				polarGrid.cells[i].neighbours.push(polarGrid.cells[i - 1]);
				polarGrid.cells[i].cwNeighbour = polarGrid.cells[i - 1];
			} else {
				polarGrid.cells[i].neighbours.push(polarGrid.cells[i + 1]);
				polarGrid.cells[i].ccwNeighbour = polarGrid.cells[i + 1];
				polarGrid.cells[i].neighbours.push(polarGrid.cells[i - 1]);
				polarGrid.cells[i].cwNeighbour = polarGrid.cells[i - 1];
			}
	}


	function recursiveBacktracker(){
		var stack =[];//array of num
		var pathway = [];//array of num
		stack.push(0);
		pathway.push(0);
		var current;//num
		while(stack.length != 0){
			var nei = [];//array of num
			current = stack[stack.length - 1];//num
			for (var i = 0; i < polarGrid.cells[current].neighbours.length; i++){
				var e = polarGrid.cells[current].neighbours[i].n;//num
				var b = true;
				for(var j = 0; j < pathway.length; j++){
					if(e == pathway[j])
						b =false;
				}
				if(b) nei.push(e);
			}
			if(nei.length == 0){
				stack.pop();
			}
			else {
				var s = nei[rnd(0, nei.length)];//num
				pathway.push(s);
				polarGrid.cells[current].links.push(polarGrid.cells[s]);
				polarGrid.cells[s].links.push(polarGrid.cells[current]);
				stack.push(s);
			}
		}
	}

	function drawingPolargrid (){
		var polarMaze = new createjs.Shape();
		polarMaze.regX = 0;
		polarMaze.regY = 0;
		for (var i = 0; i < polarGrid.cells.length; i++){
			drawOuterBorder(i, polarMaze);
			drawCcwBorder(i, polarMaze);
		}
		field.addChild(polarMaze);
		polarMaze.x = 300;
		polarMaze.y = 300;
	}

	recursiveBacktracker();
	drawingPolargrid();
	makeCoordinates();
	makeChooser();

	function makeChooser(){
		for(var i = 0; i < polarGrid.cells.length; i++){
			if(polarGrid.cells[i].outerNeighbours.length == 2 && polarGrid.cells[i].links.length > 1){
				var isFirstALink = false;
				var isSecondeALink =false;
				for(var j =0;j<polarGrid.cells[i].links.length; j++){
					if(polarGrid.cells[i].outerNeighbours[0].n == polarGrid.cells[i].links[j].n)
						isFirstALink = true;
					if(polarGrid.cells[i].outerNeighbours[1].n == polarGrid.cells[i].links[j].n)
						isSecondeALink = true;
				}
				if(isFirstALink && isSecondeALink){
					polarGrid.cells[i].chooser = true;
				}
				else
					polarGrid.cells[i].chooser = false;
			}
		}
	}

	var sample = new createjs.Shape();
	sample.regX = 0;
	sample.regY = 0;
	field.addChild(sample);
	sample.x = 300;
	sample.y = 300;

	var hero = new createjs.Shape();
	hero.regX = 0;
	hero.regY = 0;
	var location = polarGrid.cells.length - 1;
	sample.graphics.beginFill("tomato").drawCircle(polarGrid.cells[location].x,  -polarGrid.cells[location].y , 5);

	//console.log(polarGrid);

	window.addEventListener("keydown", function(event){
		switch (event.key){
			case "ArrowLeft":
				if(!isThereCwWall(location)){
					location = polarGrid.cells[location].cwNeighbour.n;
					hero.x = polarGrid.cells[location].x;
					hero.y = polarGrid.cells[location].y;
					createjs.Tween
						.get(hero)
						.to({x : polarGrid.cells[location].x, y : polarGrid.cells[location].y}, 2000)
						.call(redraw())
						.setPaused(true);
				}
				break;
				case "ArrowRight":
				if(!isThereCcwWall(location)){
					location = polarGrid.cells[location].ccwNeighbour.n;
					hero.x = polarGrid.cells[location].x;
					hero.y = polarGrid.cells[location].y;
					createjs.Tween
						.get(hero)
						.to({x : polarGrid.cells[location].x, y : polarGrid.cells[location].y}, 2000)
						.call(redraw())
						.setPaused(true);
				}
				break;
				case "ArrowUp":
				if(! isInnerWall (location)){
					var prevCell = location;
					location = polarGrid.cells[location].inNeig.n;
					if(polarGrid.cells[location].chooser)
						polarGrid.cells[location].there = polarGrid.cells[prevCell];
					hero.x = polarGrid.cells[location].x;
					hero.y = polarGrid.cells[location].y;
					createjs.Tween
						.get(hero)
						.to({x : polarGrid.cells[location].x, y : polarGrid.cells[location].y}, 2000)
						.call(redraw())
						.setPaused(true);
					if(polarGrid.cells[location].n == 0)
						startAgain();
				}
				break;
				case "ArrowDown":
					if(! whatOuterCell(location)){
						if(polarGrid.cells[location].chooser){
							for(var j = 0; j < polarGrid.cells[location].outerNeighbours.length; j++)
								if (polarGrid.cells[location].outerNeighbours[j].n != polarGrid.cells[location].there.n){
									location = polarGrid.cells[location].outerNeighbours[j].n;
						}
					} else
						location = polarGrid.cells[location].outMove.n;
					hero.x = polarGrid.cells[location].x;
					hero.y = polarGrid.cells[location].y;
					createjs.Tween
						.get(hero)
						.to({x : polarGrid.cells[location].x, y : polarGrid.cells[location].y}, 2000)
						.call(redraw())
						.setPaused(true);
				}
				break;

		}
	}, true);

	function redraw(){
		if(location == 0)
			sample.graphics.clear().beginFill("green").drawCircle(hero.x,  -hero.y , 5);
		else
			sample.graphics.clear().beginFill("tomato").drawCircle(hero.x,  -hero.y , 5);
	}

	var text = new createjs.Text("Well done!", "20px Arial", "yellow");

	function startAgain(){
		field.addChild(text);
		text.x = 300;
		text.y = 300;
	}

	function whatOuterCell(N){
	for(var j = 0; j < polarGrid.cells[N].outerNeighbours.length; j++)
		for(var i = 0; i < polarGrid.cells[N].links.length; i++)
			if (polarGrid.cells[N].links[i].n == polarGrid.cells[N].outerNeighbours[j].n){
				polarGrid.cells[N].outMove = polarGrid.cells[N].links[i];
				return false;
			}
		return true;
	}

	function isThereCwWall(N){
		for(var i = 0; i < polarGrid.cells[N].links.length; i++){
			if(polarGrid.cells[N].links[i].n == polarGrid.cells[N].cwNeighbour.n)
				return false;
		}
		return true;
	}

	function isInnerWall(N){
		for(var i = 0; i < polarGrid.cells[N].links.length; i++){
			if(polarGrid.cells[N].links[i].cellRing < polarGrid.cells[N].cellRing){
				polarGrid.cells[N].inNeig = polarGrid.cells[N].links[i];
			return false;
			}
		}
		return true;
	}

	function makeCoordinates(){
		for (var i = 0; i < polarGrid.cells.length - polarGrid.rings[polarGrid.rings.length - 1] + 1; i++){
			if( i == 0 ){
				polarGrid.cells[i].x = 0;
				polarGrid.cells[i].y = 0;
			}
			else {
				if (polarGrid.cells[i].cellRing == polarGrid.rings.length - 1){
					var lastRad = ringHeight * polarGrid.cells[i].cellRing + ringHeight / 2;
					var lastAng = Math.PI * 2 / polarGrid.rings[polarGrid.cells[i].cellRing] / 2;
					for (var j = 0; j < polarGrid.rings[polarGrid.cells[i].cellRing]; j++){
						polarGrid.cells[i + j].x = Math.floor(Math.cos(lastAng + lastAng * 2 * polarGrid.cells[i + j].cellNum)* lastRad);
						polarGrid.cells[i + j].y = Math.floor(Math.sin(lastAng + lastAng * 2 * polarGrid.cells[i + j].cellNum)* lastRad);
					}
				} else {//not for last ring
					var beta = Math.PI * 2 / polarGrid.rings[polarGrid.cells[i].cellRing];
					var alpha =   beta * ( polarGrid.cells[i].cellNum * 2 + 1)/ 2;
					polarGrid.cells[i].x = Math.floor(Math.cos(alpha) * (ringHeight * polarGrid.cells[i].cellRing + ringHeight / 2));
					polarGrid.cells[i].y =  Math.floor(Math.sin(alpha) * (ringHeight * polarGrid.cells[i].cellRing + ringHeight / 2));
				}
			}
		}
	}

	function drawOuterBorder(N, polarMaze){
		var theta = Math.PI * 2 / polarGrid.rings[polarGrid.cells[N].cellRing + 1];
		var outerRadius = ( polarGrid.cells[N].cellRing + 1 ) * ringHeight;
		if (polarGrid.cells[N].outerNeighbours.length == 0){
			theta = Math.PI * 2 / polarGrid.rings[polarGrid.cells[N].cellRing ];
			var thetaS = theta * polarGrid.cells[N].cellNum;
			var thetaF = theta * (polarGrid.cells[N].cellNum + 1);
			polarMaze.graphics.beginStroke("white").arc(0, 0, outerRadius, thetaS, thetaF);
		} else {
			for (var t = 0; t < polarGrid.cells[N].outerNeighbours.length; t++) {
				if (isThereOuterWall(N, t)){
					var thetaS =  - theta * polarGrid.cells[N].outerNeighbours[t].cellNum;
					var thetaF =  - theta * ( polarGrid.cells[N].outerNeighbours[t].ccwNeighbour.cellNum);
					if (thetaF == 0)
						polarMaze.graphics.beginStroke("white").arc(0, 0, outerRadius, thetaS, 2*Math.PI, true);
					else
						polarMaze.graphics.beginStroke("white").arc(0, 0, outerRadius, thetaS, thetaF, true);
				}
			}
		}
	}

	function drawCcwBorder(N, polarMaze){
		if (N != 0){
			if(isThereCcwWall(N)){
				if (polarGrid.cells[N].cellNum == polarGrid.rings[polarGrid.cells[N].cellRing] - 1)
					var thet =  Math.PI * 2;
				else
					var thet = -(Math.PI * 2 / polarGrid.rings[polarGrid.cells[N].cellRing] * polarGrid.cells[N].cellNum + Math.PI * 2 / polarGrid.rings[polarGrid.cells[N].cellRing]);
				var finishX = Math.cos(thet) * ringHeight *(polarGrid.cells[N].cellRing + 1);
				var finishY = Math.sin(thet) * ringHeight * (polarGrid.cells[N].cellRing + 1);
				var startX = Math.cos(thet) * ringHeight * polarGrid.cells[N].cellRing;
				var startY = Math.sin(thet) * ringHeight * polarGrid.cells[N].cellRing;
				polarMaze.graphics.beginStroke("white").moveTo(startX,startY).lineTo(finishX, finishY);
			}
		}
	}

	function rnd(a, b) { //от a до b не включительно выбрать случайное число. rnd(0, 10) от 0 до 9
		return Math.floor(a + Math.random() * (b - a))
    }
	function isThereCcwWall(N){
		for(var i = 0; i < polarGrid.cells[N].links.length; i++){
			if(polarGrid.cells[N].links[i].n == polarGrid.cells[N].ccwNeighbour.n)
				return false;
		}
		return true;
	}

	function isThereOuterWall(N, j){
		for(var i = 0; i < polarGrid.cells[N].links.length; i++){
			if (polarGrid.cells[N].links[i].n == polarGrid.cells[N].outerNeighbours[j].n)
				return false;
		}
		return true;
	}

	createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	createjs.Ticker.framerate = 30;
}
