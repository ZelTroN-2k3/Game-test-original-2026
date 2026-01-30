ig.module(
    'game.entities.target'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityTarget = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 255, 0, 0.7)',
        _wmScalable: true,

        update: function() {
            // Targets don't do anything in-game
        }
    });
});