ig.module(
    'game.entities.level-block'
)
    .requires(
    'impact.entity'
)
    .defines(function () {
        EntityLevelBlock = ig.Entity.extend({
            _wmScalable: true,
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(255, 51, 236, 0.8)',

            size: {x: 32, y: 120},
            gravityFactor: 0,
            
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.FIXED
        });
    });
