ig.module(
    'game.entities.ball'
)
.requires(
    'game.entities.enemy-jump'
)
.defines(function() {
    EntityBall = EntityEnemyJump.extend({
        _wmIgnore: false,

        size: {x: 14, y: 14},
        offset: {x: 1, y: 2},
        maxVel: {x: 100, y: 280},

        speed: -280,
        wait: 1,

        animSheet: new ig.AnimationSheet('media/ball.png', 16, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim1', 1, [0]);
            this.addAnim('anim2', 1, [1]);
        },
        
        update: function() {
            this.parent();
            this.currentAnim = this.anims.anim1;
            if (this.pos.y == this.ypos) {
                this.currentAnim = this.anims.anim2;
            }
        }
    });
});