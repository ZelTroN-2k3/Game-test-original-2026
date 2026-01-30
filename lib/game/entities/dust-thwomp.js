ig.module(
    'game.entities.dust-thwomp'
)
.requires(
    'impact.entity'
)
.defines(function() {

    EntityDustThwomp = ig.Entity.extend({
        _wmIgnore: true,
        // On utilise la nouvelle image
        animSheet: new ig.AnimationSheet('media/dust-thwomp.png', 32, 16),
        size: {x: 32, y: 16},
        
        gravityFactor: 0,
        collides: ig.Entity.COLLIDES.NEVER,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            
            // On suppose qu'il y a 4 frames d'animation
            this.addAnim('idle', 0.1, [0, 2, 4, 1, 3, 5, 6], true); // true = l'animation s'arrête et l'entité meurt
            this.idleTimer = new ig.Timer();
        },
        
        update: function() {
            this.parent();
            // Si l'animation a joué une fois, on supprime l'entité
            if (this.currentAnim.loopCount > 0) {
                this.kill();
            }
        }
    });

});