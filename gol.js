//Any live cell with two or three live neighbours survives.
//Any dead cell with three live neighbours becomes a live cell.
//All other live cells die in the next generation. Similarly, all other dead cells stay dead.

var inner = document.getElementById("inner");
var world = document.getElementById("world");

var pause = -1;
var pressed = false;

const cols = 40;
//var ratio = inner.clientWidth / inner.clientHeight;
var square_width = inner.clientWidth / cols;
var square_height = square_width;

world.width = inner.clientWidth;
world.height = inner.clientHeight;

const rows = Math.floor(world.height / square_height);

world.setAttribute('tabindex','0');
world.focus();

world.addEventListener("click", click);
world.addEventListener("keyup", toggle);
world.addEventListener("keydown", press);

var ctx = world.getContext("2d");
let curr_gen = Array(rows).fill().map(() => Array(cols).fill(0));
let next_gen = Array(rows).fill().map(() => Array(cols).fill(0));

function main() {
    setInterval(iterate, 250);
    if(pause == 1) {
        clearInterval(pause);
    }
}

function render_grid(grid, ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,screen.width,screen.height)

    ctx.fillStyle = "#000000";
    for(var y = 0; y < rows; y++) {
        for(var x = 0; x < cols; x++) {
            if(grid[y][x] == 1){
                ctx.fillRect(x*square_width, y*square_height, square_width, square_height);
            }
        }
    }
}

function count_neighbours(grid, x, y){
    var count = 0
    for(var Y = -1; Y <= 1; Y++) {
        for(var X = -1; X <= 1; X++) {
            if((x+X >= 0 && x+X < cols) && (y+Y >= 0 && y+Y < rows)) {
                if(grid[y+Y][x+X] == 1) {
                    count++;
                }
            }
        }
    }
    if(grid[y][x] == 1) {
        count--;
    }
    return count;
}

function next_iteration(curr_gen, next_gen) {
    for(var y = 0; y < rows; y++) {
        for(var x = 0; x < cols; x++) {
            let neighbours = count_neighbours(curr_gen, x, y);

            if (curr_gen[y][x] == 1) {
                if(neighbours < 2) {
                    next_gen[y][x] = 0;
                }
                else if (neighbours == 2 || neighbours == 3) {
                    next_gen[y][x] = 1;
                } else if (neighbours > 3) {
                    next_gen[y][x] = 0;
                }
            } else if (curr_gen[y][x] == 0) {
                if(neighbours == 3) {
                    next_gen[y][x] = 1;
                }
            }
        }
    }
    return next_gen;
}

function iterate() {
    if (pause == -1) {
        curr_gen = next_iteration(curr_gen, next_gen);
        render_grid(curr_gen, ctx);
        next_gen = Array(rows).fill().map(() => Array(cols).fill(0));
    }
}

function click(event) {
    var mouse_x = event.clientX;
    var mouse_y = event.clientY;

    //console.log(mouse_x, mouse_y);

    var x = Math.floor(mouse_x / square_width);
    var y = Math.floor(mouse_y / square_height);


    //if (y == 0 && x == 0) {
        
    //}

    if (curr_gen[y][x] == 1) {
        curr_gen[y][x] = 0;
    } else {
        curr_gen[y][x] = 1;
    }
    render_grid(curr_gen, ctx);
}

function toggle(event) {

    if(event.keyCode == 32 && pressed) {
        pressed = false;
        pause *= -1;
    }
}

function press(event) {
    if(event.keyCode == 32) {
        pressed = true;
    }
    if(event.keyCode == 82) {
        curr_gen = Array(rows).fill().map(() => Array(cols).fill(0));
        render_grid(curr_gen, ctx);
    }
}

window.onload=()=>{
    main();
}
//radial gradient?