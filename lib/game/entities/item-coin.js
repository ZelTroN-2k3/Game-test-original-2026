ig.module(
    'game.entities.item-coin'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityItemCoin = ig.Entity.extend({
        _wmIgnore: true,

        vel: {x: 0, y: -200},
        maxVel: {x: 100, y: 200},
        zIndex: -1,

        animSheet: new ig.AnimationSheet('media/coin.png',16,16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 0.2, [0, 1, 2]);
            ig.game.sortEntitiesDeferred();
        },

        handleMovementTrace: function(res) {
            if (res.collision.y && this.vel.y > 0) {
                ig.game.spawnEntity(EntityItemCoinSpark, this.pos.x, this.pos.y);
                ig.game.spawnEntity(EntityPoints100, this.pos.x + (this.size.x / 2), this.pos.y);
                ig.game.addCoin();
                ig.game.sndCoin.play();
                this.kill();
            }
            this.parent(res);
        }
    });
});