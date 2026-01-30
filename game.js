// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const JUMP_POWER = 15;
const GRAVITY = 0.6;
const PLAYER_SPEED = 5;
const BOUNCE_VELOCITY = 8;
const INVINCIBILITY_TIME = 2000; // 2 seconds in milliseconds
const ENEMY_DEFEAT_SCORE = 100;
const COIN_COLLECT_SCORE = 50;

// Game state
let gameRunning = true;
let score = 0;
let lives = 3;
let invincible = false;
let invincibleTimer = 0;
let animationFrameId = null;

// Player object (Mario)
const player = {
    x: 50,
    y: 400,
    width: 32,
    height: 32,
    speed: PLAYER_SPEED,
    velocityY: 0,
    jumping: false,
    jumpPower: JUMP_POWER,
    gravity: GRAVITY,
    color: '#ff0000'
};

// Ground platforms
const platforms = [
    { x: 0, y: 550, width: 800, height: 50 },
    { x: 200, y: 450, width: 150, height: 20 },
    { x: 450, y: 350, width: 150, height: 20 },
    { x: 150, y: 250, width: 120, height: 20 },
    { x: 550, y: 450, width: 150, height: 20 }
];

// Enemies (Goombas)
let enemies = [
    { x: 300, y: 518, width: 30, height: 30, speed: 2, direction: 1, color: '#8B4513', defeated: false },
    { x: 500, y: 518, width: 30, height: 30, speed: 1.5, direction: -1, color: '#8B4513', defeated: false },
    { x: 450, y: 318, width: 30, height: 30, speed: 2, direction: 1, color: '#8B4513', defeated: false }
];

// Coins
let coins = [
    { x: 275, y: 400, width: 20, height: 20, collected: false },
    { x: 500, y: 300, width: 20, height: 20, collected: false },
    { x: 200, y: 200, width: 20, height: 20, collected: false },
    { x: 600, y: 400, width: 20, height: 20, collected: false }
];

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
    if (['Space', 'ArrowLeft', 'ArrowRight', 'KeyR'].includes(e.code)) {
        e.preventDefault();
    }
    
    if (!gameRunning && e.code !== 'KeyR') {
        return;
    }
    
    keys[e.code] = true;
    if (e.code === 'Space' && !player.jumping && gameRunning) {
        player.velocityY = -player.jumpPower;
        player.jumping = true;
    }
    if (e.code === 'KeyR') {
        restartGame();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Draw 8-bit style Mario
function drawPlayer() {
    // Apply flashing effect during invincibility
    if (invincible && Math.floor(Date.now() / 100) % 2 === 0) {
        return; // Skip drawing to create flashing effect
    }
    
    // Mario's body (red)
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(player.x + 8, player.y + 8, 16, 8);
    ctx.fillRect(player.x + 4, player.y + 16, 24, 8);
    
    // Mario's overalls (blue)
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(player.x + 8, player.y + 16, 16, 12);
    
    // Mario's face (skin color)
    ctx.fillStyle = '#ffcc99';
    ctx.fillRect(player.x + 8, player.y + 4, 16, 8);
    
    // Mario's hat
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(player.x + 4, player.y, 24, 4);
    ctx.fillRect(player.x + 8, player.y + 4, 16, 4);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 12, player.y + 8, 3, 3);
    ctx.fillRect(player.x + 19, player.y + 8, 3, 3);
    
    // Shoes
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(player.x + 4, player.y + 28, 10, 4);
    ctx.fillRect(player.x + 18, player.y + 28, 10, 4);
}

// Draw platforms
function drawPlatforms() {
    ctx.fillStyle = '#8B4513';
    platforms.forEach(platform => {
        // Draw brick pattern
        for (let i = 0; i < platform.width; i += 20) {
            for (let j = 0; j < platform.height; j += 10) {
                ctx.fillStyle = (i + j) % 20 === 0 ? '#A0522D' : '#8B4513';
                ctx.fillRect(platform.x + i, platform.y + j, 20, 10);
                ctx.strokeStyle = '#654321';
                ctx.strokeRect(platform.x + i, platform.y + j, 20, 10);
            }
        }
    });
}

// Draw enemies (8-bit Goombas)
function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemy.defeated) return;
        
        // Body
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(enemy.x + 5, enemy.y + 8, 8, 8);
        ctx.fillRect(enemy.x + 17, enemy.y + 8, 8, 8);
        
        // Pupils
        ctx.fillStyle = '#000000';
        ctx.fillRect(enemy.x + 7, enemy.y + 10, 4, 4);
        ctx.fillRect(enemy.x + 19, enemy.y + 10, 4, 4);
        
        // Angry eyebrows
        ctx.fillStyle = '#000000';
        ctx.fillRect(enemy.x + 5, enemy.y + 6, 8, 2);
        ctx.fillRect(enemy.x + 17, enemy.y + 6, 8, 2);
        
        // Feet
        ctx.fillStyle = '#654321';
        ctx.fillRect(enemy.x, enemy.y + 25, 10, 5);
        ctx.fillRect(enemy.x + 20, enemy.y + 25, 10, 5);
    });
}

