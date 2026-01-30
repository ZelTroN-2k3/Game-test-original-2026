ig.module(
    'game.entities.platform-drop'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityPlatformDrop = ig.Entity.extend({
        size: {x: 32, y: 8},
        maxVel: {x: 0, y: 500}, // Vitesse max élevée pour ne pas la brider

        gravityFactor: 0,
        rdy: false,
        falling: false, 
        
        dropDelay: 0.8, 

        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.FIXED,

        animSheet: new ig.AnimationSheet('media/platform-big.png', 32, 8),
        
        origPos: {x: 0, y: 0}, 

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.origPos = {x: x, y: y};
            
            this.addAnim('anim1', 1, [0]);
            this.addAnim('anim2', 1, [1]); 
            this.addAnim('anim3', 1, [2]); 
            this.timer = new ig.Timer();
        },

        ready: function () {
            this.parent();
            switch (ig.game.levelNumber()) {
                case 2: this.currentAnim = this.anims.anim2; break;
                case 4: this.currentAnim = this.anims.anim3; break;
                default: this.currentAnim = this.anims.anim1; break;
            }
        },

        update: function () {
            // --- LOGIQUE DE DÉCLENCHEMENT ---
            if (this.rdy && !this.falling) {
                // Si le temps d'attente est écoulé
                if (this.timer.delta() >= 0) {
                    this.falling = true;
                    this.pos.x = this.origPos.x; // Réalignement strict
                    
                    this.vel.y = 150; 
                    this.gravityFactor = 1; 
                    
                    // On la rend PASSIVE pour ne plus gêner le joueur
                    this.collides = ig.Entity.COLLIDES.PASSIVE;
                }
            }

            // --- LOGIQUE DE MOUVEMENT ---
            if (this.falling) {
                // CAS SPÉCIAL : CHUTE LIBRE (Fantôme)
                // On applique la gravité manuellement
                this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;
                
                // On applique le déplacement manuellement SANS vérifier la map
                this.pos.y += this.vel.y * ig.system.tick;

                // IMPORTANT : Il faut mettre à jour l'animation manuellement
                // car on n'appelle pas this.parent() ici
                if( this.currentAnim ) {
                    this.currentAnim.update();
                }
            } 
            else {
                // CAS NORMAL : La plateforme est fixe ou tremble
                // On laisse le moteur gérer la physique (collisions murs, etc.)
                this.parent();
            }

            // --- DESTRUCTION ---
            if (this.pos.y > ig.game.screen.y + ig.system.height + 64) {
                this.kill();
            }
        },
        
        draw: function() {
            var restoreX = this.pos.x; 

            // Tremblement visuel (Uniquement si activé et pas encore tombé)
            if (this.rdy && !this.falling) {
                var shake = (Math.random() > 0.5 ? 1 : -1);
                this.pos.x += shake;
            }

            this.parent();

            this.pos.x = restoreX;
        },

        collideWith: function (other, axis) {
            if (other instanceof EntityPlayer) {
                if (axis === 'y' && other.pos.y < this.pos.y) {
                    if (!this.rdy) {
                        this.rdy = true;
                        this.timer.set(this.dropDelay); 
                    }
                }
            }
        }
    });
});