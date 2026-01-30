ig.module(
	'game.entities.block'
)
.requires(
	'impact.entity'
)
.defines(function() {

    EntityBlock = ig.Entity.extend({
        _wmIgnore: true,
        
        ready: function() {
            ig.game.collisionMap.setTile(this.pos.x, this.pos.y, 99);
        },
        
        update: function() {
            //this.parent();
        },
        
        action: function() {
            //this.kill();
        },
        
        kick: function(other, axis) {
            var entitys = [];
            var entity = null;
            entitys = ig.game.getEntitiesByType(EntityEnemyWalk);
            for (var i = 0, length = entitys.length; i < length; i++) {
                entity = entitys[i];
                if (entity.pos.x + entity.size.x > this.pos.x && entity.pos.x < this.pos.x + this.size.x && Math.round(entity.pos.y + entity.size.y) == this.pos.y) {
                    entity.kill();
                }
            }
            entitys = ig.game.getEntitiesByType(EntityItemHeart);
            for (var i = 0, length = entitys.length; i < length; i++) {
                entity = entitys[i];
                if (entity.pos.x + entity.size.x > this.pos.x && entity.pos.x < this.pos.x + this.size.x && Math.round(entity.pos.y + entity.size.y) == this.pos.y) {
                    entity.flip = !entity.flip;
                    entity.vel.y -= 200;
                }
            }
        }
    });
});