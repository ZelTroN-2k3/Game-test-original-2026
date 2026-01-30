ig.module(
    'game.entities.item-heart'
)
.requires(
    'impact.entity'
)
.defines(function () {

    EntityItemHeart = ig.Entity.extend({
        _wmIgnore: true,

        size: { x: 12, y: 12 },
        offset: { x: 2, y: 4 },
        vel: { x: 0, y: -200 },
        maxVel: { x: 100, y: 200 },

        zIndex: -1,
        flip: false,
        speed: 0,

        checkAgainst: ig.Entity.TYPE.A,
        animSheet: new ig.AnimationSheet('media/heart.png', 16, 16),

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim1', 0.1, [0, 1, 2]);   // heart red      / mushroom red
            this.addAnim('anim2', 0.1, [3, 4, 5]);   // heart magenta  / mushroom orange
            this.addAnim('anim3', 0.1, [6, 7, 8]);   // heart blue     / mushroom blue
            this.addAnim('anim4', 0.1, [9, 10, 11]); // heart black  
            ig.game.sortEntitiesDeferred();
        },

        ready: function () {
            this.parent();

            switch (ig.game.levelNumber()) {
                case 2: this.currentAnim = this.anims.anim2; break;  // heart magenta / mushroom orange
                case 4: this.currentAnim = this.anims.anim3; break;  // heart blue    / mushroom blue
                default: this.currentAnim = this.anims.anim1; break; // heart red     / mushroom red
            }
        },

        update: function () {
            this.parent();

            this.vel.x = this.speed * (this.flip ? -1 : 1);
            if (this.pos.y > ig.game.screen.y + ig.system.height) {
                this.kill();
            }
        },

        handleMovementTrace: function (res) {
            this.parent(res);
            
            if (res.collision.x) {
                this.flip = !this.flip;
            }
            if (this.speed === 0 && res.collision.y) {
                this.speed = 20;
                if (Math.round(Math.random()) == 1) {
                    this.flip = true;
                }
            }
        },

        kill: function () {
            // Sécurité : vérifier que 'dead' existe avant de spawn
            if( this.dead ) {
                ig.game.spawnEntity(this.dead, this.pos.x, this.pos.y);
            } else {
                // Fallback générique si 'dead' n'est pas défini dans la sous-classe
                //ig.game.spawnEntity(EntityEnemyDeathSmoke, this.pos.x, this.pos.y);
                 ig.game.spawnEntity(EntityItemBrickSpark, this.pos.x, this.pos.y);
            }
            this.parent();
        },

        check: function (other) {
            ig.game.addScore(1000);
            ig.game.spawnEntity(EntityPoints1up, this.pos.x + (this.size.x / 2), this.pos.y);
            this.kill();
        }
    });     
});