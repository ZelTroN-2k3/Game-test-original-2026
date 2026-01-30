ig.module(
	'game.entities.player-goal'
)
.requires(
	'impact.entity'
)
.defines(function() {
    EntityPlayerGoal = ig.Entity.extend({
        _wmIgnore: true,

        size: {x: 8, y: 14},
        offset: {x: 4, y: 2},
        maxVel: {x: 40, y: 200}, // Augmentation vitesse de chute
        gravityFactor: 1, // On s'assure que la gravité est active
        
        animSheet: new ig.AnimationSheet('media/player.png', 16, 16),
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.setupAnimation(ig.gameState.skin);
            // On commence par glisser (le joueur est spawn sur le poteau)
            this.currentAnim = this.anims.slide;
            
            ig.music.stop();
            ig.game.sndWin.play();
            this.timer = new ig.Timer();
        },

        setupAnimation: function(offset) {
            offset = offset * 42;
                this.addAnim('slide', 1, [19 + offset]); // Animation glissade
                this.addAnim('run', 0.07, [12 + offset, 13 + offset, 14 + offset, 15 + offset, 16 + offset, 17 + offset]); // Animation course
        },

        update: function() {
            this.parent();
            // Condition de victoire : timer > 3 ET (sortie écran droite OU sortie écran bas)
            if (this.timer.delta() > 3 && (this.pos.y > ig.game.screen.y + ig.system.height || this.pos.x > ig.game.screen.x + ig.system.width)) {
                ig.game.nextLevel();
            }
        },
        
        handleMovementTrace: function(res) {
            this.parent(res);
            
            // Dès qu'on touche le sol (res.collision.y), on court !
            if (res.collision.y) {
                this.vel.x = 40; // On avance vers la droite
                this.currentAnim = this.anims.run;
            }
        }
    });
});