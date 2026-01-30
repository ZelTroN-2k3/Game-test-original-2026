ig.module(
    'game.entities.brick'
)
.requires(
    'game.entities.block'
)
.defines(function() {
    EntityBrick = EntityBlock.extend({
        _wmIgnore: false,

        animSheet: new ig.AnimationSheet('media/brick.png',16,16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim1', 1, [0]);
            this.addAnim('anim2', 1, [1]);
            this.addAnim('anim3', 1, [2]);
        },

        ready: function() {
            this.parent();
            switch (ig.game.levelNumber()) {
            case 2: this.currentAnim = this.anims.anim2; break; // level 2
            case 4: this.currentAnim = this.anims.anim3; break; // level 4
            default: this.currentAnim = this.anims.anim1; break; // level 1
            }
        },

        action: function() {
            this.kick();
            ig.game.addScore(100);

            // Spawn de l'étincelle (code précédent)
            ig.game.spawnEntity(EntityItemBrickSpark, this.pos.x, this.pos.y);
                        
            ig.game.spawnEntity(EntityBrickShard, this.pos.x, this.pos.y, { flip: true });
            ig.game.spawnEntity(EntityBrickShard, this.pos.x, this.pos.y + 8, { flip: true });
            ig.game.spawnEntity(EntityBrickShard, this.pos.x + 8, this.pos.y);
            ig.game.spawnEntity(EntityBrickShard, this.pos.x + 8, this.pos.y + 8);
            
            ig.game.sndBrick.play();
            ig.game.collisionMap.setTile(this.pos.x, this.pos.y, 0);
            this.kill();
        }
    });


    EntityBrickShard = ig.Entity.extend({
        _wmIgnore: true,
        
        size: {x: 8, y: 8},
        vel: {x: 0, y: -150},
        maxVel: {x: 100, y: 200},
        flip: false,
        speed: 40,
        
        animSheet: new ig.AnimationSheet('media/brick-shard.png',8,8),
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim1', 1, [0]);
            this.addAnim('anim2', 1, [1]);
            this.addAnim('anim3', 1, [2]);
            
            switch (ig.game.levelNumber()) {
            case 2: this.currentAnim = this.anims.anim2; break; // level 2
            case 4: this.currentAnim = this.anims.anim3; break; // level 4
            default: this.currentAnim = this.anims.anim1; break; // level 1
            }
        },
        
        update: function() {
            this.vel.y += ig.game.gravity * ig.system.tick * this.gravityFactor;
            this.vel.x = this.getNewVelocity(this.vel.x, this.accel.x, this.friction.x, this.maxVel.x);
            this.vel.y = this.getNewVelocity(this.vel.y, this.accel.y, this.friction.y, this.maxVel.y);
            this.pos.x += this.vel.x * ig.system.tick;
            this.pos.y += this.vel.y * ig.system.tick;
            this.vel.x = this.speed * (this.flip ? -1 : 1);
            this.currentAnim.flip.x = this.flip;
            
            this.currentAnim.update();
            
            if (this.pos.y > ig.game.screen.y + ig.system.height) {
                this.kill();
            }
        }
    });
});