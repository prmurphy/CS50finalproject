var UI          = require('./UI');

var tileW = settings.tileSize.width || settings.tileSize[0];
var tileH = settings.tileSize.height || settings.tileSize[1];
var pointerEvents = require("pixelbox/pointerEvents");
var TileMap  = require('pixelbox/TileMap');
var Texture = require('pixelbox/Texture');
var hud = new Texture(160, 8); // create a new texture of 128 by 128 pixels
hud.setTilesheet(tilesheet)
var activeButton = 0;
var coinsCollected = 0;
var ballsCollected = 0;
let pinkiesCollected = 0;
let greeniesCollected = 0;
var invX = 30;
var InventorySlot1 = {active: true,  slot: 0, empty: false, item: "sword"};
var InventorySlot2 = {active: false, slot: 1, empty: true, item: "nothing"};
var InventorySlot3 = {active: false, slot: 2, empty: true, item: "nothing"};
let inventory = [InventorySlot1, InventorySlot2, InventorySlot3]

let Pinky = {selected: false, name: "Pinky", cost:3, needs: "coins"};
let Greeny = {selected: true, name: "Greeny", cost:3, needs: "balls"};
let craftableItems = [Pinky, Greeny];
let craftPointer = 1;

var SCREEN_W = settings.screen.width;
var SCREEN_H = settings.screen.height;
var CENTER_X = ~~(SCREEN_W / 2) - 4;
var CENTER_Y = ~~(SCREEN_H / 2) - 4;
var oldY
var oldX
var sayYes = false
var sayNo = false
var Yes = false
var No = false
var mario = {
    x: 60,
    y: 60,
    w: tileW,
    h: tileH
};

var craftTable = {
    x: 80,
    y: 80,
    w: tileW,
    h: tileH
}
var link = {
    x: 100,
    y: 100,
    w: tileW,
    h: tileH
};
var flipH = "";
var flipV = "";

var curser = {
    x: 10,
    y: 60,
    w: tileW,
    h: tileH
};

var craftCurser = {
    x: craftTable.x-32,
    y: craftTable.y-16,
    w: tileW,
    h: tileH
};
var convoMode = false;
var craftState = false;
function AABBcollision(rect1, rect2) { 

    if (rect1.x < (rect2.x * 8) + (8) &&
        rect1.x + rect1.w > (rect2.x * 8) &&
        rect1.y < (rect2.y * 8) + (8) &&
        rect1.y + rect1.h > (rect2.y * 8)) {        
        return true
    }
}

function CharacterAABBcollision(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y) {
        return true
    }
}

function findEmptyInventory(){
    let i = 0;
    for (i = 0; i < inventory.length; i++){
        if (inventory[i].empty == true){
            console.log(i)
            return i;
        }        
    }
    return "none";        
}


function returnInvWithObject(object){
    let i = 0;
    for (i = 0; i < inventory.length; i++){
        if (inventory[i].item == object){            
            return i;            
        }      
    }
    return "none";    
}

function craftObject(object){
    if (object.needs == "coins"){
        console.log("You will need coins X", object.cost)
        if (coinsCollected >= 3){
            coinsCollected = coinsCollected - 3;
            let i = returnInvWithObject("coins")
            if (coinsCollected == 0){
                inventory[i].empty = true;
                inventory[i].item = "nothing";
            }
            pinkiesCollected = pinkiesCollected + 1;
            inventory[i].item = "pinkies";
            console.log("pinkies collected", pinkiesCollected);
        }        
    }
    if (object.needs == "balls"){
        console.log("You will need balls X", object.cost)
        if (ballsCollected >= 3){
            ballsCollected = ballsCollected - 3;
            let i = returnInvWithObject("balls")
            if (ballsCollected == 0){
                inventory[i].empty = true;
                inventory[i].item = "nothing";
            }
            greeniesCollected = greeniesCollected + 1;
            inventory[i].item = "greenies";
            console.log("greenies collected", pinkiesCollected);
        }
    }    
    console.log(object);
}

var walls = []
var coins = []
var balls = []
var map = getMap("mymap"); 
draw(map,0,0)
print(walls.length);
sprite(106, 40, 50);

