ig.module(
    'game.entities.hurt'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityHurt = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0, 0, 0.7)',
        _wmScalable: true,

        damage: 10,

        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        check: function(other) {
            other.receiveDamage(this.damage, this);
        },

        update: function() {
            
        }
    });
});