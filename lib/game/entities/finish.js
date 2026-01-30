ig.module(
    'game.entities.finish'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityFinish = ig.Entity.extend({
        _wmDrawBox: true,

        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
        _wmScalable: true,

        checkAgainst: ig.Entity.TYPE.A,

        check: function(other) {
            ig.game.spawnEntity(EntityPlayerGoal, other.pos.x, other.pos.y);
            other.kill();
        },

        update: function() {
        }
    });
});