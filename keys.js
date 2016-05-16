
function setKeys(e){
    e.preventDefault();

         //Space bar
    if (e.keyCode==32){
         jeff.startAttack();
         return;
    }

    //Arrow keys   
    var moveVector;
    switch(e.keyCode){
        case 37:
            moveVector=new Point(-1,0);//left
            break;
        case 38:
            moveVector=new Point(0,-1);//up
            break;
        case 39:
            moveVector=new Point(1,0);//right
            break;
        case 40:
            moveVector=new Point(0,1);//down
            break;
   }
   if (moveVector){
        moveVector.multiply(jeff.stepSize);
        jeff.moveRelative(moveVector);
    }   
};