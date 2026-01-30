/*
* Dans les options de l'entité (Key/Value), vous pouvez modifier:
*    waitTime: Pour tirer plus ou moins vite (défaut: 3 secondes).
*    proxRange: La zone de sécurité où il ne tire pas (défaut: 32 pixels).
*/
ig.module(
    'game.entities.cannon'
)
.requires(
    'impact.entity'
)
.defines(function() {

    // --- L'ENTITÉ CANON ---
    EntityCannon = ig.Entity.extend({
        size: {x: 16, y: 16},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.FIXED,
        
        animSheet: new ig.AnimationSheet('media/cannon.png', 16, 16),
        
        waitTime: 3, 
        waitTimer: null,
        proxRange: 48,  // Trop près (ne tire pas)
        maxRange: 152,  // Trop loin (ne tire pas) 

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.waitTimer = new ig.Timer(this.waitTime);
            // Gestion des couleurs
            switch (this.color) {
                case 'green': this.addAnim('idle', 1, [0]); break;
                case 'yellow': this.addAnim('idle', 1, [1]); break;
                case 'red': this.addAnim('idle', 1, [2]);  break;
				default: this.addAnim('idle', 1, [3]); break;
            }
        },

        update: function() {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];

            if (player) {
                var dist = this.distanceTo(player);

                // Le canon tire seulement si le joueur est entre 32px et 240px
                if (this.waitTimer.delta() > 0 && dist > this.proxRange && dist < this.maxRange) {
                    var dir = (player.pos.x < this.pos.x) ? -1 : 1;
                    var spawnX = this.pos.x + (dir === 1 ? this.size.x : -14); // Adjust spawn position based on direction
                    ig.game.spawnEntity(EntityBullet, spawnX, this.pos.y, {direction: dir});
                    ig.game.sndFireball.play(); 
                    this.waitTimer.set(this.waitTime + (Math.random() * 1)); 
                }
            }
            this.parent();
        }
    });

    EntityBullet = ig.Entity.extend({
        size: {x: 16, y: 14},
        offset: {x: 0, y: 1},
        maxVel: {x: 150, y: 0},
        gravityFactor: 0,
        
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NONE, 
        
        animSheet: new ig.AnimationSheet('media/stone.png', 16, 16),

        direction: 1,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.vel.x = this.maxVel.x * this.direction;
            this.addAnim('fly', 0.1, [0]); 
            this.currentAnim.flip.x = (this.direction === 1);
        },

        update: function() {
            // Détruit le bullet s'il sort de l'écran (nettoyage)
            if (this.pos.x < ig.game.screen.x - 64 || 
                this.pos.x > ig.game.screen.x + ig.system.width + 64) {
                this.kill();
            }
            this.parent();
        },
        
        handleMovementTrace: function(res) {
            this.pos.x += this.vel.x * ig.system.tick;
            this.pos.y += this.vel.y * ig.system.tick;
        },

        check: function(other) {
            if (other.invincible) return;

            if (other.vel.y > 0 && other.pos.y + other.size.y < this.pos.y + 8) {
                other.vel.y = -150;
                this.kill();
                ig.game.spawnEntity(EntityEnemyDeathSmoke, this.pos.x, this.pos.y); 
            } else {
                other.receiveDamage(1, this);
            }
        }
    });
});