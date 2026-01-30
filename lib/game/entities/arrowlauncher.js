ig.module(
    'game.entities.arrowlauncher'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityArrowlauncher = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/arrowlauncher.png',16,16),
        wait: 2,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 1, [0]);
            this.timer = new ig.Timer();
        },

        update: function() {
            if (this.timer.delta() > this.wait) {
                if (this.pos.x + this.size.x > ig.game.screen.x || this.pos.x < ig.game.screen.x + ig.system.width) {
                    ig.game.spawnEntity(EntityArrow, this.pos.x + (this.size.x / 2), this.pos.y + (this.size.y / 2));
                    this.timer.reset();
                }
            }
        }
    });

    EntityArrow = ig.Entity.extend({
        _wmIgnore: true,

        offset: {x: 4, y: 2},
        size: {x: 8, y: 12},
        vel: {x: 0, y: 140},
        gravityFactor: 0,

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/arrow.png',16,16),

        init: function(x, y, settings) {
            this.parent(x - (this.size.x / 2), y - (this.size.y / 2), settings);
            this.addAnim('anim', 1, [0]);
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            if (res.collision.x || res.collision.y) {
                this.kill();
            }
        },

        check: function(other) {
            other.receiveDamage(10, this);
        },
        
        receiveDamage: function(amount, from) {}
    });
});