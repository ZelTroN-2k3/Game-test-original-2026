
/*
* Ajoutez une nouvelle clé/valeur dans les "Entity Settings" :
*   Key : flipY
*   Value : true
*/
ig.module(
    'game.entities.piranha'
)
.requires(
    'impact.entity'
)
.defines(function() {

    EntityPiranha = ig.Entity.extend({
        size: {x: 14, y: 28},
        offset: {x: 1, y: 4}, 
        
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE, 

        animSheet: new ig.AnimationSheet('media/piranha.png', 16, 32),
        
        gravityFactor: 0, 
        speed: 20,       
        
        origY: 0,
        maxY: 0,
        timer: null,
        state: 'hidden',
        
        safeDistance: 32, 
        flipY: false, // Propriété à cocher dans Weltmeister

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            
            this.origY = y;
            this.timer = new ig.Timer();
            this.zIndex = -1; 
            
            this.addAnim('chomp', 0.2, [0, 1]); 

            // --- GESTION DU FLIP (PLAFOND) ---
            if (this.flipY) {
                // 1. Correction de l'offset pour que la collision colle à l'image retournée
                this.offset.y = 0; 
                
                // 2. Limite vers le BAS (Plafond -> Descend)
                this.maxY = y + this.size.y + 2; 
            } else {
                // Limite vers le HAUT (Sol -> Monte)
                this.maxY = y - this.size.y - 2; 
            }
        },

        update: function() {
            // On applique le flip vertical à l'animation courante
            this.currentAnim.flip.y = this.flipY;
            // -------------------------------

            if (!ig.game.player) return;

            // 1. CACHÉE
            if (this.state === 'hidden') {
                this.vel.y = 0;
                this.pos.y = this.origY; 

                if (this.timer.delta() > 2) {
                    var dist = Math.abs(ig.game.player.pos.x - this.pos.x);
                    
                    if (dist > this.safeDistance) {
                        this.state = 'rising'; 
                    } else {
                        this.timer.set(0.5); 
                    }
                }
            }

            // 2. SORTIE
            else if (this.state === 'rising') {
                // Si FlipY, on descend (+). Sinon on monte (-).
                this.vel.y = (this.flipY ? this.speed : -this.speed);
                
                var arrived = false;
                if (this.flipY) {
                    if (this.pos.y >= this.maxY) arrived = true; 
                } else {
                    if (this.pos.y <= this.maxY) arrived = true; 
                }

                if (arrived) {
                    this.pos.y = this.maxY;
                    this.state = 'waiting';
                    this.timer.reset();
                }
            }

            // 3. ATTENTE
            else if (this.state === 'waiting') {
                this.vel.y = 0;
                if (this.timer.delta() > 2) {
                    this.state = 'lowering';
                }
            }

            // 4. RENTRÉE
            else if (this.state === 'lowering') {
                // Inverse de la sortie
                this.vel.y = (this.flipY ? -this.speed : this.speed);
                
                var backHome = false;
                if (this.flipY) {
                    if (this.pos.y <= this.origY) backHome = true; 
                } else {
                    if (this.pos.y >= this.origY) backHome = true; 
                }

                if (backHome) {
                    this.pos.y = this.origY;
                    this.state = 'hidden';
                    this.timer.reset(); 
                }
            }

            this.parent();
        },

        check: function(other) {
            other.receiveDamage(10, this);
        }
    });
});