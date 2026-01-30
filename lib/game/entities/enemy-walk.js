/*
* Placez un EntityKiwi (Kiwi ou Kiwi2, Kiwi3) sur une plateforme volante.
*   joutez la propriété : Key: stayOnPlatform avec la Value: true.
* Résultat : Cet ennemi fera des allers-retours sans jamais tomber, 
* parfait pour gêner le joueur sur des plateformes étroites !
*/

ig.module(
    'game.entities.enemy-walk'
)
.requires(
    'impact.entity'
)

.defines(function () {
    EntityEnemyWalk = ig.Entity.extend({
        _wmIgnore: true,

        maxVel: {x: 100, y: 200},
        flip: false,
        speed: 20,
        jump: 150,
        dead: null,
        canJump: true,

        // Par défaut à 'false'. Si mis à 'true', l'ennemi ne saute jamais dans le vide.
        stayOnPlatform: false, 
        distanceToFollow: 100, // Valeur par défaut ajoutée pour la sécurité

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 0.5, [0, 1]);
            this.addAnim('walk', 0.2, [6, 7, 8, 9, 10, 11]);
            this.addAnim('fall', 1, [5]); // Utilise la 2ème frame pour la chute
            this.addAnim('jump', 1, [3]); // Utilise la 1ère frame pour le saut

        },

        // Gère la collision avec d'autres entités
        collideWith: function(other, axis) {
            // Si on touche une autre entité sur le côté (axe X)
            if (axis === 'x') {
                // On fait demi-tour
                this.flip = !this.flip;
            }
        },

        update: function() {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            var isFollowing = false;

            if (player && this.distanceTo(player) < this.distanceToFollow) {
                isFollowing = true;
            }

            if (this.standing) {
                this.canJump = true;
            }

            // 1. Calcul des points de sonde (devant l'ennemi)
            var xProbe = this.pos.x + (this.flip ? -5 : this.size.x + 5); // On regarde un peu plus loin
            var yProbe = this.pos.y + this.size.y + 2;

            // 2. Vérification MAP (Sol classique)
            var groundInFront = ig.game.collisionMap.getTile(xProbe, yProbe);
            
            // 3. --- Vérification ENTITÉS (Plateformes) ---
            // Si la map dit "vide", on regarde s'il y a une entité solide dessous
            if (!groundInFront) {
                // On cherche toutes les entités
                var entities = ig.game.entities;
                for(var i = 0; i < entities.length; i++) {
                    var ent = entities[i];
                    
                    // On cherche une entité qui est "FIXED" (comme les plateformes)
                    // et on regarde si notre point de sonde est DEDANS
                    if (ent !== this && 
                        ent.collides === ig.Entity.COLLIDES.FIXED &&
                        xProbe >= ent.pos.x && xProbe < ent.pos.x + ent.size.x &&
                        yProbe >= ent.pos.y && yProbe < ent.pos.y + ent.size.y) {
                            
                        groundInFront = true;
                        break; // On a trouvé un sol, pas besoin de continuer
                    }
                }
            }
            // -------------------------------------------------------

            var wallInFront = ig.game.collisionMap.getTile(
                this.pos.x + (this.flip ? -2 : this.size.x + 2),
                this.pos.y + this.size.y - 1
            );

            if (this.standing && (wallInFront || !groundInFront)) {
                if (this.stayOnPlatform && !groundInFront) {
                    this.flip = !this.flip;
                }
                else {
                    if (isFollowing && this.canJump) {
                        this.vel.y = -this.jump;
                        this.canJump = false; 
                    } 
                    else if (!isFollowing) {
                        this.flip = !this.flip; 
                    }
                }
            }
            
            this.vel.x = this.speed * (this.flip ? -1 : 1);

            if (isFollowing && !(this.stayOnPlatform && !groundInFront)) {
                this.flip = (player.pos.x < this.pos.x);
            }

            if (this.vel.y < 0) {
                this.currentAnim = this.anims.jump;
            } else if (this.vel.y > 0) {
                this.currentAnim = this.anims.fall;
            } else if (this.vel.x !== 0) {
                this.currentAnim = this.anims.walk;
            } else {
                this.currentAnim = this.anims.idle;
            }
            
            this.currentAnim.flip.x = !this.flip;
            this.parent();
        },
        
        handleMovementTrace: function (res) {
            this.parent(res);
            if (res.collision.x) {
                this.flip = !this.flip;
            }
        },

        kill: function () {
            // Sécurité : vérifier que 'dead' existe avant de spawn
            if( this.dead ) {
                ig.game.spawnEntity(this.dead, this.pos.x, this.pos.y);
            } else {
                // Fallback générique si 'dead' n'est pas défini dans la sous-classe
                ig.game.spawnEntity(EntityEnemyDeathSmoke, this.pos.x, this.pos.y);
            }
            this.parent();
        },

        check: function (other) {
            if (other.pos.y + (other.size.y / 2) < this.pos.y && other.vel.y > 0) {
                if (ig.input.state('jump')) {
                    other.vel.y = -other.jump;
                } else {
                    other.vel.y = -(other.jump / 2);
                }
                this.kill();
            } else {
                other.receiveDamage(10, this);
            }
        }
    });
});