

function Point(x,y){
    this.x=x;
    this.y=y;
    
    this.equals=function(toCompare){
        return this.x == toCompare.x && this.y == toCompare.y;
    };
    
    this.multiply=function(coefficient){
        this.x*=coefficient;
        this.y*=coefficient;
    };
}

var jeff;
var bob;

function Game(){
    this.ID=0;//unique IDs for characters and items
    this.characters=[];
    this.items=[];
    this.mapDivName='#grid';
    this.gameSize=20;
    this.gridSize=$(this.mapDivName).width()/this.gameSize;//how many pixels each grid square takes up
    this.positions=[];
    var tempArr=[];
    //create static 2d array of potential positions
    for (var j=0;j<this.gridSize;j++){
        tempArr.push("");
    }
    for (var i=0;i<this.gridSize;i++){
        this.positions.push(tempArr.slice(0));//clone tempArray so they don't all point to the same array
    }
    
    //Where's the fun if you can just read them here? Start a beef!
     this.beefPhrases=['WW91IHNtZWxsIGxpa2UgY2FiYmFnZQ==',
    'WW91ciBib2R5IGlzIGRpc3Byb3BvcnRpb25hdGVseSBzbWFsbCB3aGVuIGNvbXBhcmVkIHRvIHlvdXIgaGVhZA==',
    'WW91IHN0YXRlIHRoZSBvYnZpb3VzIHdpdGggYSBzZW5zZSBvZiBkaXNjb3Zlcnk=',
    'SW4gYSBiYXR0bGUgb2Ygd2l0cyB5b3UncmUgYW4gdW5hcm1lZCBtYW4=',
    'RG8gbWlycm9ycyBtYWtlIHlvdSBzYWQ/',
    'SSBnZW51aW5lbHkgZGlzc2FwcHJvdmUgb2YgeW91',
    'WW91IGFyZSBhbiBhdmVyYWdlIGNlbGxpc3QgYXQgYmVzdCE=',
    'RXZlbiBkb2dzIGRvbid0IGxpa2UgeW91'
    
    ];
    
    this.getBeefMessage=function(){
        var phraseIdx=Math.floor(Math.random()*this.beefPhrases.length);
        return atob(this.beefPhrases[phraseIdx]);//atob to encourage you to beef to see the messages
    };
    
}

Game.prototype.start=function(){
    new Player("Jeff");
    new Orc("Bob"); 
       
};

Game.prototype.getID=function(){
    return this.ID++;
};


/*
 * returns a random open position on the board (in the form of a point)
 */
Game.prototype.findOpenPosition=function(){
    var returnPos="";
    while (returnPos==""){
        var tempPoint=new Point(Math.floor(Math.random()*this.gridSize),
                                Math.floor(Math.random()*this.gridSize));
        if (this.getObjAtPos(tempPoint)!=""){
            continue;
        }
        returnPos=tempPoint;
    }
    return returnPos;
};


/*
 * gets the contents at a position
 */
Game.prototype.getObjAtPos=function(point){
    return this.positions[point.x][point.y];
};

/*
 * determines if a given point is within the bounds of the board
 */
Game.prototype.isValidPoint=function(point){
     return (point.x<this.gameSize&&point.x>=0&&point.y<this.gameSize&&point.y>=0);
};


/*
 * update all locations of characters
 */
Game.prototype.update=function(){
        //adjust all object places
    this.characters.forEach(function (character){
        character.update();
    });
    //if any characters are over items, give them the item
    this.items.forEach(function (item){
        item.update();//decreases the timer
    });

    //randomly spawn item every so often
    if (Math.random()<.0015){
        var itmIdx=Math.floor(Math.random()*items.length);
        new items[itmIdx]();
    }
};


/*
 * update the view of all objects
 */
Game.prototype.draw=function(){
    this.characters.forEach(function (character){
        character.draw();
    });
    
    this.items.forEach(function (item){
        item.draw();
    });
};

function step(){
    game.update();
    game.draw();

    
};
var game=new Game();


// Start the game loop
game._intervalId = setInterval(step, 30);



