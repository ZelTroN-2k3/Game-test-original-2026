ig.module(
    'game.system.game-sound'
)
.requires(
    'impact.game', 'impact.sound'
)
.defines(function() {

    ig.Game.inject({
            // Sound effects
            sndStart: new ig.Sound('media/sounds/coin_collect_07.*', false),    // Game start sound
            sndLose: new ig.Sound('media/sounds/success_01.*', false),          // Game over sound
            sndArch: new ig.Sound('media/sounds/success_04.*', false),          // Archway sound
            sndMenu: new ig.Sound('media/sounds/button_press_14.*', false),     // Menu selection sound
            sndBounce: new ig.Sound('media/sounds/cute_bounce_04.*', false),    // Bounce sound
            sndBrick: new ig.Sound('media/sounds/block_smash_rnd_03.*', false), // Brick break sound
            sndCoin: new ig.Sound('media/sounds/coin_collect_06.*', false),     // Coin collect sound
            sndHit: new ig.Sound('media/sounds/cute_impact_02.*', false),       // Player hit sound
            sndPickup: new ig.Sound('media/sounds/powerup_17.*', false),        // Power-up collect sound
            sndFail: new ig.Sound('media/sounds/player_death_02.*', false),     // Failure sound
            sndWin: new ig.Sound('media/sounds/success_05.*', false),           // Level complete sound
            sndFireball: new ig.Sound('media/sounds/enemy_hit_01.*', false),    // Fireball sound
            sndJump: new ig.Sound('media/sounds/clean_short_jump_03.*', false), // Jump sound
            sndLive: new ig.Sound('media/sounds/collect_14.*', false),          // Extra life sound
            sndBounce: new ig.Sound('media/sounds/bounce.*', false),            // Trampoline bounce sound
            sndImpact: new ig.Sound('media/sounds/thwomp.*', false),            // Thwomp impact sound
            
            // Music tracks
            musicIntro:  new ig.Sound('media/music/Win.*', false),                          // Intro music
            musicEndGame:  new ig.Sound('media/music/Cutscene_Intro_Fanfare.*', false),     // End game music
            musicCredit:  new ig.Sound('media/music/Cutscene_1.*', false),                  // Credit music
            musicTrack1:  new ig.Sound('media/music/Main.*', false),                        // Main music
            musicTrack2:  new ig.Sound('media/music/World_1.*', false),                     // Secondary music
            musicTrack3:  new ig.Sound('media/music/World_2.*', false),                     // Tertiary music
            musicTrack4:  new ig.Sound('media/music/World_3.*', false),                     // Quaternary music

        // Music setup  
        setMusic: function() {

            ig.music.add(this.musicIntro, 'intro');     // Intro music
            ig.music.add(this.musicEndGame, 'endgame'); // End game music
            ig.music.add(this.musicCredit, 'credit');   // Credit music
            ig.music.add(this.musicTrack1, 'track1');   // Main music
            ig.music.add(this.musicTrack2, 'track2');   // Secondary music
            ig.music.add(this.musicTrack3, 'track3');   // Tertiary music
            ig.music.add(this.musicTrack4, 'track4');   // Quaternary music

            ig.music.volume = .5;
            ig.soundManager.volume = .5;
            ig.music.loop = true;
        },

        // Set music track based on level
        setMusicTrack: function(level) {
            /*if (level == 'worldmap' || level == 'overworld') {
                ig.music.play('overworldBGM');
            } else if (level == 'desert') {
                ig.music.play('desertBGM');
            } else if (level == 'mountain') {
                ig.music.play('mountainBGM');
            } else if (level == 'ice') {
                ig.music.play('iceBGM');
            } else if (level == 'forest') {
                ig.music.play('forestBGM');
            } else if (level == 'temple') {
                ig.music.play('templeBGM');
            } else if (level == 'boss') {
                ig.music.play('bossBGM');
            } else if (level == 'cave') {
                ig.music.play('caveBGM');
            } else if (level == 'guardian') {
                ig.music.play('guardianBGM');
            } else if (level == 'sadness') {
                ig.music.play('sadnessBGM');
            } else if (level == 'storm') {
                ig.music.play('stormBGM');
            }*/
        }
    });
});