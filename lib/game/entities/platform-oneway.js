ig.module(
	'game.entities.platform-oneway'
)
.requires(
	'impact.entity'
)
.defines(function() {

    EntityPlatformOneway = ig.Entity.extend({
        size: {x: 16, y: 8}, // Hauteur fine par défaut
        maxVel: {x: 0, y: 0},
        
        _wmScalable: true,    // On peut l'étirer dans l'éditeur
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(200, 200, 255, 0.5)', // Bleu clair dans l'éditeur

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A, // On vérifie la collision avec le Joueur (TYPE A)
        
        // IMPORTANT : NONE permet au joueur de passer au travers quand il saute
        collides: ig.Entity.COLLIDES.NONE, 

        // Optionnel : Une image si vous voulez (décommentez si besoin)
        // animSheet: new ig.AnimationSheet('media/one-way-platform.png', 16, 8),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            // this.addAnim('idle', 1, [0]);
        },

        update: function() {
            // Cette plateforme est statique, pas besoin d'update complexe
        },

        check: function(other) {
            // 1. Le joueur doit être en train de tomber (vitesse Y positive)
            // S'il saute (vitesse négative), on le laisse passer.
            if (other.vel.y > 0) {
                
                // 2. Vérification de la position :
                // Les pieds du joueur (pos.y + size.y) doivent être 
                // à peu près au niveau du haut de la plateforme (this.pos.y).
                // On ajoute une petite tolérance (ex: +8px) pour capturer le moment du contact.
                if (other.pos.y + other.size.y < this.pos.y + 8) {
                    
                    // 3. On "pose" le joueur sur la plateforme
                    other.pos.y = this.pos.y - other.size.y;
                    other.vel.y = 0; // On arrête sa chute
                    other.standing = true; // On dit au moteur que le joueur est "debout" pour qu'il puisse resauter
                }
            }
        }
    });

});