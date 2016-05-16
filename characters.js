/*
 * Characters can be both enemy or player
 */

function Character(name){
    this.health=100;
    this.strength=20;//Default 20, so they aren't overpowered
    this.defense=100;
    this.stepSize=1;
    this.isAlive=true;
    this.name="Steven";
    this.range=1;//the radius in square blocks you can attack
    this.movePercentage=.1;
    this.attackTimer=this.timeBetweenAttacks=0; //by default, characters can attack at will without waiting
    this.addCharToGame=function(){
        this.ID=game.getID();
        game.characters.push(this);
        this.pos=game.findOpenPosition();
        game.positions[this.pos.x][this.pos.y]=this;
        $(game.mapDivName).append("<div class='character gameDiv' id='char"+this.ID+"'></div>");
        this.div=$("#char"+this.ID);
   };
}

Character.prototype.takeDamage=function(amount){
     this.health-=amount;
     if (this.health<=0){
        this.die();
     }
     
};

Character.prototype.heal=function(amount){
    if (amount<=0) {return;};//It's not really healing if it's less than 0
    this.health+=amount;
    msg(this.name+" healed up by "+amount);
};

Character.prototype.die=function(){
     this.isAlive=false;
     msg(this.name+" has died!");
     var charIndex = game.characters.indexOf(this);
     game.characters.splice(charIndex, 1);
     var x=this.pos.x;
     var y=this.pos.y;
     game.positions[x][y]=""
     this.div.remove();
};



/*
 * One characters does damage to Another
 */
Character.prototype.dealDamageTo=function(target){
  if (!target.isAlive||!this.isAlive) {
      return;
  }
  
  var attackVal=this.strength+Math.floor(Math.random()*20);
  msg(this.name+" has attacked "+target.name+" for "+attackVal+" damage!");
  this.attackTimer=this.timeBetweenAttacks;//reset the attack timer
  target.takeDamage(attackVal);
  
};
/*
 * two characters will fight for a few rounds. Range doesn't matter, this is a verbal quarrel.
 */
Character.prototype.startABeef=function(target){
    
    //go three rounds, turn based
    for (var i=0;i<3;i++){
        msg(this.name+" shouted:"+game.getBeefMessage());
        this.dealDamageTo(target);//You go first, you have the element of surprise
        if(!target.isAlive) break;
        msg(target.name+" replied:"+game.getBeefMessage());
        target.dealDamageTo(this);
        if(!this.isAlive) break;
    }
};

/*
 * move to specific point, x increases to the right, y increases down. 
 */
Character.prototype.moveTo=function(point){
    if (!game.isValidPoint(point)||game.getObjAtPos(point)!=""){//first check if it's a valid point to avoid out of bounds errors
        return;
    }
    game.positions[this.pos.x][this.pos.y]="";//remove old position from positions array
    game.positions[point.x][point.y]=this;//add in new position
    this.pos=point;//reassign where I am
    
};

/*
 * move x to the right, y down from your current location
 */
Character.prototype.moveRelative=function(point){
    this.moveTo(new Point(this.pos.x+point.x,this.pos.y+point.y));
    
};
/*
 * draws the character in its current state on the screen
 */
Character.prototype.draw=function(){
    var self=this;
    this.div.css({'top': game.gridSize*self.pos.y, 
                    'left': game.gridSize*self.pos.x});
    
};

Character.prototype.update=function(){
    
};

Character.prototype.canStrike=function(target){
    if (this.attackTimer>0) return false;
    return Math.max(
                Math.abs(target.pos.x-this.pos.x),
                Math.abs(target.pos.y-this.pos.y)
                )<=this.range;
};



/*
 * PLAYER
 */

Player.prototype=new Character();
function Player(name){
  this.addCharToGame();
  this.team=1;
  this.stepSize=1;
  this.name=name;
  this.div.addClass('player');
  jeff=this;
}

Player.prototype.update=function(){
};

/*
 * Starts the player's attack, physically attacking anybody within range 
 */
Player.prototype.startAttack=function(){
    var self=this;//loop over characters here, as they'll increase linearly. Checking each tile in range will increase by range^2 as range increases
    game.characters.forEach(function (character){
       if (character.team!=2) return;//only attack enemies
       self.tryToAttack(character);
    });
};

