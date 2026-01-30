ig.module(
    'game.entities.box-feather'
)
.requires(
    'game.entities.box'
)
.defines(function() {
    EntityBoxFeather = EntityBox.extend({
        item: 2, // feather

        // Override to set specific item properties if needed
    });
});