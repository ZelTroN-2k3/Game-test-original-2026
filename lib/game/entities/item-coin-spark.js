ig.module(
    'game.entities.item-coin-spark'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityItemCoinSpark = ig.Entity.extend({
        _wmIgnore: true,

        animSheet: new ig.AnimationSheet('media/coin-spark.png', 16, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 0.08, [0, 1, 2, 3], true);
        },
        
        update: function() {
            this.currentAnim.update();
            // Une fois que l'animation a bouclé une fois, on tue l'entité
            if (this.currentAnim.loopCount > 1) {
                this.kill();
            }
        }
    });
});