/*
 * when the player attempts to attack target.  Damages target player if successful.
 */
Player.prototype.tryToAttack=function(target){
     
    if (!this.canStrike(target)){
          return;
      }else{
          this.dealDamageTo(target);
        }
};


/*
 * ENEMIES
 * 
 */
Enemy.prototype=new Character();

function Enemy(){
    this.team=2;
    this.movePercentage=.4; //Percent of time the enemy will make a move on a given turn
}

Enemy.prototype.die=function(){
    Character.prototype.die.call(this);
    new Health(new Point(this.pos.x,this.pos.y))//enemies drop health
}


Enemy.prototype.update=function(){
    if (!this.isAlive) return;
    if (this.attackTimer){this.attackTimer--;}
    //attack randomly if within range
    if (this.canStrike(jeff)&&Math.random()<.1){
        this.dealDamageTo(jeff);
    }
    if (Math.random() > this.movePercentage) return;
    var enemyMoved=false;
    while (!enemyMoved){//ignoring the fact that this would infinite loop if you were surrounded by characters for now. This isn't going to be a real game.
        var change=this.stepSize*(Math.random() < 0.5 ? -1 : 1); //decides which direction they go
        var newPosition;//the new position the enemy will move To
        //decides which dimension to change
        if (Math.random()<0.5){//change x
            newPosition=new Point(this.pos.x+change,this.pos.y);
        }else{//change y
             newPosition=new Point(this.pos.x,this.pos.y+change);
        }
        if (game.isValidPoint(newPosition)&&game.getObjAtPos(newPosition)==""){
            enemyMoved=true;
            this.moveTo(newPosition);
        }
    }
};


/*
 * move faster
 */
Orc.prototype=new Enemy();
function Orc(name){
    this.addCharToGame();
    this.name=name||this.name;
    this.stepSize=1;
}

Giant.prototype=new Enemy();
/*
 * giants are big, and take a while between swings. 
 * They also can't effectively hit something that is too close to them because they can't get a good swing in
 */
function Giant(name){
   this.name=name||this.name;
   this.range=3;//They have a long range due to being giant and all
   this.addCharToGame();
   this.stepSize=4;//They take big steps
   this.movePercentage=.01;//Percent of time the enemy will move on a given turn
   this.attackTimer=this.timeBetweenAttacks=30;//number of frames that must occur between physical attacks (once per second)
   this.div.addClass('giant');
}


Giant.prototype.canStrike=function(target){
    //First check if they can strike normally
    if (!Character.prototype.canStrike.call(this,jeff)) return false;
    //but don't allow it if the target is too close(within one square)
    if((Math.abs(target.pos.x-this.pos.x)==1)||(Math.abs(target.pos.y-this.pos.y)==1)) return false;
    return true;
    
}

/*
 * Cats follow you around, licking you which increases your health for some reason. I'm not entirely sure why I thought this should be included.
 */


Cat.prototype=new Character();

function Cat(){
    this.addCharToGame();
    this.name='Mr TinderFiddles';
    this.health=900;
    this.stepSize=1;
    this.movePercentage=.10;//Percent of time the cat will move on a given turn
    this.timeUntilNextLick=this.lickResetTime=10;
    this.range=1;
    
}

Cat.prototype.update=function(){
    if (this.timeUntilNextLick>0){
        this.timeUntilNextLick--;
    }
    //if we are next to player, start licking
    if (this.canStrike(jeff)&&!this.timeUntilNextLick&&jeff.health<100){
        this.lick();
    }
    
    if (Math.random()>this.movePercentage) return;
    
    //move closer to player
    var xDiff=jeff.pos.x-this.pos.x;
    var xChange=xDiff > 0 ? 1 : xDiff < 0 ? -1 : 0; 
    var yDiff=jeff.pos.y-this.pos.y;
    var yChange=yDiff > 0 ? 1 : yDiff < 0 ? -1 : 0; 
    
    this.moveRelative(new Point(xChange,yChange));
    
}

Cat.prototype.lick=function(){
    jeff.heal(10);
    this.timeUntilNextLick=this.lickResetTime;
}

/*
 * msg is easier than typing console.log;
 */
function msg(string){
    console.log(string);
}
