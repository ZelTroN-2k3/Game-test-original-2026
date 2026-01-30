ig.module(
    'game.entities.enemy-dead'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityEnemyDead = ig.Entity.extend({
        _wmIgnore: true,
        
        maxVel: {x: 100, y: 200},
        zIndex: -1,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.timer = new ig.Timer();
            ig.game.sndHit.play();
            ig.game.sortEntitiesDeferred();
            ig.game.spawnEntity(EntityPoints1000, this.pos.x + (this.size.x / 2), this.pos.y);
        },

        update: function () {
            this.parent();
            if (this.timer.delta() > 2) {
                this.kill();
            }
        }
    });
});