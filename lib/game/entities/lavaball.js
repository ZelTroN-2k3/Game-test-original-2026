ig.module(
    'game.entities.lavaball'
)
.requires(
    'game.entities.enemy-jump'
)
.defines(function() {
    EntityLavaball = EntityEnemyJump.extend({
        _wmIgnore: false,

        size: {x: 12, y: 12},
        offset: {x: 2, y: 2},
        maxVel: {x: 100, y: 420},
        speed: -600,
        wait: 1.5,

        animSheet: new ig.AnimationSheet('media/lavaball.png', 16, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 0.1, [0, 1, 2]);
        },
        
        update: function() {
            this.parent();
            this.currentAnim.update();
            if (this.vel.y < 0) {
                this.currentAnim.flip.y = false; // swimming up
            } else {
                this.currentAnim.flip.y = true; // swimming down
            }
        }
    });
});