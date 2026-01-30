ig.module(
	'game.entities.item-mushroom'
)
.requires(
	'game.entities.item-heart'
)
.defines(function() {
    EntityItemMushroom = EntityItemHeart.extend({
        
        animSheet: new ig.AnimationSheet('media/mushroom.png', 16, 16),
        
        check: function(other) {
            other.receiveDamage(10, this);
            this.kill();
        }
    });
});