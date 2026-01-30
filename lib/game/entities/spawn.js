ig.module(
	'game.entities.spawn'
)
.requires(
	'impact.entity'
)
.defines(function() {

    EntitySpawn = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0, 255, 0.7)',

        size: {x: 8, y: 14},
        offset: {x: 4, y: 2},
        
        update: function() {
            // Spawns don't do anything in-game
        }
    });
});