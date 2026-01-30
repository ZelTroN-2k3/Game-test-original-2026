ig.module(
    'game.entities.dust'
)

.requires(
    'impact.entity', 
    'impact.entity-pool'
)

.defines(function() {
    EntityDust = ig.Entity.extend({
        _wmIgnore: true,

        animSheet: new ig.AnimationSheet('media/dust.png', 16, 16),

        size: {x: 16, y: 16},
        gravityFactor: 0,
        
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NEVER,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.1, [0, 1, 2, 3], true);
            this.idleTimer = new ig.Timer();
        },
        
        reset: function(x, y, settings) {
            this.parent(x, y, settings);
            this.currentAnim = this.anims.idle.rewind();
            this.idleTimer = new ig.Timer();
        },
        
        update: function() {
            if (this.idleTimer.delta() > 1) {
                this.kill();
            }
            this.parent();
        }
    });
    ig.EntityPool.enableFor(EntityDust);
});
