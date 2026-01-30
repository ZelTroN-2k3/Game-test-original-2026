ig.module(
	'game.entities.points'
)
.requires(
	'impact.entity'
)
.defines(function() {

    EntityPoints = ig.Entity.extend({
        _wmIgnore: true,
        speed: -80,
        
        update: function() {
            this.pos.y += this.speed * ig.system.tick;
            if (this.pos.y < ig.game.screen.y) {
                this.kill();
            }
        }
    });
    
    EntityPoints100 = EntityPoints.extend({
        size: {x: 18, y: 9},
        offset: {x: 9, y: 0},
        animSheet: new ig.AnimationSheet('media/points.png', 18, 9),
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 1, [0]);
            ig.game.addScore(100);
        }
    });
    
    EntityPoints1000 = EntityPoints.extend({
        size: {x: 18, y: 9},
        offset: {x: 9, y: 0},
        animSheet: new ig.AnimationSheet('media/points.png', 18, 9),
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 1, [4]);
            ig.game.addScore(1000);
        }
    });
    
    EntityPoints1up = EntityPoints.extend({
        size: {x: 18, y: 10},
        offset: {x: 9, y: 0},
        animSheet: new ig.AnimationSheet('media/pointsUp.png', 18, 10),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('anim', 1, [0]);
            ig.gameState.lives += 1;
            ig.game.sndLive.play();
        }
    });
});