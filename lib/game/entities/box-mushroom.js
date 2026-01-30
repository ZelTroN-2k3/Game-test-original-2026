ig.module(
    'game.entities.box-mushroom'
)
.requires(
    'game.entities.box'
)
.defines(function() {
    EntityBoxMushroom = EntityBox.extend({
        item: 4, // mushroom

        // Override to set specific item properties if needed
    });
});