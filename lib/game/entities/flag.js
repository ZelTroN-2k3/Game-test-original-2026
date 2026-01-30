ig.module(
	'game.entities.flag'
)
.requires(
	'impact.entity', 
    'game.entities.player-goal'
)
.defines(function() {
    EntityFlag = ig.Entity.extend({
        size: {x: 8, y: 128}, // Un poteau haut et fin (8px large, 128px haut)
        offset: {x: 4, y: 0}, // Centrage

        _wmScalable: true,    // Permet d'étirer la hauteur dans Weltmeister
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 173, 51, 0.8)',  

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A, // Vérifie le joueur
        collides: ig.Entity.COLLIDES.PASSIVE, // Le joueur passe "devant"

        flagEntity: null, // Variable pour stocker le drapeau
        flagImage: new ig.Image('media/flag-icon.png'),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            // Au démarrage, on fait apparaître le morceau de drapeau tout en haut du poteau
            if (!ig.global.wm) { // Seulement en jeu, pas dans l'éditeur
                this.flagEntity = ig.game.spawnEntity(EntityFlagPart, this.pos.x + 6, this.pos.y);
            }
        },

        draw: function() {
            this.parent(); // Dessine la boîte du poteau (ou rien si invisible)

            if (ig.global.wm) {
                // On soustrait ig.game.screen.x et y
                // pour que l'image reste collée au poteau quand on bouge la caméra dans l'éditeur.
                var x = this.pos.x - ig.game.screen.x + 6;
                var y = this.pos.y - ig.game.screen.y;
                
                this.flagImage.drawTile(x, y, 0, 16, 16);
            }
        },

        check: function(other) {
            if (other instanceof EntityPlayerGoal) return;

            if (this.flagEntity) {
                this.flagEntity.trigger();
            }

            ig.game.spawnEntity(EntityPoints1000, this.pos.x, other.pos.y); // Affiche 1000 points
            ig.game.spawnEntity(EntityPlayerGoal, this.pos.x, other.pos.y); // Transforme le joueur en EntityPlayerGoal
            other.kill();
        },

        update: function() {}
    });

    EntityFlagPart = ig.Entity.extend({
        size: {x: 16, y: 16},
        offset: {x: 0, y: 0},
        gravityFactor: 0, 
        collides: ig.Entity.COLLIDES.LITE, 
        
        animSheet: new ig.AnimationSheet('media/flag-icon.png', 16, 16), 

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('off', 1, [0]);
            this.addAnim('on', 0.2, [1, 2, 3, 2]);
            this.currentAnim = this.anims.off;
        },

        trigger: function() {
            this.vel.y = 200; // Commence à descendre
            this.currentAnim = this.anims.on;
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            
            if (res.collision.y) {
                this.vel.y = 0;
                // Optionnel : Vous pouvez remettre 'off' ici si vous voulez qu'il s'arrête de bouger
                // this.currentAnim = this.anims.off; 
            }
        }
    });

});