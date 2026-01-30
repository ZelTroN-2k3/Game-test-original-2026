ig.module(
    'game.entities.item-flash'
)
.requires(
    'impact.entity'
)
.defines(function() {

    EntityItemFlash = ig.Entity.extend({
        _wmIgnore: true,

        size: {x: 8, y: 16},
        offset: {x: 4, y: 0},
        vel: {x: 0, y: -200},
        maxVel: {x: 100, y: 200},
        zIndex: -1,

        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/flash.png',16,16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 0.2, [0, 1]);
            ig.game.sortEntitiesDeferred();
        },
        
        check: function(other) {
            ig.gameState.item = 1;
            ig.game.spawnEntity(EntityPoints1000, this.pos.x + (this.size.x / 2), this.pos.y);
            ig.game.sndPickup.play();
            this.kill();
        }
    });
});