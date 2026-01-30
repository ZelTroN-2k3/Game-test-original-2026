ig.module(
	'game.entities.box'
)
.requires(
	'game.entities.block'
)
.defines(function() {

    EntityBox = EntityBlock.extend({
        _wmIgnore: false,
        
        item: 0,
        empty: false,
        
        animSheet: new ig.AnimationSheet('media/box.png',16,16),
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim11', 1, [0]);
            this.addAnim('anim12', 1, [1]);
            this.addAnim('anim21', 1, [2]);
            this.addAnim('anim22', 1, [3]);
            this.addAnim('anim31', 1, [4]);
            this.addAnim('anim32', 1, [5]);
        },
        
        ready: function() {
            this.parent();
            switch (ig.game.levelNumber()) {
            case 2: this.currentAnim = this.anims.anim21; break; // level 2
            case 4: this.currentAnim = this.anims.anim31; break; // level 4
            default: this.currentAnim = this.anims.anim11; break; // level 1
            }
        },
        
        action: function() {
            this.kick();
            if (this.empty) {
                return;
            }
            ig.game.addScore(100);
            if (this.item == 1) {
                ig.game.spawnEntity(EntityItemFlash, this.pos.x + 4, this.pos.y);
            } else if (this.item == 2) {
                ig.game.spawnEntity(EntityItemFeather, this.pos.x + 2, this.pos.y);
            } else if (this.item == 3) {
                ig.game.spawnEntity(EntityItemHeart, this.pos.x + 2, this.pos.y);
            } else if (this.item == 4) {
                ig.game.spawnEntity(EntityItemMushroom, this.pos.x + 2, this.pos.y);
            } else {
                ig.game.spawnEntity(EntityItemCoin, this.pos.x, this.pos.y);
            }

            switch (ig.game.levelNumber()) {
            case 2: this.currentAnim = this.anims.anim22; break; // level 2
            case 4: this.currentAnim = this.anims.anim32; break; // level 4
            default: this.currentAnim = this.anims.anim12; break; // level 1
            }
            
            ig.game.sndBounce.play();
            this.empty = true;
        }
    });
});