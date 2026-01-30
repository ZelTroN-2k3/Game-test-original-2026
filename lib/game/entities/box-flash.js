ig.module(
    'game.entities.box-flash'
)
.requires(
    'game.entities.box'
)
.defines(function() {
    EntityBoxFlash = EntityBox.extend({
        item: 1, // flash

        // Override to set specific item properties if needed
    });
});