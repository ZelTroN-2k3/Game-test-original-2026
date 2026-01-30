ig.module(
    'game.entities.enemy-death-smoke'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityEnemyDeathSmoke = ig.Entity.extend({
        _wmIgnore: true,

        lifetime: 0.4,

        animSheet: new ig.AnimationSheet('media/smoke.png', 16, 16),
        
        size: {x: 16, y: 16},
        offset: {x: 0, y: 4},
        gravityFactor: 0,
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.idleTimer = new ig.Timer();
            this.addAnim('smoke', 0.05, [0, 1, 2, 3, 4, 5, 6, 7, 8], true);
            ig.game.sndHit.play();
            ig.game.sortEntitiesDeferred();
            ig.game.spawnEntity(EntityPoints1000, this.pos.x + (this.size.x / 2), this.pos.y);                
        },
        
        reset: function(x, y, settings) {
            this.parent(x, y, settings);
            this.idleTimer = new ig.Timer();
            this.currentAnim = this.anims.smoke.rewind();
            ig.game.sndHit.play();
        },
        
        update: function() {
            if (this.idleTimer.delta() > this.lifetime) {
                this.kill();
            }
            this.parent();
        }
    });  
});