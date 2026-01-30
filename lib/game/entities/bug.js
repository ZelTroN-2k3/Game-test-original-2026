ig.module(
    'game.entities.bug'
)
    .requires(
        'game.entities.enemy-walk',
        'game.entities.enemy-dead'
    )
    .defines(function () {

        EntityBug = EntityEnemyWalk.extend({
            _wmIgnore: false,
            animSheet: new ig.AnimationSheet('media/bug.png', 16, 16),
            offset: { x: 2, y: 8 },
            size: { x: 12, y: 8 },

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('walk', 0.2, [0, 1]);
                this.dead = EntityBugDead;
            }
        });


        EntityBugDead = EntityEnemyDead.extend({
            animSheet: new ig.AnimationSheet('media/bug.png', 16, 16),
            offset: { x: 2, y: 8 },
            size: { x: 12, y: 8 },

            init: function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('anim', 1, [2]);
            }
        });
    });