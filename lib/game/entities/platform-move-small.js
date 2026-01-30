ig.module(
    'game.entities.platform-move-small'
)
.requires(
    'game.entities.platform-move'
)
.defines(function() {
    EntityPlatformMoveSmall = EntityPlatformMove.extend({
        size: {x: 16, y: 8},
        animSheet: new ig.AnimationSheet('media/platform-small.png', 16, 8),
    });
});