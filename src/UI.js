var main          = require('./main');

export function displayInventory(inventory, ballsCollected, coinsCollected, greeniesCollected, pinkiesCollected){
    //DISPLAYING INVENTORY
    var inv;
    let invX = 30
    for (inv = 0; inv < inventory.length; inv++) {
        if(inventory[inv].active == true){
            sprite(107, invX, 110)
            if (inventory[inv].item == "coins" && coinsCollected > 0){
                sprite(160, invX, 110)
                pen(11).print(coinsCollected, invX, 110);                
                }
            if (inventory[inv].item == "balls" && ballsCollected > 0){
                    sprite(177, invX, 110)
                    pen(1).print(ballsCollected, invX, 110);  
                }
            if (inventory[inv].item == "pinkies" && pinkiesCollected > 0){
                    sprite(144, invX, 110)
                    pen(1).print(pinkiesCollected, invX, 110); 
                }
            if (inventory[inv].item == "greenies" && greeniesCollected > 0){
                    sprite(128, invX, 110)
                    pen(1).print(greeniesCollected, invX, 110); 
                }             
        }
        else{
            sprite(106, invX, 110) 
            if (inventory[inv].item == "coins" && coinsCollected > 0){
            sprite(160, invX, 110) 
            pen(11).print(coinsCollected, invX, 110); 
            }
            if (inventory[inv].item == "balls" && ballsCollected > 0){
                sprite(177, invX, 110)
                pen(1).print(ballsCollected, invX, 110); 
            }

            if (inventory[inv].item == "pinkies" && pinkiesCollected > 0){
                sprite(144, invX, 110)
                pen(1).print(pinkiesCollected, invX, 110); 
            }
            if (inventory[inv].item == "greenies" && greeniesCollected > 0){
                sprite(128, invX, 110)
                pen(1).print(greeniesCollected, invX, 110); 
            }
        }

    invX = invX + 10
    }
}