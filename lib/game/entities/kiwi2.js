ig.module(
    'game.entities.kiwi2'
)
    .requires(
        'game.entities.enemy-walk'
    )
    .defines(function () {

        EntityKiwi2 = EntityEnemyWalk.extend({
            _wmIgnore: false,

            animSheet: new ig.AnimationSheet('media/kiwi2.png', 16, 16),
            offset: { x: 4, y: 8 },
            size: { x: 8, y: 8 },

            distanceToFollow: 55,
            doNotFollow: false,  
                      
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.dead = EntityKiwi2Dead;
            }
        });

        EntityKiwi2Dead = EntityEnemyDeathSmoke.extend({
            //animSheet: new ig.AnimationSheet('media/kiwi2.png', 16, 16),
            offset: { x: 4, y: 8 },
            size: { x: 8, y: 8 },
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                //this.addAnim('anim', 1, [2]);
            }
        });
    });