ig.module(
    'game.entities.fireball'
)
.requires(
    'impact.entity'
)
.defines(function() {

    EntityFireball = ig.Entity.extend({
        _wmIgnore: true,

        size: {x: 8, y: 8},
        offset: {x: 4, y: 4},
        maxVel: {x: 120, y: 160},

        bounciness: 1,
        bounceCounter: 0,

        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        animSheet: new ig.AnimationSheet('media/fireball.png',16,16),

        init: function(x, y, settings) {
            this.parent(x - (this.size.x / 2), y, settings);
            this.addAnim('anim', 0.1, [0, 1]);
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = this.maxVel.y;
        },

        update: function() {
            this.parent();
            if (this.pos.y > ig.game.screen.y + ig.system.height) {
                this.kill();
            }
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            if (res.collision.x) {
                this.kill();
            }
            if (res.collision.y) {
                this.bounceCounter++;
                if (this.bounceCounter > 2) {
                    this.kill();
                }
            }
        },

        kill: function(other) {
            ig.game.spawnEntity(EntityFireballSpark, this.pos.x, this.pos.y);
            this.parent();
        },
        check: function(other) {
            other.receiveDamage(10, this);
            this.kill();
        }
    });


    EntityFireballSpark = ig.Entity.extend({
        _wmIgnore: true,

        size: {x: 8, y: 8},
        offset: {x: 4, y: 4},

        animSheet: new ig.AnimationSheet('media/fireball-spark.png', 16, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 1, [0]);
            this.timer = new ig.Timer();
        },
        
        update: function() {
            if (this.timer.delta() > 0.1) {
                this.kill();
            }
        }
    });
});