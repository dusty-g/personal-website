let count = 0;
let current_img;
let current_img_back;
let pokemon_sprites = [];
let fireball_right = true;
let y_value = 0;
let x_value = 0;
let previousX = 0;
let facing_right = true;
let fireball = false;
let fire_ball_image;
let fire_count = 1000;
let ball_size = 1;

function setup() {
    // create the canvas equal to the window size, but below the button at the top
    createCanvas(windowWidth, windowHeight - 50);

    // load the sprites
  fire_ball_image = loadImage('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/flame-orb.png');
  let charmander = loadImage("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"); 
  let charmander_back = loadImage("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png");
  let charmeleon = loadImage("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png"); 
  let charmeleon_back = loadImage("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/5.png");
  let charizard = loadImage("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"); 
  let charizard_back = loadImage("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png");
  pokemon_sprites = [[charmander, charmander_back],[charmeleon, charmeleon_back],[charizard, charizard_back]];
    // initialize the current image to the first image
  current_img = charmander;
  current_img_back = charmander_back;
  noCursor(); 
}

// "evolve" function that increments the count and updates the current image
function evolve() {
    count++;
    current_img = pokemon_sprites[(count)%3][0];
    current_img_back = pokemon_sprites[(count)%3][1];

}


function draw() {

    background(color('white'));
    if (fireball){
        if (fireball_right){
            image(fire_ball_image, fire_count, y_value, fire_ball_image.width*ball_size, fire_ball_image.height*ball_size); fire_count++; 
            if (fire_count > windowWidth){fireball = false;}
        } else {
            image(fire_ball_image, fire_count, y_value, fire_ball_image.width*ball_size, fire_ball_image.height*ball_size); fire_count--; 
            if (fire_count < 0){fireball = false;}
        }
    }


    // if the mouse is pressed or the screen is touched
    if (mouseIsPressed || touches.length > 0) {
        // set x_value to mouseX or touches[0].x
        if (touches.length > 0){
            x_value = touches[0].x;
            y_value = touches[0].y;

        } else {x_value = mouseX}

        fireball_function();
    }
    
    if (facing_right){
        if (mouseX >= previousX){
        image(current_img_back, mouseX - 50, mouseY - 50)
        previousX = mouseX
        } else {
            facing_right = false;
        
        }
    } else {
        if (mouseX <= previousX){
            image(current_img, mouseX - 50, mouseY - 50)
            previousX = mouseX
        } else {
            facing_right = true;
        }
    }



}

function fireball_function() {
    
    if (facing_right) {
        fire_count = mouseX + 20; fireball_right = true;
    }
    else {
        fire_count = mouseX - 50; fireball_right = false;
    }
    // adjust the size of the fireball based on the pokemon size
    ball_size = (count % 3) + .75;
    // y_value should be the mouseY value - 40, except when the pokemon is charmander.
    // in that case, it should be the mouseY value - 10 (because charmander is smaller)
    if (count % 3 == 0) {
        y_value = mouseY - 10;
    } else { y_value = mouseY - 40; }

    fireball = true;

}
