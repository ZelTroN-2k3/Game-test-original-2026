ig.module(
    'game.entities.item-feather'
)
.requires(
    'impact.entity'
)
.defines(function() {

    EntityItemFeather = ig.Entity.extend({
        _wmIgnore: true,

        size: {x: 12, y: 12},
        offset: {x: 2, y: 4},
        vel: {x: 0, y: -200},
        maxVel: {x: 100, y: 200},
        zIndex: -1,
        
        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/feather.png',16,16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 1, [0]);
            ig.game.sortEntitiesDeferred();
        },
        
        check: function(other) {
            ig.gameState.item = 2;
            ig.game.spawnEntity(EntityPoints1000, this.pos.x + (this.size.x / 2), this.pos.y);
            ig.game.sndPickup.play();
            this.kill();
        }
    });
});