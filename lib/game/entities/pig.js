ig.module(
    'game.entities.pig'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityPig = ig.Entity.extend({
        size: {x: 16, y: 28},
        offset: {x: 8, y: 4},
        maxVel: {x: 30, y: 240},

        dist: 48,
        position: 0,

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,

        animSheet: new ig.AnimationSheet('media/pig.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('walk', 0.1, [0, 1, 2]); // marche
            this.addAnim('fire', 0.1, [3, 4, 5]); // lance des boules de feu
            this.startx = this.pos.x;
        },

        update: function() {
            if (this.position === 0) {
                if (this.pos.x > this.startx - this.dist) {
                    this.vel.x = -this.maxVel.x;
                } else {
                    this.fire();
                    this.position = 1;
                }
            } else if (this.position == 1) {
                if (this.pos.x < this.startx) {
                    this.vel.x = this.maxVel.x;
                } else {
                    this.vel.y = -this.maxVel.y;
                    this.position = 2;
                }
            } else if (this.position == 2) {
                if (this.pos.x > this.startx - this.dist) {
                    this.vel.x = -this.maxVel.x;
                } else {
                    this.fire();
                    this.position = 3;
                }
            } else if (this.position == 3) {
                if (this.pos.x < this.startx) {
                    this.vel.x = this.maxVel.x;
                } else {
                    this.fire();
                    this.position = 0;
                }
            }
            if (this.currentAnim == this.anims.fire && this.currentAnim.loopCount > 2) {
                this.currentAnim = this.anims.walk;
            }
            if (ig.game.player.pos.x > this.pos.x + 16) {
                ig.game.addScore(1000);
                ig.game.spawnEntity(EntityPoints1up, this.pos.x + (this.size.x / 2), this.pos.y);
                ig.game.spawnEntity(EntityPigDead, this.pos.x, this.pos.y);
                this.kill();
            }
            this.parent();
        },

        fire: function() {
            this.currentAnim = this.anims.fire.rewind();
            ig.game.spawnEntity(EntityFireball, this.pos.x + 4, this.pos.y + 8, {
                flip: true,
                checkAgainst: ig.Entity.TYPE.A
            });
        },

        receiveDamage: function(amount, from) {
        },

        check: function(other) {
            other.receiveDamage(10, this);
        }
    });


    EntityPigDead = ig.Entity.extend({
        _wmIgnore: true,

        size: {x: 16, y: 28},
        offset: {x: 8, y: 4},
        maxVel: {x: 0, y: 200},
        vel: {x: 0, y: -200},

        animSheet: new ig.AnimationSheet('media/pig.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('walk', 0.1, [0, 1, 2]);
            this.currentAnim.flip.y = true;
        },

        update: function() {
            this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;
            this.vel.y = this.getNewVelocity(this.vel.y, this.accel.y, this.friction.y, this.maxVel.y);
            this.pos.y += this.vel.y * ig.system.tick;
            this.currentAnim.update();
            if (this.pos.y > ig.game.screen.y + ig.system.height) {
                this.kill();
            }
        }
    });
});