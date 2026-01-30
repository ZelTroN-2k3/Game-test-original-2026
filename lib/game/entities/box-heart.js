ig.module(
    'game.entities.box-heart'
)
.requires(
    'game.entities.box'
)
.defines(function() {
    EntityBoxHeart = EntityBox.extend({
        item: 3, // heart

        // Override to set specific item properties if needed
    });
});