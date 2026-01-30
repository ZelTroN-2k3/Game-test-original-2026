ig.module(
    'game.entities.platform-drop-small'
)
.requires(
    'game.entities.platform-drop'
)
.defines(function() {
    EntityPlatformDropSmall = EntityPlatformDrop.extend({
        size: {x: 16,y: 8},
        animSheet: new ig.AnimationSheet('media/platform-small.png', 16, 8),
    });
});