ig.module(
	'game.entities.ladder'
)
.requires(
	'impact.entity'
)
.defines(function() {
    EntityLadder = ig.Entity.extend({
        _wmDrawBox: true,
        _wmScalable: true,
        _wmBoxColor: 'rgba(222, 2, 2, 0.5)',

        size: {x: 16, y: 48},
        activeFlag: false,
        gravityFactor: 0,
        OFFSET_X: 4,

        collides: ig.Entity.COLLIDES.NEVER,
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
        },

        ready: function() {
            this.size.x = 16;
        },

        update: function() {
            if (this.isSteppingLadder()) {
                ig.game.player.onTopLadder = true;
            }
            this.gripManager();
            if (this.touches(ig.game.player) && this.activeFlag) {
                ig.game.player.onLadder = true;
                ig.game.player.pos.x = this.pos.x + this.OFFSET_X;
                ig.game.player.vel.x = 0;
                ig.game.player.accel.x = 0;
            }
            if (ig.input.pressed('jump') && ig.game.player.onLadder) {
                this.getOffLadder();
            }
            if (this.activeFlag && ig.game.player.onLadder) {
                if (this.isPlayerOnTop()) {
                    this.getOffLadder();
                }
                if (this.isPlayerOnBottom()) {
                    this.getOffLadder();
                }
            }
            this.parent();
        },

        gripManager: function() {
            if (this.touches(ig.game.player) && (ig.input.state('up') || ig.input.state('down'))) {
                this.activeFlag = true;
            }
            if (this.isSteppingLadder() && ig.input.pressed('down')) {
                this.activeFlag = true;
                ig.game.player.pos.y += 4;
                ig.game.player.onTopLadder = false;
            }
        },
        
        isSteppingLadder: function() {
            var player = ig.game.player;
            return player.pos.y + player.size.y <= this.pos.y + 1 && player.pos.y > this.pos.y - 16 - 4 && player.pos.x >= this.pos.x - 4 && player.pos.x <= this.pos.x + this.size.x;
        },
        isPlayerOnTop: function() {
            return ig.game.player.pos.y + ig.game.player.size.y < this.pos.y;
        },
        isPlayerOnBottom: function() {
            return ig.game.player.pos.y > this.pos.y + this.size.y;
        },
        getOffLadder: function() {
            ig.game.player.onLadder = false;
            this.activeFlag = false;
        }
    });
});
