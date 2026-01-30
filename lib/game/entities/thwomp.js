ig.module(
    'game.entities.thwomp'
)
.requires(
    'impact.entity',
    'game.entities.dust-thwomp'
)
.defines(function() {

    EntityThwomp = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/thwomp.png', 24, 32),
        size: { x: 24, y: 32 },
        maxVel: { x: 0, y: 500 },
        friction: {x: 0, y: 0},
        
        health: 1000, 
        type: ig.Entity.TYPE.B, 
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.FIXED, 

        accelY: 500,     
        riseSpeed: 30,   
        detectDist: 60,
        
        // Temps d'attente "yeux ouverts" avant de tomber
        delayBeforeFall: 0.5, 
        
        gravityFactor: 0,
        state: 'idle', // idle, ready, falling, waiting, rising
        origY: 0,      

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.origY = y;

            this.addAnim('idle', 1, [0, 1]); // Cligne des yeux ?
            this.addAnim('ready', 1, [2]);   // Visage "Attention !"
            this.addAnim('fall', 0.1, [3, 4]);    // Visage "Chute"
            
            this.timer = new ig.Timer();
        },

        update: function() {
            if (!ig.game.player) return;

            var dist = Math.abs(ig.game.player.pos.x - (this.pos.x + this.size.x/2));

            // 1. IDLE (au plafond)
            if (this.state === 'idle') {
                this.currentAnim = this.anims.idle;
                this.vel.y = 0;
                this.pos.y = this.origY; 

                // Détection du joueur
                if (dist < this.detectDist && ig.game.player.pos.y > this.pos.y) {
                    this.state = 'ready'; // On passe en mode "Ready" d'abord
                    this.currentAnim = this.anims.ready;
                    this.timer.set(this.delayBeforeFall); // On lance le chrono
                }
            }
            
            // 2. READY (prêt à tomber)
            else if (this.state === 'ready') {
                this.vel.y = 0;
                this.pos.y = this.origY; // Reste fixé au plafond
                
                // Si le temps de préparation est fini, on tombe !
                if (this.timer.delta() > 0) {
                    this.state = 'falling';
                    this.currentAnim = this.anims.fall;
                    this.gravityFactor = 10; 
                }
            }
            
            // 3. FALLING (Chute)
            else if (this.state === 'falling') {
                // Géré par la physique
            }
            
            // 4. WAITING (Au sol)
            else if (this.state === 'waiting') {
                this.vel.y = 0;
                this.pos.y = Math.round(this.pos.y);
                
                if (this.timer.delta() > 1) {
                    this.state = 'rising';
                    this.gravityFactor = 0; 
                }
            }
            
            // 5. RISING (Remontée)
            else if (this.state === 'rising') {
                this.vel.y = -this.riseSpeed;
                this.currentAnim = this.anims.idle; // Retour au visage calme
                
                if (this.pos.y <= this.origY) {
                    this.pos.y = this.origY;
                    this.state = 'idle';
                    this.vel.y = 0;
                }
            }

            this.parent();
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            
            if (this.state === 'falling' && res.collision.y) {
                this.state = 'waiting';
                this.timer.reset();
                
                ig.game.sndImpact.play();
                ig.game.screen.shake = { x: 4, y: 4 }; 
                
                ig.game.spawnEntity(EntityDustThwomp, this.pos.x - 4, this.pos.y + this.size.y - 14);
            }
        },

        check: function(other) {
            if (other instanceof EntityPlayer) {
                if (other.pos.y > this.pos.y) {
                    other.receiveDamage(10, this);
                }
            }
        }
    });

});