exports.update = function () {
    camera(mario.x - CENTER_X, mario.y - CENTER_Y )    
    cls();
    draw(map,0,0)
    oldY = mario.y
    oldX = mario.x  
    sprite(222, craftTable.x, craftTable.y);
    if (craftState == true){
        println("CraftState");
        //box
        sprite(25, craftTable.x+8, craftTable.y-16)
        sprite(25, craftTable.x-0, craftTable.y-16)
        sprite(25, craftTable.x-8, craftTable.y-16)
        sprite(25, craftTable.x-16, craftTable.y-16)
        sprite(25, craftTable.x-24, craftTable.y-16)
        sprite(25, craftTable.x+8, craftTable.y-24)
        sprite(25, craftTable.x-0, craftTable.y-24)
        sprite(25, craftTable.x-8, craftTable.y-24)
        sprite(25, craftTable.x-16, craftTable.y-24)
        sprite(25, craftTable.x-24, craftTable.y-24)
        sprite(25, craftTable.x+8, craftTable.y-32)
        sprite(25, craftTable.x-0, craftTable.y-32)
        sprite(25, craftTable.x-8, craftTable.y-32)
        sprite(25, craftTable.x-16, craftTable.y-32)
        sprite(25, craftTable.x-24, craftTable.y-32)
        
        //item
        sprite(144, craftTable.x-24, craftTable.y-24)
        print("=",craftTable.x-14, craftTable.y-24)
        sprite(160,craftTable.x-8, craftTable.y-24)
        print("X 3",craftTable.x-0, craftTable.y-24)

        sprite(128, craftTable.x-24, craftTable.y-16)
        print("=",craftTable.x-14, craftTable.y-16)
        sprite(177,craftTable.x-8, craftTable.y-16)
        print("X 3",craftTable.x-0, craftTable.y-16)

        //curser
        sprite(157, craftCurser.x, craftCurser.y);
        if (btnp.up) {
            if (craftPointer > 0){ 
            console.log(craftPointer) 
            craftPointer = craftPointer - 1;
            console.log(craftPointer)                     
            craftCurser.y = craftTable.y-24
            mario.y += 0
            }
        } 
        if (btnp.down) {
            if (craftPointer < craftableItems.length-1){
            console.log(craftPointer)
            craftPointer = craftPointer + 1;
            console.log(craftPointer)            
            craftCurser.y = craftTable.y-16
            mario.y += 0
            }
        } 

        if (btn.Escape) {
            craftState = false;
        }
        if (btnp.A){
            console.log(craftableItems[craftPointer])
            craftObject(craftableItems[craftPointer])
        } 

    }

    else if (convoMode == true){
        pen(11).print("Whats up, Mario", 12, 80);
        pen(12).print("kinda busy...", 20, 90)
        pen(12).print("Not much...", 20, 100)
        sprite(157, curser.x, curser.y); 
        if (btn.A) {
            if (sayYes == true) {
                Yes = true;
                No = false;           
            }
            if (sayNo == true) {
                No = true;
                Yes = false;
            }
            convoMode = false;
        }
        if (btn.down) {
            sayYes = false;
            sayNo = true;
            curser.y = 97;
            flipH = "";
        }
        if (btn.up) {
            sayYes = true;
            sayNo = false;
            curser.y = 87;
            flipH = "";
        }
        if (btn.right) {
            mario.x += 0;
            flipH = "";
        }
        if (btn.left) {
            mario.x -= 0;
            flipH = "flipH";
        }
    } 
    else{
    if (btn.right) {
        mario.x += 1;
        flipH = "";
    }
    if (btn.left) {
        mario.x -= 1;
        flipH = "flipH";
    }    
    walls = [...map.find(3)];
    coins = [...map.find(160)];
    balls = [...map.find(177)];
    sprite(142, link.x, link.y);
    
    var i;
    for (i = 0; i < walls.length; i++) {
        
        if (AABBcollision(mario, walls[i])==true){                   
                mario.y = oldY
                mario.x = oldX     
        }     
    }

    if (CharacterAABBcollision(mario, craftTable)==true){              
        mario.y = oldY
        mario.x = oldX
        craftState = true;
    }
    if (CharacterAABBcollision(mario, link)==true){             
        mario.y = oldY
        mario.x = oldX
    }  
    oldX = mario.x   
    if (btn.up) {
        mario.y -= 1;      
               
    }
    if (btn.down) {
        mario.y += 1;        
    } 
    for (i = 0; i < walls.length; i++) {        
        if (AABBcollision(mario, walls[i])==true){                  
            
            //print("Hello, Mario", 12, 10);
                mario.y = oldY
                mario.x = oldX 
        }     
    } 
    //need to rename activeButton to 'activeButton'
    for (i = 0; i < coins.length; i++) {        
        if (AABBcollision(mario, coins[i])==true){    
            //find out if there are any 'coins' already in the inventory
            let element = returnInvWithObject("coins")
            console.log("element returned: ", element);
            // if coins do not exist and the activeButton is empty assign coin to active button
            if (element == "none" && inventory[activeButton].empty == true){
            
                map.remove(coins[i].x, coins[i].y);            
                coinsCollected = coinsCollected + 1;
                console.log(activeButton);
                inventory[activeButton].item = "coins";
                console.log(inventory[activeButton].item)
                inventory[activeButton].empty = false
            }
            //if coins do not exist and active button in not empty find next empty inventory slot, there will be an error here in we ever have more items possible in the game
            else if(element == "none" && inventory[activeButton].empty == false) {
                let nextEmptyElement = findEmptyInventory()
                console.log("next empty: ", nextEmptyElement)
                inventory[nextEmptyElement].item = "coins"
                map.remove(coins[i].x, coins[i].y); 
                coinsCollected = coinsCollected + 1;
                inventory[nextEmptyElement].empty = false                
            } 
            //if coins are already in inventory then just add to total count
            else if(element != "none"){
                map.remove(coins[i].x, coins[i].y); 
                coinsCollected = coinsCollected + 1;
            }
        }     
    }

    for (i = 0; i < balls.length; i++) {
        
        if (AABBcollision(mario, balls[i])==true){                 
            
            let element = returnInvWithObject("balls")
            console.log("element returned: ", element);
            // if balls do not exist and the activeButton is empty assign coin to active button
            if (element == "none" && inventory[activeButton].empty == true){            
                map.remove(balls[i].x, balls[i].y);            
                ballsCollected = ballsCollected + 1;
                console.log(activeButton);
                inventory[activeButton].item = "balls";
                console.log(inventory[activeButton].item)
                inventory[activeButton].empty = false
            }
            //if balls do not exist and active button in not empty find next empty inventory slot, there will be an error here in we ever have more items possible in the game
            else if(element == "none" && inventory[activeButton].empty == false) {
                let nextEmptyElement = findEmptyInventory()
                console.log("next empty: ", nextEmptyElement)
                inventory[nextEmptyElement].item = "balls"
                map.remove(balls[i].x, balls[i].y); 
                ballsCollected = ballsCollected + 1;
                inventory[nextEmptyElement].empty = false                
            } 
            else if(element != "none"){
                map.remove(balls[i].x, balls[i].y); 
                ballsCollected = ballsCollected + 1;
            }        
        }     
    }
    if (CharacterAABBcollision(mario, link)==true){             
        mario.y = oldY
        mario.x = oldX
        convoMode = true;            
    }  
    if (CharacterAABBcollision(mario, craftTable)==true){            
        mario.y = oldY
        mario.x = oldX
        craftState = true;            
    }  
    if(No == true){
        print("No way", 12, 10);
    }
    if(Yes == true){
        print("Yeah dude!", 12, 10);
    }
}    
    sprite(153, mario.x, mario.y, flipH, flipV);        
    println(ballsCollected)    
    camera(0,0)         
    UI.displayInventory(inventory, ballsCollected, coinsCollected, greeniesCollected, pinkiesCollected)
    
    if(btnp.Tab){        
        if (activeButton < 2){
        activeButton = activeButton + 1;
        for (i = 0; i < inventory.length; i++) {
            inventory[i].active = false;
          }         
        inventory[activeButton].active = true;        
        } 
        else{
            activeButton = 0;
            inventory[activeButton].active = true;
            inventory[inventory.length - 1].active = false;            
        }
    }     
    
    sprite(141, 30, 110)
    
    
    paper(2)
    
}
