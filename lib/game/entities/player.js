ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity', 
    'game.entities.dust'
)
.defines(function() {

    EntityPlayer = ig.Entity.extend({
        _wmIgnore: true,

        size: {x: 8, y: 14},
        offset: {x: 4, y: 2},
        maxVel: {x: 80, y: 400},
        friction: {x: 100, y: 0},
        
        flip: false,
        jump: 300,
        platform: false,

        invincible: false,  // God mode flag
        noClip: false,      // No clip flag

        onLadder: false,
        onTopLadder: false, 

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet('media/player.png', 16, 16),

		//		  _____ _   _ _____ _______ 
		//		 |_   _| \ | |_   _|__   __|
		//		   | | |  \| | | |    | |   
		//		   | | | . ` | | |    | |   
		//		  _| |_| |\  |_| |_   | |   
		//		 |_____|_| \_|_____|  |_| 
		//
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.setupAnimation(ig.gameState.skin);
        },

        setupAnimation: function(offset) {
            offset = offset * 42;
            this.addAnim('idle', 0.3, [0 + offset, 1 + offset, 2 + offset, 3 + offset]);    // Animation idle
            this.addAnim('run', 0.07, [12 + offset, 13 + offset, 14 + offset, 15 + offset, 16 + offset, 17 + offset]); // Animation run
            this.addAnim('jump', 1, [7 + offset, 8 + offset]);          // Animation jump
            this.addAnim('fall', 1, [16 + offset]);                     // Animation fall
            this.addAnim('wall', 1, [8 + offset]);                      // Animation wall cling
            this.addAnim('wallSlide', 0.2, [8 + offset, 15 + offset]);  // Animation wall slide
            this.addAnim('idle_long', 0.8, [0 + offset , 9 + offset]);  // Animation pour l'inactivité
            this.addAnim('crouch', 1, [5 + offset]);                    // Animation s'accroupir 
            this.addAnim('swim', 0.1, [24 + offset, 25 + offset, 26 + offset, 27 + offset, 28 + offset, 29 + offset]); // Animation nager
            this.addAnim('idleSwim', 0.5, [34 + offset, 35 + offset]);  // Animation imobile nager                       
            this.addAnim('dash', 1, [1 + offset]);                      // Animation dash
            this.addAnim('groundPound', 1, [2 + offset]);               // Animation ground pound
            this.addAnim('climb', 0.15,[19 + offset]);                  // Animation ladder pause
            this.addAnim('climbing', 0.18, [20 + offset, 21 + offset]); // Animation ladder up/down 
            this.addAnim('win', 1, [9 + offset]);                       // Animation win
        },

		//	  _    _ _____  _____       _______ ______ 
		//	 | |  | |  __ \|  __ \   /\|__   __|  ____|
		//	 | |  | | |__) | |  | | /  \  | |  | |__   
		//	 | |  | |  ___/| |  | |/ /\ \ | |  |  __|  
		//	 | |__| | |    | |__| / ____ \| |  | |____ 
		//	  \____/|_|    |_____/_/    \_\_|  |______|
		//
        update: function() {
            // --- Mode No Clip Debug ---
            if (this.noClip) {
                // Vitesse de vol
                var speed = 200; 
                this.vel.x = 0;
                this.vel.y = 0;

                // Déplacement libre (Haut/Bas/Gauche/Droite)
                if (ig.input.state('left')) {
                    this.vel.x = -speed;
                    this.flip = true;
                } else if (ig.input.state('right')) {
                    this.vel.x = speed;
                    this.flip = false;
                }
                if (ig.input.state('up')) {
                    this.vel.y = -speed;
                } else if (ig.input.state('down')) {
                    this.vel.y = speed;
                }

                // MISE À JOUR MANUELLE DE LA POSITION
                // On modifie pos directement pour ignorer les collisions (murs)
                this.pos.x += this.vel.x * ig.system.tick;
                this.pos.y += this.vel.y * ig.system.tick;

                // Gestion de l'animation (Vol = animation "jump" ou "fall" par exemple)
                this.currentAnim = this.anims.jump;
                this.currentAnim.flip.x = this.flip;
                this.currentAnim.alpha = 0.5; // Très transparent pour montrer l'état "Fantôme"
                this.currentAnim.update();

                // IMPORTANT : On retourne ici pour ne PAS exécuter la physique normale
                return; 
            }
            // Si on n'est pas en mode Vol, on remet l'alpha normal (ou celui du God Mode)
            else if (!this.invincible) {
                if(this.currentAnim) this.currentAnim.alpha = 1;
            }
            // --- Fin Mode No Clip Debug --- 
            
            // Movement controls left and right
            if (ig.input.state('left')) {
                this.accel.x = -this.maxVel.x * 1.5;
                //if (this.standing) {
                    this.flip = true;
                //}
            } else if (ig.input.state('right')) {
                this.accel.x = this.maxVel.x * 1.5;
                //if (this.standing) {
                    this.flip = false;
                //}
            } else {
                this.accel.x = 0;
            }
            // Jumping mechanics 
            if (this.standing && ig.input.pressed('jump')) {
                this.vel.y = -this.jump;
                this.falling = false;
                ig.game.sndJump.play();
            }
            // Variable jump height mechanic
            if (!this.standing && !ig.input.state('jump') && !this.falling) {
                this.vel.y = Math.floor(this.vel.y / 2);
                this.falling = true;
            }
            // Limit jump height when holding item 2 (feather)
            if (ig.gameState.item == 2 && ig.input.state('jump') && this.vel.y > 60) {
                this.vel.y = 60;
            }
            // Fireball shooting mechanic
            if (ig.input.pressed('fire') && ig.gameState.item == 1) {
                var balls = ig.game.getEntitiesByType(EntityFireball);
                if (balls.length < 3) {
                    ig.game.sndFireball.play();
                    ig.game.spawnEntity(EntityFireball, this.pos.x + (this.size.x / 2), this.pos.y, {
                        flip: this.flip
                    });
                }
            }
            // Animation state management
            if (this.vel.y < 0 && !this.platform) {
                this.currentAnim = this.anims.jump;
            } else if (this.vel.y > 0 && !this.platform) {
                this.currentAnim = this.anims.fall;
            } else if (this.vel.x !== 0) {
                this.currentAnim = this.anims.run;
            } else {
                this.currentAnim = this.anims.idle;
            }

            this.currentAnim.flip.x = this.flip;

            this.playerMovementControl(); // Ladder movement control
            this.animManager();           // Ladder animation manager
            this.gravityManager();        // Gravity manager for ladder
            
            // Stop movement on ladder
            if (this.onLadder) {
                this.vel.x = 0;
                this.vel.y = 0;
            } 

            this.parent();
            this.platform = false;
            
            // --- God mode visual effect ---
            if (this.invincible) {
                this.currentAnim.alpha = 0.5; // Semi-transparent
            } else {
                this.currentAnim.alpha = 1;   // Normal
            } 
            // --- End of God mode visual effect ---
        },

        gravityManager: function() {
            if (this.onLadder) {
                this.gravityFactor = 0;
            } else {
                this.gravityFactor = 1;
            }
            this.onTopLadder = false;
        },
            
        playerMovementControl: function() {
            if (this.onLadder) {
                if (ig.input.state('up')) {
                    this.gravityFactor = 0;
                    this.pos.y -= 0.5;
                }
                if (ig.input.state('down')) {
                    this.gravityFactor = 0;
                    this.pos.y += 0.5;
                }
                return;
            }
        },
    
        animManager: function() {
            if (this.onLadder) {
                if (ig.input.state('up') || ig.input.state('down')) {
                    this.currentAnim = this.anims.climbing;
                } else {
                    this.currentAnim = this.anims.climb;
                }
                return;
            }
        },

        receiveDamage: function(amount, from) {
            // God mode check
            if (this.invincible) {
                return; // Si invincible, on arrête la fonction ici, aucun dégât n'est pris
            }

            ig.gameState.lives -= 1;
            ig.gameState.item = 0;
            ig.game.spawnEntity(EntityPlayerDead, this.pos.x, this.pos.y);
            this.kill();
        },
        
        handleMovementTrace: function(res) {
		  // EntityDust
		  if ((res.collision.y || res.collision.slope.ny == -1) && this.vel.y > 32) {
            ig.game.spawnEntity(EntityDust, this.pos.x - 5, this.pos.y);
            }
            // Interaction with blocks when landing on special tiles
            this.parent(res);

            if (res.collision.y && res.tile.y == 99 && !this.standing) {
                var blocks = ig.game.getEntitiesByType(EntityBlock);
                for (var i = 0, length = blocks.length; i < length; i++) {
                    var block = blocks[i];
                    if ((this.pos.x + this.size.x >= block.pos.x) && (this.pos.x <= block.pos.x + block.size.x) && (this.pos.y > block.pos.y) && (this.pos.y <= block.pos.y + block.size.y + 4)) {
                        block.action();
                        break;
                    }
                }
            }
        }
    });
});