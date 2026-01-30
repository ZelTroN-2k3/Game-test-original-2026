ig.module(
    'game.entities.enemy-jump'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityEnemyJump = ig.Entity.extend({
        _wmIgnore: true,

        gravityFactor: 0,
        jump: false,
        wait: 0,

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.timer = new ig.Timer();
            this.ypos = y;
        },

        update: function() {
            if (this.jump) {
                this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;
                this.vel.y = this.getNewVelocity(this.vel.y, this.accel.y, this.friction.y, this.maxVel.y);
                this.pos.y += this.vel.y * ig.system.tick;
                if (this.pos.y > this.ypos) {
                    this.pos.y = this.ypos;
                    this.gravityFactor = 0;
                    this.jump = false;
                    this.timer.reset();
                    this.vel.y = 0;
                }
            } else if (this.timer.delta() > this.wait) {
                this.gravityFactor = 1;
                this.jump = true;
                this.timer.reset();
                this.vel.y = this.speed;
            }
        },

        check: function(other) {
            other.receiveDamage(10, this);
        },
        
        receiveDamage: function(amount, from) {}
    });
});