// Draw coins
function drawCoins() {
    coins.forEach(coin => {
        if (!coin.collected) {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
            ctx.fillRect(coin.x + 4, coin.y - 2, coin.width - 8, coin.height + 4);
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(coin.x + 6, coin.y + 2, coin.width - 12, coin.height - 4);
        }
    });
}

// Draw background
function drawBackground() {
    // Sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#5c94fc');
    gradient.addColorStop(1, '#3c78dc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    drawCloud(100, 50);
    drawCloud(300, 80);
    drawCloud(600, 60);
    
    // Bushes
    ctx.fillStyle = '#228B22';
    ctx.fillRect(20, 530, 60, 20);
    ctx.fillRect(700, 530, 60, 20);
}

// Draw cloud helper
function drawCloud(x, y) {
    ctx.fillRect(x, y, 40, 20);
    ctx.fillRect(x + 10, y - 10, 20, 20);
    ctx.fillRect(x + 20, y - 5, 25, 20);
}

// Update player physics
function updatePlayer() {
    // Horizontal movement
    if (keys['ArrowLeft']) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight']) {
        player.x += player.speed;
    }
    
    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    
    // Apply gravity
    player.velocityY += player.gravity;
    player.y += player.velocityY;
    
    // Check platform collisions
    let onPlatform = false;
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            if (player.velocityY > 0) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.jumping = false;
                onPlatform = true;
            }
        }
    });
    
    // Check if fallen off screen
    if (player.y > canvas.height && !invincible) {
        takeDamage();
    }
}

// Update enemies
function updateEnemies() {
    enemies.forEach(enemy => {
        if (enemy.defeated) return;
        
        enemy.x += enemy.speed * enemy.direction;
        
        // Reverse direction at edges or platform edges
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.direction *= -1;
        }
        
        // Check collision with platforms
        platforms.forEach(platform => {
            if (checkCollision(enemy, platform)) {
                enemy.y = platform.y - enemy.height;
            }
        });
        
        // Check collision with player
        if (checkCollision(player, enemy) && !invincible) {
            // If player is jumping on enemy from above
            if (player.velocityY > 0 && player.y + player.height - 10 < enemy.y) {
                enemy.defeated = true;
                score += ENEMY_DEFEAT_SCORE;
                updateScore();
                player.velocityY = -BOUNCE_VELOCITY; // Bounce
            } else {
                // Player hit by enemy
                takeDamage();
            }
        }
    });
}

// Update coins
function updateCoins() {
    coins.forEach(coin => {
        if (!coin.collected && checkCollision(player, coin)) {
            coin.collected = true;
            score += COIN_COLLECT_SCORE;
            updateScore();
        }
    });
}

// Handle taking damage
function takeDamage() {
    lives--;
    updateLives();
    if (lives <= 0) {
        gameOver();
    } else {
        resetPlayerPosition();
        invincible = true;
        invincibleTimer = Date.now();
    }
}

// Update invincibility
function updateInvincibility() {
    if (invincible && Date.now() - invincibleTimer > INVINCIBILITY_TIME) {
        invincible = false;
    }
}

// Collision detection
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Update lives display
function updateLives() {
    document.getElementById('lives').textContent = lives;
}

// Reset player position
function resetPlayerPosition() {
    player.x = 50;
    player.y = 400;
    player.velocityY = 0;
    player.jumping = false;
}

// Game over
function gameOver() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Restart game
function restartGame() {
    // Cancel any existing animation frame
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    gameRunning = true;
    score = 0;
    lives = 3;
    invincible = false;
    invincibleTimer = 0;
    updateScore();
    updateLives();
    resetPlayerPosition();
    
    // Reset enemies
    enemies = [
        { x: 300, y: 518, width: 30, height: 30, speed: 2, direction: 1, color: '#8B4513', defeated: false },
        { x: 500, y: 518, width: 30, height: 30, speed: 1.5, direction: -1, color: '#8B4513', defeated: false },
        { x: 450, y: 318, width: 30, height: 30, speed: 2, direction: 1, color: '#8B4513', defeated: false }
    ];
    
    // Reset coins
    coins.forEach(coin => coin.collected = false);
    
    document.getElementById('gameOver').classList.add('hidden');
    gameLoop();
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawEnemies();
    drawPlayer();
    
    // Update
    updatePlayer();
    updateEnemies();
    updateCoins();
    updateInvincibility();
    
    // Loop
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Start game
document.getElementById('restartButton').addEventListener('click', restartGame);
gameLoop();
