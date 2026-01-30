ig.module(
	'game.entities.player-dead'
)
.requires(
	'impact.entity'
)
.defines(function() {
    EntityPlayerDead = ig.Entity.extend({
        _wmIgnore: true,
        
        size: {x: 8, y: 14},
        offset: {x: 4, y: 2},
        vel: {x: 0, y: -300},
        maxVel: {x: 100, y: 300},
        
        animSheet: new ig.AnimationSheet('media/player.png', 16, 16),
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.setupAnimation(ig.gameState.skin);
            ig.music.stop();
            ig.game.sndFail.play();
            this.timer = new ig.Timer();
        },

        setupAnimation: function(offset) {
            offset = offset * 42;
            this.addAnim('dead', 1, [10 + offset]); // dead frame
        },

        update: function() {
            this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;
            this.vel.y = this.getNewVelocity(this.vel.y, this.accel.y, this.friction.y, this.maxVel.y);
            this.pos.y += this.vel.y * ig.system.tick;
            if (this.timer.delta() > 3 && (this.pos.y > ig.game.screen.y + ig.system.height)) {
                if (ig.gameState.lives > 0) {
                    ig.game.loadLevelDeferred(ig.game.currentLevel);
                } else {
                    ig.system.setGame(GameOverScreen);
                }
            }
        }
    });   
});