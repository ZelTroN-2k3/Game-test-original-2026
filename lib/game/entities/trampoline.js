/*
* Placez l'entité EntityTrampoline.
*
*   Ajoutez une Key: color Value: red, blue, green ou yellow.
*   (Optionnel) Ajoutez une Key: jumpForce Value: mettez 600 pour un super saut, ou 300 pour un petit saut.
*   (Optionnel) Ajoutez une Key: target et speed si vous voulez que le trampoline bouge (comme une plateforme mobile).
*/
ig.module(
	'game.entities.trampoline'
)
.requires(
	'impact.entity'
)
.defines(function() {
    EntityTrampoline = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0, 50, 0.5)',
        
        animSheet: new ig.AnimationSheet('media/trampolinePlatform.png', 16, 16),         
        
        size: {x: 16, y: 16},
        offset: {x: 0, y: 0},
        
        // La plateforme est fixe (comme un mur)
        collides: ig.Entity.COLLIDES.FIXED,
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.BOTH, // Vérifie Joueur ET Ennemis

        // Paramètres configurables dans Weltmeister
        target: null,
        targets: [],
        currentTarget: 0,
        speed: 0,
        gravityFactor: 0,
        
        // Force du rebond (modifiable dans l'éditeur !)
        jumpForce: 400, 
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            
            // Gestion des couleurs
            switch (this.color) {
                case 'green':
                    this.addAnim('idle', 1, [0]);
                    this.addAnim('launch', 0.05, [1, 2]);
                    break;
                case 'blue':
                    this.addAnim('idle', 1, [3]);
                    this.addAnim('launch', 0.05, [4, 5]);
                    break;
                case 'yellow':
                    this.addAnim('idle', 1, [6]);
                    this.addAnim('launch', 0.05, [7, 8]);             
                    break;
                case 'red':
                    this.addAnim('idle', 1, [9]);
                    this.addAnim('launch', 0.05, [10, 11]); 
                    break;
				default:
                    this.addAnim('idle', 1, [12]);
                    this.addAnim('launch', 0.05, [13, 14]);
            }
            
            // Animation par défaut
            this.currentAnim = this.anims.idle;

            // Gestion du mouvement (si target est défini)
            if (this.target) {
                this.targets = ig.ksort(this.target);
            }
        },
        
        update: function() {
            // Remet l'animation idle si l'animation launch est finie
            if (this.currentAnim == this.anims.launch && this.currentAnim.loopCount > 0) {
                this.currentAnim = this.anims.idle;
            }

            // --- Logique de plateforme mobile (Votre code existant) ---
            if (this.target) {
                var oldDistance = 0;
                var target = ig.game.getEntityByName(this.targets[this.currentTarget]);
                
                if (target) {
                    oldDistance = this.distanceTo(target);
                    var angle = this.angleTo(target);
                    this.vel.x = Math.cos(angle) * this.speed;
                    this.vel.y = Math.sin(angle) * this.speed;
                } else {
                    this.vel.x = 0;
                    this.vel.y = 0;
                }
                
                var newDistance = this.distanceTo(target);
                if (target && (newDistance > oldDistance || newDistance < 0.5)) {
                    this.pos.x = target.pos.x + target.size.x / 2 - this.size.x / 2;
                    this.pos.y = target.pos.y + target.size.y / 2 - this.size.y / 2;
                    this.currentTarget++;
                    if (this.currentTarget >= this.targets.length && this.targets.length > 1) {
                        this.currentTarget = 0;
                    }
                }
            }
            
            this.parent();
        },
        
        // --- C'est ici que la magie opère ---
        collideWith: function(other, axis) {
            // 1. Si la collision vient du haut (axis Y)
            // 2. Et que l'autre entité est au-dessus du trampoline
            if (axis == 'y' && other.pos.y < this.pos.y) {
                
                // On propulse l'entité vers le haut
                other.vel.y = -this.jumpForce;
                
                // On joue l'animation
                this.currentAnim = this.anims.launch.rewind();
                
                // On joue le son (seulement si le son est activé)
                if (ig.Sound.enabled) {
                    ig.game.sndBounce.play();
                }
            }
        }
    });
});