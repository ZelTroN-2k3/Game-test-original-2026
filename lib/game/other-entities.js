ig.module(
    'game.other-entities'
)
.requires(
    'impact.entity'
).defines(function() {
    EntitySelectGuy = ig.Entity.extend({
        gravityFactor: 0,
        skin: 0,
        animSheet: new ig.AnimationSheet('media/player.png', 16, 16),
        
        init: function(x, y, settings) {
            this.parent(x - 8, y - 8, settings);
            this.setupAnimation(this.skin);
        },
        
        setupAnimation: function(offset) {
            offset = offset * 42;
            this.addAnim('standDown', 1, [0 + offset]);
            this.addAnim('walkDown', 0.1, [0 + offset, 1 + offset, 2 + offset, 3 + offset]);
        },
        
        update: function() {
            this.parent();
            if (ig.input.pressed('click')) {
                if (ig.input.mouse.x >= this.pos.x && ig.input.mouse.x <= this.pos.x + this.size.x && ig.input.mouse.y >= this.pos.y && ig.input.mouse.y <= this.pos.y + this.size.y) {
                    ig.game.sndMenu.play();

                    if (ig.gameState.skin == this.skin) {
                        ig.game.gameStart();
                    } else {
                        ig.gameState.skin = this.skin;
                    }
                }
            }
            if (ig.gameState.skin == this.skin) {
                this.currentAnim = this.anims.walkDown;
            } else {
                this.currentAnim = this.anims.standDown;
            }
        }
    });
    
    EntitySelectGirl = EntitySelectGuy.extend({
        skin: 1,
    });
    
    EntityTitleScreenCat = ig.Entity.extend({
        speed: 80,
        flip: false,
        animSheet: new ig.AnimationSheet('media/cat.png', 16, 16), 

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('run', 0.07, [0, 1, 2, 3]);               // Animation run
            this.vel.x = this.speed;
        },

        update: function() {
            this.parent();
            if ((!this.flip && this.pos.x > 256 + 240) || (this.flip && this.pos.x < -256)) {
                this.flip = !this.flip;
            }
            this.vel.x = this.speed * (this.flip ? -1 : 1);
            this.currentAnim.flip.x = this.flip;
        }
    });


    EntityStartScreenGirl = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/player.png', 16, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('run', 0.07, [12, 13, 14, 15, 16, 17]); // Animation run
            this.vel.x = 60;
        },

        update: function() {
            this.parent();
            if (this.pos.x > 256) {
                ig.system.setGame(GameScreen);
            }
        }
    });


    EntityStartScreenCat = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/cat.png', 16, 16), 

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('run', 0.07, [0, 1, 2, 3]);                // Animation run
            this.vel.x = 80;
        }
    });


    EntityEndScreenGirl = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/player.png', 16, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('run', 0.07, [12, 13, 14, 15, 16, 17]); // Animation run
            this.addAnim('win', 1, [9]);                        // Animation win
            this.vel.x = 40;
        },

        update: function() {
            this.parent();
            if (this.pos.x > 112) {
                this.vel.x = 0;
                this.pos.x = 112;
                this.currentAnim = this.anims.win;
            }
        }
    });


    EntityEndScreenCat = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/cat.png', 16, 16), 

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('stand', 1, [4]);                      // Animation stand
        }
    });
});