ig.module(
	'game.entities.checkpoint'
).requires(
	'impact.entity'
).defines(function() {

    EntityCheckpoint = ig.Entity.extend({
    
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0, 255, 0.7)',
        animSheet: new ig.AnimationSheet('media/checkpoint.png',22,56),

        size: {x: 16, y: 14},
        offset: {x: 6, y: 42},
        rdy: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('off', 0.1, [0]);
            this.addAnim('on', 0.2, [1, 2, 3, 2]);

        },        
        update: function() {
			this.currentAnim.update();
            if (this.rdy) {
				 this.currentAnim = this.anims.off;
                return;
            }
            if (ig.game.player) {
                if (ig.game.player.pos.x > this.pos.x) {
					this.currentAnim = this.anims.on;
                    ig.game.checkpoint = true;
                }
            }
        }
    });
});
