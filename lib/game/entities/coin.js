ig.module(
	'game.entities.coin'
)
.requires(
	'impact.entity'
)
.defines(function() {

    EntityCoin = ig.Entity.extend({
       
        animSheet: new ig.AnimationSheet('media/coin.png',16,16),
        
        zIndex: -1,
        checkAgainst: ig.Entity.TYPE.A,
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 0.1, [0, 1, 2, 3]);
        },
        
        update: function() {
            this.currentAnim.update();
        },
        
        check: function(other) {
            // On fait apparaitre l'étincelle, comme pour item-coin.js
            ig.game.spawnEntity(EntityItemCoinSpark, this.pos.x, this.pos.y);

            ig.game.spawnEntity(EntityPoints100, this.pos.x + (this.size.x / 2), this.pos.y);
            ig.game.addCoin();
            ig.game.sndCoin.play();
            this.kill();
        }
    });
});