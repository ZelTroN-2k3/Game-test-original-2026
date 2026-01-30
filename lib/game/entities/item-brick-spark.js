ig.module(
    'game.entities.item-brick-spark'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityItemBrickSpark = ig.Entity.extend({
        _wmIgnore: true,

        animSheet: new ig.AnimationSheet('media/brick-spark.png', 16, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 0.08, [0, 1, 2, 3, 4, 5], true);
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