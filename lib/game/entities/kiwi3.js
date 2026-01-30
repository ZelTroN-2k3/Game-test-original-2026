ig.module(
    'game.entities.kiwi3'
)
    .requires(
        'game.entities.enemy-walk'
    )
    .defines(function () {

        EntityKiwi3 = EntityEnemyWalk.extend({
            _wmIgnore: false,

            animSheet: new ig.AnimationSheet('media/kiwi3.png', 16, 16),
            offset: { x: 2, y: 4 },
            size: { x: 12, y: 12 },

            distanceToFollow: 55,
            doNotFollow: false,  
                      
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.dead = EntityKiwi3Dead;
            }
        });

        EntityKiwi3Dead = EntityEnemyDeathSmoke.extend({
            //animSheet: new ig.AnimationSheet('media/kiwi3.png', 16, 16),
            offset: { x: 4, y: 8 },
            size: { x: 8, y: 8 },
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                //this.addAnim('anim', 1, [2]);
            }
        });
    });