ig.module(
    'game.entities.kiwi'
)
    .requires(
        'game.entities.enemy-walk'
    )
    .defines(function () {

        EntityKiwi = EntityEnemyWalk.extend({
            _wmIgnore: false,

            animSheet: new ig.AnimationSheet('media/kiwi.png', 16, 16),
            offset: { x: 2, y: 4 },
            size: { x: 12, y: 12 },

            distanceToFollow: 55,
            doNotFollow: false,

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.dead = EntityKiwiDead;
            }
        });

        EntityKiwiDead = EntityEnemyDeathSmoke.extend({
            //animSheet: new ig.AnimationSheet('media/kiwi.png', 16, 16),
            offset: { x: 2, y: 4 },
            size: { x: 12, y: 12 },
            init: function (x, y, settings) {
                this.parent(x, y, settings);
                //this.addAnim('anim', 1, [2]);
            }
        });
    });