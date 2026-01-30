ig.module(
    'game.entities.fish'
)
.requires(
    'game.entities.enemy-jump'
)
.defines(function() {
    EntityFish = EntityEnemyJump.extend({
        _wmIgnore: false,

        size: {x: 8, y: 12},
        offset: {x: 4, y: 2},
        maxVel: {x: 100, y: 480},

        speed: -600,
        wait: 1.5,

        animSheet: new ig.AnimationSheet('media/fish.png', 16, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim1', 1, [0]);
            this.addAnim('anim2', 1, [1]);
        },

        update: function() {
            this.parent();
            if (this.vel.y < 0) {
                this.currentAnim = this.anims.anim1; // swimming up
            } else {
                this.currentAnim = this.anims.anim2; // swimming down
            }
        }
    });
});