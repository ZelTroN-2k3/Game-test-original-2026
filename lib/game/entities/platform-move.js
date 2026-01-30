ig.module(
    'game.entities.platform-move'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityPlatformMove = ig.Entity.extend({
        size: {x: 32, y: 8},
        maxVel: {x: 100, y: 100},

        gravityFactor: 0,
        speed: 20,
        target: null,
        targets: [],
        currentTarget: 0,

        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.FIXED,

        animSheet: new ig.AnimationSheet('media/platform-big.png', 32, 8),

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim1', 1, [0]); 
            this.addAnim('anim2', 1, [1]); 
            this.addAnim('anim3', 1, [2]); 
            this.targets = ig.ksort(this.target);
        },

        ready: function () {
            this.parent();
            switch (ig.game.levelNumber()) {
                case 2: this.currentAnim = this.anims.anim2; break; 
                case 4: this.currentAnim = this.anims.anim3; break; 
                default: this.currentAnim = this.anims.anim1; break; 
            }
        },
        
        update: function () {
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

        collideWith: function (other, axis) {
            if (other instanceof EntityPlayer) {
                if (axis === 'y' && other.pos.y < this.pos.y) {
                    other.platform = true;
                    other.vel.y = ig.game.gravity / 8;
                }
            }
        }
    });
});