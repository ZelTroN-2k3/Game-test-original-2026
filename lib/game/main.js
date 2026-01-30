ig.module(
	'game.main'
)
.requires(
    // Impact
    //'impact.debug.debug',    
	'impact.game', 

    // Plugins
	'plugins.impact-splash-loader', 
	'plugins.gamepad', 
	'plugins.touch-button', 

    // Sound system
	'game.system.game-sound',	

    // Game levels
	'game.levels.1', 
	'game.levels.2', 
	'game.levels.3', 
	'game.levels.4', 
	'game.levels.5', 
	'game.levels.6', 
	'game.levels.7', 
	'game.levels.8', 
	'game.levels.9', 
	'game.levels.10', 
	'game.levels.11', 
	'game.levels.12', 
	'game.levels.13', 
	'game.levels.14', 
	'game.levels.15', 
	'game.levels.16', 
	'game.levels.StartEnd', 
	
    // Game menus
	'game.menus', 
	
    // Game entities
	'game.other-entities', 
	'game.entities.arrowlauncher', 
	'game.entities.ball', 
	'game.entities.bee', 
	'game.entities.ladder',      // ladder 
    'game.entities.dust',        // dust player
    'game.entities.enemy-dead', //
    'game.entities.enemy-death-smoke', // enemy death smoke
    'game.entities.cannon',   // cannon and bullet
    'game.entities.flag', // flag pole
    'game.entities.platform-oneway', // one-way platform
    'game.entities.trampoline', // trampoline
    'game.entities.thwomp', // thwomp
    'game.entities.dust-thwomp', // dust thwomp
    'game.entities.piranha', // piranha plant


    // box entities
	'game.entities.block', 
	'game.entities.box', 
	'game.entities.box-feather', 
	'game.entities.box-flash', 
	'game.entities.box-heart', 
	'game.entities.box-mushroom', 

    // other entities
	'game.entities.brick', 
	'game.entities.bug', 
	'game.entities.checkpoint', 
	'game.entities.coin', 

    // enemy entities
	'game.entities.enemy-jump', 
	'game.entities.enemy-walk', 
	'game.entities.finish', 
	'game.entities.fireball', 
	'game.entities.fish', 
	'game.entities.hurt', 

    // item entities
    'game.entities.item-brick-spark', 
	'game.entities.item-coin', 
    'game.entities.item-coin-spark', 
	'game.entities.item-feather', 
	'game.entities.item-flash', 
	'game.entities.item-heart', 
	'game.entities.item-mushroom', 

    // interactive entities
	'game.entities.kiwi', 
	'game.entities.kiwi2', 
    'game.entities.kiwi3', 
	'game.entities.lavaball', 
	'game.entities.pig', 

    // platform entities
	'game.entities.platform-drop', 
	'game.entities.platform-drop-small', 
	'game.entities.platform-move', 
	'game.entities.platform-move-small', 

    // player entities
	'game.entities.player', 
    'game.entities.player-dead',
    'game.entities.player-goal',

    // screen entities
	'game.entities.points', 
	'game.entities.spawn', 
	'game.entities.target'
)
.defines(function() {

	version = '2.0'; // version 

    GameScreen = ig.Game.extend({
    
        checkpoint: false,  // checkpoint flag
        freeze: false,      // freeze game flag
        gravity: 600,       // gravity
        hideTouch: false,   // hide touch buttons
        info: false,        // stage info display flag
        menu: null,         // pause menu
        player: null,       // player entity
        showDebug: false,   // debug info

        // images
        imgHud: new ig.Image('media/hud.png'),
        imgHudIcons: new ig.Image('media/hud-icons.png'),
        imgPause: new ig.Image('media/pause.png'),
        imgBlack: new ig.Image('media/black.png'),
        imgStatMatte: new ig.Image('media/stat-matte.png'),
        

        //		  _____ _   _ _____ _______ 
		//		 |_   _| \ | |_   _|__   __|
		//		   | | |  \| | | |    | |   
		//		   | | | . ` | | |    | |   
		//		  _| |_| |\  |_| |_   | |   
		//		 |_____|_| \_|_____|  |_| 
		//
        init: function() {
            if (ig.gameState.level === 0 || ig.gameState.lives === 0) {
                ig.gameState.coins = 0;
                ig.gameState.continue = 2;
                ig.gameState.item = 0;
                ig.gameState.level = 1;
                ig.gameState.lives = 3;
                ig.gameState.score = 0;
                ig.gameState.highscore = ig.gameState.highscore || 0;
            }
            if (ig.gameState.level > 16) {
                ig.gameState.level = 16;
            }

            this.setMusic();   // set up music

            this.timer = new ig.Timer();

            // load level
            this.loadLevel(ig.global['Level' + ig.gameState.level]);
        },
        
        loadLevel: function(data) {
            // Set current level
            this.currentLevel = data;
            // Call parent function
            this.parent(data);
            // Save game state
            toStorage();


            this.info = true; // true = affichage info stage a chaque nouveau level // false = off
            this.timer.reset();
            
            // spawn player
            var spawn = ig.game.getEntitiesByType(EntitySpawn)[0];
            // check for checkpoint
            if (this.checkpoint) {
                spawn = ig.game.getEntitiesByType(EntityCheckpoint)[0];
            }
            // spawn player
            this.player = ig.game.spawnEntity(EntityPlayer, spawn.pos.x, spawn.pos.y);
        },
        

		//	  _    _ _____  _____       _______ ______ 
		//	 | |  | |  __ \|  __ \   /\|__   __|  ____|
		//	 | |  | | |__) | |  | | /  \  | |  | |__   
		//	 | |  | |  ___/| |  | |/ /\ \ | |  |  __|  
		//	 | |__| | |    | |__| / ____ \| |  | |____ 
		//	  \____/|_|    |_____/_/    \_\_|  |______|
		//           
        update: function() {
            // Update all entities and backgroundMaps
            if (ig.input.pressed('touch')) {
                this.hideTouch = !this.hideTouch;
            }
            if (ig.dev) {
                if (ig.input.pressed('freeze')) { // Freeze Toggle
                    this.freeze = !this.freeze;
                }
                if (ig.input.pressed('godmode')) { // God Mode Toggle
                    if (this.player) {
                        this.player.invincible = !this.player.invincible; 
                        console.log('God Mode: ' + (this.player.invincible ? 'ON' : 'OFF'));
                    }
                }  
                if (ig.input.pressed('noclip')) { // No Clip (Vol) Toggle
                    if (this.player) {
                        this.player.noClip = !this.player.noClip;
                        this.player.vel.x = 0;
                        this.player.vel.y = 0;
                        console.log('No Clip: ' + (this.player.noClip ? 'ON' : 'OFF'));
                    }
                } 
                if (ig.input.pressed('infodebug')) { // Info Debug Toggle
                    this.showDebug = !this.showDebug;
                }
                if (ig.input.pressed('live')) { // Add Lives
                    ig.gameState.lives += 1;
                }
                if (ig.input.pressed('plus')) { // Next Level
                    this.nextLevel(ig.gameState.level += 1);
                }
                if (ig.input.pressed('minus')) { // Previous Level
                    this.nextLevel(ig.gameState.level -= 1);
                }
                if (ig.input.pressed('1')) { // Level 1
                    ig.gameState.item = 1;
                }
                if (ig.input.pressed('2')) { // Level 2
                    ig.gameState.item = 2;
                }
            }
            if (this.freeze) {
                return;
            }
            if (this.menu) {
                this.menu.update();
                return;
            }
            if (this.player) {
                // Suivi horizontal (votre code existant)
                this.screen.x = this.player.pos.x - (ig.system.width / 2) + 24;

                // --- On ajoute le suivi vertical ---
                this.screen.y = this.player.pos.y - (ig.system.height / 2) - 16;
                
                // On s'assure que la caméra ne sorte pas des limites horizontales du niveau
                if (this.screen.x < 0) {
                    this.screen.x = 0;
                }
                if (this.screen.x > this.collisionMap.pxWidth - ig.system.width) {
                    this.screen.x = this.collisionMap.pxWidth - ig.system.width;
                }
                
                // --- On ajoute les limites verticales pour la caméra ---
                if (this.screen.y < 0) {
                    this.screen.y = 0;
                }
                if (this.screen.y > this.collisionMap.pxHeight - ig.system.height) {
                    this.screen.y = this.collisionMap.pxHeight - ig.system.height;
                }
            } 

            // Affichage info stage
            if (this.info) {
                if (this.timer.delta() > 2) {
                    this.info = false;
                    this.timer.pause();
                    
                    // Récupère le numéro du niveau actuel (1, 2, 3 ou 4)
                    // grâce à votre fonction existante getLevel() en bas du fichier.
                    var currentStage = getLevel(ig.gameState.level);
                    
                    // Joue la piste correspondante dynamiquement.
                    // Cela donnera 'track1', 'track2', 'track3' ou 'track4'
                    ig.music.play('track' + currentStage);
                }
                return;
            }

            // Appeler Menu PauseResume
            if (ig.input.pressed('start')) {
                this.gamePause();
            }

            this.parent();
            // Add your own, additional update code here
        },

        
		//	  _____  _____       __          __
		//	 |  __ \|  __ \     /\ \        / /
		//	 | |  | | |__) |   /  \ \  /\  / / 
		//	 | |  | |  _  /   / /\ \ \/  \/ /  
		//	 | |__| | | \ \  / ____ \  /\  /   
		//	 |_____/|_|  \_\/_/    \_\/  \/    
		//
        draw: function() {
            // Cette partie gère la secousse de l'écran si elle est activée
            if (this.screen.shake) {
                var s = this.screen.shake;
                // On déplace aléatoirement la caméra
                this.screen.x += Math.round(Math.random() * s.x * 2) - s.x;
                this.screen.y += Math.round(Math.random() * s.y * 2) - s.y;

                // On réduit progressivement la force de la secousse pour qu'elle s'arrête
                s.x *= 0.9;
                s.y *= 0.9;
                if (s.x < 0.1) { s.x = 0; }
                if (s.y < 0.1) { s.y = 0; }
                if (s.x === 0 && s.y === 0) {
                    this.screen.shake = null;
                }
            } 
            
            // Draw all entities and backgroundMaps
            ig.system.clear(this.clearColor);
            // calculate the real screen position based on the screen pos and the scale
            this._rscreen.x = ig.system.getDrawPos(this.screen.x) / ig.system.scale;
            this._rscreen.y = ig.system.getDrawPos(this.screen.y) / ig.system.scale;

            // Draw backgroundMaps -Info Stage-
            if (this.info) {
                this.imgBlack.draw(0, 0);
                ig.font2.draw('Stage', ig.system.width / 2, (ig.system.height / 2) - 10, ig.Font.ALIGN.CENTER);
                ig.font1.draw('\n' + getWold(ig.gameState.level) + '-' + getLevel(ig.gameState.level), ig.system.width / 2, (ig.system.height / 2) - 8, ig.Font.ALIGN.CENTER);
                return;
            }
            // --- CORRECTION DU RENDU ---
            
            // 1. D'abord, on dessine les calques de FOND (ceux qui ne sont PAS foreground)
            for (var mapIndex = 0; mapIndex < this.backgroundMaps.length; mapIndex++) {
                var map = this.backgroundMaps[mapIndex];
                // Si la case "Foreground" n'est PAS cochée dans l'éditeur
                if (!map.foreground) {
                    map.setScreenPos(this.screen.x, this.screen.y);
                    map.draw();
                }
            }

            // 2. Ensuite, on dessine les ENTITÉS (La plante est ici)
            this.drawEntities();

            // 3. Enfin, on dessine les calques d'AVANT-PLAN (Le tuyau)
            // La plante sera donc recouverte par ce calque
            for (var mapIndex = 0; mapIndex < this.backgroundMaps.length; mapIndex++) {
                var map = this.backgroundMaps[mapIndex];
                // Si la case "Foreground" EST cochée
                if (map.foreground) {
                    map.setScreenPos(this.screen.x, this.screen.y);
                    map.draw();
                }
            }
            // ---------------------------

            // ...On dessine le HUD normal du joueur.
            var yy = 4;
            this.imgHud.draw(0, yy);
            // Afficher l’objet collecté dans le HUD
            if (ig.gameState.item == 1) {
                this.imgHudIcons.drawTile(152, yy, 0, 16, 16);
            } else if (ig.gameState.item == 2) {
                this.imgHudIcons.drawTile(152, yy, 1, 16, 16);
            }
            ig.font1.draw(zeroNumbers(ig.gameState.score, 6), 32, yy + 8, ig.Font.ALIGN.LEFT);
            ig.font1.draw(zeroNumbers(ig.gameState.coins, 2), 112, yy + 8, ig.Font.ALIGN.LEFT);
            ig.font1.draw(zeroNumbers(ig.gameState.lives, 2), 216, yy + 8, ig.Font.ALIGN.RIGHT);
            
            // Draw Pause Menu
            if (this.menu) {
                this.imgStatMatte.draw(0, 0);
                this.imgPause.draw(80, 80);
                this.menu.draw();
                ig.font2.draw('Stage ' + getWold(ig.gameState.level) + '-' + getLevel(ig.gameState.level), ig.system.width / 2, 90, ig.Font.ALIGN.CENTER);
                return;
            }
            // Draw touch buttons
            if (window.TouchButtons && !ig.input.gamepad && !this.hideTouch) {
                window.TouchButtons.draw();
            }
        
            // --- DEBUG INFO ---
            if (this.showDebug) {
                // 1. Fond semi-transparent noir pour que le texte soit lisible
                this.imgStatMatte.draw(0, 0);

                // 2. Préparation des variables à afficher
                var playerX = this.player ? Math.round(this.player.pos.x) : 0;
                var playerY = this.player ? Math.round(this.player.pos.y) : 0;
                var fps = Math.round(ig.system.fps); // Si ImpactJS suit les FPS
                
                // Récupération des comptes d'entités (comme dans votre log)
                var nCoins = ig.game.getEntitiesByType(EntityCoin).length;
                var nEnemies = ig.game.getEntitiesByType(EntityEnemyWalk).length;
                var nFlash = ig.game.getEntitiesByType(EntityBoxFlash).length;
                
                // 3. Affichage du texte (Ligne par ligne)
                var x = 4;
                var y = 22;
                var step = 10; // Espace entre les lignes

                // Utilisez ig.fontDebug (la petite fonte blanche)
                ig.fontDebug.draw('--- DEBUG INFO ---', x, y); y += step;
                ig.fontDebug.draw('FPS: ' + fps, x, y); y += step;
                ig.fontDebug.draw('Level: ' + getWold(ig.gameState.level) + '-' + getLevel(ig.gameState.level), x, y); y += step;
                ig.fontDebug.draw('Pos: X=' + playerX + ' Y=' + playerY, x, y); y += step;
                
                // Etats spéciaux
                var godText = (this.player && this.player.invincible) ? 'ON' : 'OFF';
                var clipText = (this.player && this.player.noClip) ? 'ON' : 'OFF';
                ig.fontDebug.draw('God: ' + godText + ' | Clip: ' + clipText, x, y); y += step;
                
                y += 4; 
                ig.fontDebug.draw('Entites:', x, y); y += step;
                ig.fontDebug.draw('- Coins: ' + nCoins, x, y); y += step;
                ig.fontDebug.draw('- Enemys: ' + nEnemies, x, y); y += step;
                ig.fontDebug.draw('- Flashs: ' + nFlash, x, y); y += step;
                ig.fontDebug.draw('- Hearts: ' + (ig.game.getEntitiesByType(EntityBoxHeart)).length, x, y); y += step;
                ig.fontDebug.draw('- Feathers: ' + (ig.game.getEntitiesByType(EntityBoxFeather)).length, x, y); y += step;
                ig.fontDebug.draw('- Mushrooms: ' + (ig.game.getEntitiesByType(EntityBoxMushroom)).length, x, y); y += step;
                ig.fontDebug.draw('- Contine: ' + (ig.gameState.continue), x, y); y += step;

                // Player skin
                ig.fontDebug.draw('- Skin: ' + ig.gameState.skin + (ig.gameState.skin === 0 ? ' (Boy)' : ' (Girl)'), x, y); y += step;
                // Vous pouvez ajouter Hearts, Feathers, etc. ici
            }
            // ----------------------     
        },
        
        // Game Pause Menu
        gamePause: function() {
            this.menu = new PauseMenu();
            ig.music.pause(); // pause music

            var entities = ig.game.getEntitiesByType(ig.Entity);
            for (var i = 0, length = entities.length; i < length; i++) {
                entity = entities[i];
                if (entity.timer) {
                    entity.timer.pause();
                }
            }
        },
        
        // Game UnPause Menu
        gameUnpause: function() {
            this.menu = null;
            ig.music.play(); // resume music

            var entities = ig.game.getEntitiesByType(ig.Entity);
            for (var i = 0, length = entities.length; i < length; i++) {
                entity = entities[i];
                if (entity.timer) {
                    entity.timer.unpause();
                }
            }
        },
        
        // NEXT LEVEL
        nextLevel: function(level) {
            this.checkpoint = false;
            ig.gameState.level = level || ig.gameState.level + 1;
            
            if (ig.gameState.level < 1) {
                ig.gameState.level = 1;
            }
            if (ig.gameState.level > 16) {
                ig.system.setGame(EndScreen);
            } else {
                // On transmet la position à loadLevel
                ig.game.loadLevel(ig.global['Level' + ig.gameState.level]);
            }
        },
        
        // CURRENT LEVEL NUMBER
        levelNumber: function() {
            return getLevel(ig.gameState.level);
        },
        
        // Add coin to score
        addCoin: function() {
            if (!this.player) {
                return;
            }
            ig.gameState.coins += 1;
            if (ig.gameState.coins == 100) {
                ig.gameState.coins = 0;
                ig.game.spawnEntity(EntityPoints1up, this.player.pos.x + (this.player.size.x / 2), this.player.pos.y);
            }
        },
        
        // Add score points
        addScore: function(points) {
            if (!this.player) {
                return;
            }
            var num = Math.floor(ig.gameState.score / 50000);
            ig.gameState.score += points;
            if (Math.floor(ig.gameState.score / 50000) > num) {
                ig.game.spawnEntity(EntityPoints1up, this.player.pos.x + (this.player.size.x / 2), this.player.pos.y);
            }
        }
    });
    
    
    TitleScreen = ig.Game.extend({
        imgTitle: new ig.Image('media/title.png'),

        menu: null,      // pause menu
        rdy: false,      // ready flag
        scrollSpeed: 30, // scroll speed

        //		  _____ _   _ _____ _______ 
		//		 |_   _| \ | |_   _|__   __|
		//		   | | |  \| | | |    | |   
		//		   | | | . ` | | |    | |   
		//		  _| |_| |\  |_| |_   | |   
		//		 |_____|_| \_|_____|  |_| 
		//
        init: function() {
            if (ig.dev) {
                console.log('GameScreen initialized');
            } 

            // reset player skin
            ig.playerSkin = 0;

            // fontes title screen
            ig.font1 = new ig.Font('media/fonts/test2p.font.png');
            ig.font1.letterSpacing = 1;
            ig.font2 = new ig.Font('media/fonts/test2p2.font.png');
            ig.font2.letterSpacing = 1;              

            // fontes HUD
            ig.font11 = new ig.Font('media/fonts/outlinedfont.png');
            ig.font11.letterSpacing = 0;
            ig.font22 = new ig.Font('media/fonts/outlinedfont_orange.png');
            ig.font22.letterSpacing = 0;   

            ig.fontDebug = new ig.Font('media/font.white.with.shadow.debug.png');
            ig.fontDebug.letterSpacing = 0;
            // input
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');   // gauche
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right'); // droite
            ig.input.bind(ig.KEY.UP_ARROW, 'up');       // haut
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down');   // bas
            ig.input.bind(ig.KEY.ENTER, 'start');       // start
            ig.input.bind(ig.KEY.X, 'fire');            // fire
            ig.input.bind(ig.KEY.SPACE, 'jump');        // jump

            // gamepad
            ig.input.bind(ig.GAMEPAD.PAD_LEFT, 'left');     // gauche
            ig.input.bind(ig.GAMEPAD.PAD_RIGHT, 'right');   // droite
            ig.input.bind(ig.GAMEPAD.PAD_TOP, 'up');        // haut
            ig.input.bind(ig.GAMEPAD.PAD_BOTTOM, 'down');   // bas
            ig.input.bind(ig.GAMEPAD.START, 'start');       // start
            ig.input.bind(ig.GAMEPAD.FACE_1, 'jump');       // jump
            ig.input.bind(ig.GAMEPAD.FACE_2, 'fire');       // fire
            ig.input.bind(ig.GAMEPAD.FACE_3, 'fire');       // fire

            // mouse
            ig.input.bind(ig.KEY.MOUSE1, 'click');      // click

            // dev keys
            ig.input.bind(ig.KEY.CTRL, 'ctrl');         // dev mode toggle
            ig.input.bind(ig.KEY.D, 'd');               // dev mode toggle
            ig.input.bind(ig.KEY.F, 'freeze');          // freeze toggle
            ig.input.bind(ig.KEY.L, 'live');            // add lives
            ig.input.bind(ig.KEY.T, 'touch');           // show/hide touch buttons
            ig.input.bind(ig.KEY.C, 'godmode');         // Toggle God Mode 
            ig.input.bind(ig.KEY.V, 'noclip');          // Toggle No Clip (Vol) 
            ig.input.bind(ig.KEY.I, 'infodebug');       // Info Debug Toggle 
            ig.input.bind(ig.KEY.ADD, 'plus');          // next level
            ig.input.bind(ig.KEY.SUBSTRACT, 'minus');   // previous level
            ig.input.bind(ig.KEY._1, '1');              // level 1 
            ig.input.bind(ig.KEY._2, '2');              // level 2 
            
            if (window.TouchButtons) {
                window.TouchButtons.align();
            }

            this.timer = new ig.Timer();
            toStorage();

            ig.game.spawnEntity(EntityTitleScreenCat, -128, 168);

            // highscore check
            if (ig.gameState.score > ig.gameState.highscore) {
                return;
            }   
        },

		//	  _    _ _____  _____       _______ ______ 
		//	 | |  | |  __ \|  __ \   /\|__   __|  ____|
		//	 | |  | | |__) | |  | | /  \  | |  | |__   
		//	 | |  | |  ___/| |  | |/ /\ \ | |  |  __|  
		//	 | |__| | |    | |__| / ____ \| |  | |____ 
		//	  \____/|_|    |_____/_/    \_\_|  |______|
		//        
        update: function() {
            this.parent();

            if (!this.rdy) {
                if (this.timer.delta() >= 0) {

                // On vérifie si le score actuel est supérieur au meilleur score
                if (ig.gameState.score > ig.gameState.highscore) {
                    // Si oui, on lance l'écran NewHighscore
                    ig.system.setGame(NewHighscoreScreen);
                } else {
                    // Sinon, on affiche le menu normal
                        this.menu = new TitleMenu2(); // TitleMenu = Actual menu, TitleMenu2 = Vérifie si on est dans l'environnement NW.js avant de quitter
                        ig.music.play('intro'); // overworld music
                        this.timer.reset();
                        this.rdy = true;
                    }
                }
                return;
            }

            // Aller aux crédits après un certain temps
            if (this.timer.delta() > 30) {
                ig.system.setGame(CreditsScreen);
            }
            // Update menu
            if (this.menu) {
                this.menu.update();
            }
            // Toggle dev mode
            if (ig.input.state('ctrl') && ig.input.pressed('d')) {
                ig.dev = !ig.dev;
            }
        },

        draw: function() {
            // Draw all entities and backgroundMaps
            this.parent();

            // Draw title image
            this.imgTitle.draw(0, 0);
            // Draw entities
            this.drawEntities();

            if (!this.rdy) {
                return;
            }
            // Display the player's version and highscore
            ig.font2.draw('[' + zeroNumbers(ig.gameState.highscore, 6) + ']', ig.system.width / 2, 4, ig.Font.ALIGN.CENTER);
            // info programming
            ig.font11.draw('v:' + version, 0, ig.system.height - 8, ig.Font.ALIGN.LEFT);
            if (this.menu) {
                this.menu.draw();
            }
        },

        gameStart: function() {
            this.menu = null;
            ig.music.stop();
            ig.game.sndStart.play();
            //ig.system.setGame(StartScreen);
            ig.system.setGame(GameScreen); // direct to game screen for testing
        }
    });


    SelectScreen = ig.Game.extend({
        imgBack: new ig.Image('media/select.png'),
        
        init: function() {
            ig.game.spawnEntity(EntitySelectGuy, 73, 136);
            ig.game.spawnEntity(EntitySelectGirl, 183, 136);
        },
        
        update: function() {
            this.parent();
            
            if (ig.input.pressed('left')) { 
                ig.gameState.skin = 0; // Garçon
                ig.game.sndMenu.play();
            } 
            else if (ig.input.pressed('right')) { 
                ig.gameState.skin = 1; // Fille
                ig.game.sndMenu.play();
            }

            if (ig.input.pressed('start')) { 
                ig.gameState.level = 0; 
                this.gameStart();
                ig.game.sndMenu.play();
            }
        },
        
        draw: function() {
            if (this.clearColor) {
                ig.system.clear(this.clearColor);
            }
            this._rscreen.x = ig.system.getDrawPos(this.screen.x) / ig.system.scale;
            this._rscreen.y = ig.system.getDrawPos(this.screen.y) / ig.system.scale;
            this.imgBack.draw(0, 0);
            this.drawEntities();
        },
        
        gameStart: function() {
            ig.gameState.level = 0; // reset level
            ig.system.setGame(GameScreen); // start game
        }
    });
    
    
    GameOverScreen = ig.Game.extend({
        menu: null,
        rdy: false,
        //wait: false,
        imgBlack: new ig.Image('media/black.png'),

        init: function() {
            ig.game.sndLose.play();
            this.timer = new ig.Timer();
        },

        update: function() {
            this.parent();
            if (this.menu) {
                this.menu.update();
                return;
            }
            if (!this.rdy && this.timer.delta() > 3) {
                this.rdy = true;
                if (ig.gameState.continue > 0) {
                    this.menu = new ContinueMenu();
                } else {
                    ig.system.setGame(TitleScreen);
                }
            }
        },

        continue: function() {
            ig.gameState.coins = 0;
            ig.gameState.continue--;
            ig.gameState.item = 0;
            ig.gameState.lives = 3;
            ig.gameState.score = 0;
            this.menu = null;
            ig.system.setGame(GameScreen);
        },

        draw: function() {
            this.parent();
            this.imgBlack.draw(0, 0);
            if (this.menu) {
                this.menu.draw();
                return;
            }
            ig.font2.draw('GAME OVER', ig.system.width / 2, (ig.system.height / 2) - 8, ig.Font.ALIGN.CENTER);
        }
    });
    
    
    StartScreen = ig.Game.extend({
        init: function() {
            this.loadLevel(LevelStartEnd);
            ig.game.spawnEntity(EntityStartScreenCat, -32, 160);
            ig.game.spawnEntity(EntityStartScreenGirl, -80, 160);
        }
    });
    
    
    EndScreen = ig.Game.extend({
        strGratz: 'Congratulations' + '\n' + '&' + '\n' + 'Thanks for playing!',

        init: function() {
            ig.music.volume = 0.6;
            ig.music.play('endgame'); // overworld music

            this.loadLevel(LevelStartEnd);
            ig.game.spawnEntity(EntityEndScreenGirl, -32, 160);
            ig.game.spawnEntity(EntityEndScreenCat, 128, 160);
            this.timer = new ig.Timer();
        },

        update: function() {
            this.parent();
            if (this.timer.delta() > 10) {
                ig.system.setGame(CreditsScreen);
                ig.music.stop(); // stop music
            }
        },

        draw: function() {
            this.parent();
            ig.font1.draw(this.strGratz, ig.system.width / 2, 96, ig.Font.ALIGN.CENTER);
        }
    });
    
    
    CreditsScreen = ig.Game.extend({
        imgBlack: new ig.Image('media/black.png'),
        strCredits1: 'Game (TEST-Original)',
        strCredits2: '\na game by\nPatrick. ANCHER (c)2026' + '\n\n\n' + 'Created with\n"ImpactJS"\nfrom Dominic Szablewski' + '\n\n\n' + 'Font\n"Press Start 2P"\nCodeMan38' + '\n\n\n' + 'Sound Effects\n"8 Bit Retro Rampage"\nredbuttonaudio.co.uk' + '\n\n\n' + 'Track 1\n"random silly chip song"\nbart (opengameart.org)' + '\n\n\n' + 'Track 2\n"Boss Fight"\nPhonson (opengameart.org)' + '\n\n\n',
        
        init: function() {
            ig.music.volume = 0.6;
            ig.music.play('credit'); // credit music            
            (document.getElementById("canvas")).style.cursor = 'none';
            this.scrolly = ig.system.height;
        },

        update: function() {
            this.scrolly -= 30 * ig.system.tick;
            if (this.scrolly < -ig.font1.heightForString(this.strCredits1 + this.strCredits2) || ig.input.pressed('start') || ig.input.pressed('click')) {
                ig.system.setGame(TitleScreen);
                ig.music.stop(); // stop music
            }
        },

        draw: function() {
            this.parent();
            this.imgBlack.draw(0, 0);
            ig.font2.draw(this.strCredits1, ig.system.width / 2, this.scrolly, ig.Font.ALIGN.CENTER);
            ig.font1.draw(this.strCredits2, ig.system.width / 2, this.scrolly, ig.Font.ALIGN.CENTER);
        }
    });

    
    NewHighscoreScreen = ig.Game.extend({
        font: new ig.Font('media/fonts/hall-fetica-bold.png'), // fonte normale
        fontSelected: new ig.Font('media/fonts/hall-fetica-bold2.png'), // fonte selectionnée
        
        init: function() {
            this.font.letterSpacing = 0;
            this.fontSelected.letterSpacing = 0;
            this.timer = new ig.Timer();
            ig.game.sndArch.play();
            
            // Update the highscore in the game state
            ig.gameState.highscore = ig.gameState.score;
            // Save the new highscore to localStorage
            toStorage(); 
        },

        update: function() {
            // After 3 seconds, go back to the title screen
            if (this.timer.delta() > 3) {
                ig.system.setGame(TitleScreen);
            }
        },

        draw: function() {
            this.parent();
            this.font.draw('NEW HIGHSCORE', ig.system.width / 2, (ig.system.height / 2) - 8, ig.Font.ALIGN.CENTER);
            this.fontSelected.draw('\n' + zeroNumbers(ig.gameState.score, 6), ig.system.width / 2, (ig.system.height / 2) - 8, ig.Font.ALIGN.CENTER);
        }
    });
    
    function getWold(lvl) {
        if (lvl / 4 > 3) { return 4;
        } else if (lvl / 4 > 2) { return 3;
        } else if (lvl / 4 > 1) { return 2;
        } else { return 1;
        }
    }
    
    function getLevel(lvl) {
        return (lvl - ((getWold(lvl) - 1) * 4));
    }
    
    function zeroNumbers(n, l) {
        var str = n.toString();
        for (var i = 0; i < l - n.toString().length; i++) {
            str = '0' + str;
        }
        return str;
    }
    
    if (ig.ua.touchDevice || ig.dev) {
        var buttonImage = new ig.Image('media/vkeys.png');
        TouchButtons = new ig.TouchButtonCollection(
            [
                new ig.TouchButton('left',{left: 0, bottom: 0}, 32, 32, buttonImage, 0),    // Button Left <- 
                new ig.TouchButton('right',{left: 32, bottom: 0}, 32, 32, buttonImage, 1),  // Button Right ->
                new ig.TouchButton('fire',{right: 32, bottom: 0}, 32, 32, buttonImage, 2),  // Button A 
                new ig.TouchButton('jump',{right: 0, bottom: 0}, 32, 32, buttonImage, 3),   // Button B 
                new ig.TouchButton('start',{left: 0, top: 0}, 32, 32, buttonImage, 4) /*,   // pause Menu
                new ig.TouchButton('up',{left: 16, bottom: 32}, 32, 32, buttonImage, 5),    // Button Up ^
                new ig.TouchButton('down',{left: 16, bottom: 0}, 32, 32, buttonImage, 6)    // Button Down v                
                new ig.TouchButton('dash',{right: 0, top: 0}, 32, 32, buttonImage, 7)*/     // Button Dash
            ]
		);
    }
    
    var canvas = document.getElementById('canvas');
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    window.addEventListener('resize', function() {
        if (!ig.system) {
            return;
        }
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        if (window.TouchButtons) {
            window.TouchButtons.align();
        }
    }, false);
    
    ig.gameState = JSON.parse(localStorage.getItem('data'));
    if (!ig.gameState) {
        ig.gameState = {
            'coins': 0,
            'continue': 0,
            'item': 0,
            'level': 0,
            'lives': 0,
            'score': 0,
            'highscore': 0,
            'skin': 0
        };
    }
    
    function toStorage() {
        localStorage.setItem('data', JSON.stringify(ig.gameState));
    }
    
    //ig.dev = true;
	//ig.Sound.enabled = true;
	//ig.Sound.use = [  ig.Sound.FORMAT.OGG, ig.Sound.FORMAT.MP3 ];    
 
    ig.System.scaleMode = ig.System.SCALE.CRISP;
    // Start the Game with 60fps, a resolution of 256x224, scaled up by 4
    ig.main('#canvas', TitleScreen, 60, 256, 224, 4, ig.ImpactSplashLoader);

    // For testing with a wider screen resolution
    // ig.main('#canvas', TitleScreen, 60, 464, 224, 4, ig.ImpactSplashLoader);
});
