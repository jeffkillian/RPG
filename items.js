// You're creating an RPG, and you're making your primal classes
// First, lets skeleton out your enemy classes
// Lets start with an abstract class that other enemies will inherit functionality from


//create random quote array and make the quarrel display them
//submit everything 



/*
 * Items don't move and can be picked up
 */
//Names of available items
var items=[Potion,Health];

function Item(){
    this.init=function(startPosition){
        this.ID=game.items.length;
        game.items.push(this);
        this.timeRemaining=150;//remain for 5 seconds by default
        this.pos=startPosition||game.findOpenPosition();//place in open position
        $(game.mapDivName).append("<div class='item gameDiv' id='item"+this.ID+"'></div>");
        this.div=$("#item"+this.ID);
    };
    
}
/*
 * called each game loop to check
 */
Item.prototype.update=function(){
    this.timeRemaining--;//only show for a certain time.
    
    if (!this.timeRemaining){
        this.removeItem();
    }

    var characterOverThis=game.positions[this.pos.x][this.pos.y];
    if (characterOverThis){
            this.apply(characterOverThis);
     }
};


Item.prototype.removeItem=function(){
    this.div.remove();//remove from view
    var itemIdx = game.items.indexOf(this);
    game.items.splice(itemIdx, 1);
};

Item.prototype.draw=function(){
    var self=this;
    this.div.css({'top': game.gridSize*self.pos.y, 
                    'left': game.gridSize*self.pos.x});
};

Item.prototype.applyTo=function(character){    
};

Item.prototype.apply=function(character){
    this.applyTo(character);
    this.removeItem();
};

Health.prototype=new Item();
function Health(inputPoint){
    this.init(inputPoint);
    this.healValue=25;
    this.div.addClass('health');
    this.applyTo=function(character){
        character.heal(this.healValue);
        };
    
}
/*
 * Will either give you double strength or reverse controls
 */
Potion.prototype=new Item();
function Potion(){
    this.init();
    this.applyTo=function(character){
        if (Math.random()>.5){
            character.stepSize*=-1;
            msg("Potion caused "+ character.name+" to become confused");
            setTimeout(function(){
                character.stepSize*=-1;
                msg("Potion has worn off, "+character.name+" is no longer confused");
                
            },5000);
        }else{
            character.strength*=2;
            msg("Potion caused"+ character.name+" to become stronger: New strength is"+character.strength);
            setTimeout(function(){
                character.strength/=2;
                msg("Potion has worn off, "+character.name+" is no longer confused");
                
            },5000);
        }
    };
    this.div.addClass('potion');
    
}








