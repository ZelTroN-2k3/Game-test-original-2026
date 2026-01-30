ig.module(
    'game.entities.bee'
)
.requires(
    'game.entities.enemy-walk'
)
.defines(function() {
    EntityBee = ig.Entity.extend({
        size: {x: 12, y: 8},
        offset: {x: 2, y: 4},

        gravityFactor: 0,
        speed: 40,
        flip: false,
        target: null,
        targets: [],
        currentTarget: 0,

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,

        animSheet: new ig.AnimationSheet('media/bee.png', 16, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 0.1, [0, 1]);
            this.targets = ig.ksort(this.target);
        },

        update: function() {
            if (this.targets.length == 0) {
                this.parent();
                return;
            }
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
            this.flip = (this.vel.x > 1 ? true : false);
            this.currentAnim.flip.x = this.flip;
            this.parent();
            var newDistance = this.distanceTo(target);
            if (target && (newDistance > oldDistance || newDistance < 0.5)) {
                this.pos.x = target.pos.x + target.size.x / 2 - this.size.x / 2;
                this.pos.y = target.pos.y + target.size.y / 2 - this.size.y / 2;
                this.currentTarget++;
                if (this.currentTarget >= this.targets.length && this.targets.length > 1) {
                    this.currentTarget = 0;
                }
            }
        },

        kill: function() {
            ig.game.spawnEntity(EntityBeeDead, this.pos.x, this.pos.y, {
                flip: this.flip
            });
            this.parent();
        },

        check: function(other) {
            if (other.pos.y + (other.size.y / 2) < this.pos.y && other.vel.y > 0) {
                if (ig.input.state('jump')) {
                    other.vel.y = -other.jump;
                } else {
                    other.vel.y = -(other.jump / 2);
                }
                this.kill();
            } else {
                other.receiveDamage(10, this);
            }
        }
    });
    
    EntityBeeDead = EntityEnemyDeathSmoke.extend({
        //animSheet: new ig.AnimationSheet('media/bee.png', 16, 16),
        offset: { x: 2, y: 4 },
        size: { x: 12, y: 12 },
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            //this.addAnim('anim', 1, [1]);
            //this.currentAnim.flip.x = this.flip;
        }
    });
});