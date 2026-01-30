ig.module(
    'game.menus'
)
.requires(
    'impact.font'
)
.defines(function() {

    MenuItem = ig.Class.extend({
        getText: function() {
            return '';
        },
        ok: function() {
            (document.getElementById("canvas")).style.cursor = 'none';
        },
        click: function() {
            this.ok();
        }
    });

    // Generic Menu Class
    Menu = ig.Class.extend({
        font: new ig.Font('media/fonts/hall-fetica-bold.png'),
        fontSelected: new ig.Font('media/fonts/hall-fetica-bold2.png'),
        fontTitle: new ig.Font('media/fonts/hall-fetica-bold.png'),

        clearColor: null,
        current: 0,
        dist: 16,
        itemClasses: [],
        items: [],
        name: null,
        y: 0,

        init: function() {
            this.font.letterSpacing = 0;
            this.fontSelected.letterSpacing = 0;
            this.fontTitle.letterSpacing = 0;
            for (var i = 0; i < this.itemClasses.length; i++) {
                this.items.push(new this.itemClasses[i]());
            }
            (document.getElementById("canvas")).style.cursor = 'default';
        },

        update: function() {
            if (ig.input.pressed('up') && this.current > 0) {
                this.current--;
                ig.game.sndMenu.play();
            }
            if (ig.input.pressed('down') && this.current < this.items.length - 1) {
                this.current++;
                ig.game.sndMenu.play();
            }
            if (ig.input.pressed('start')) {
                this.items[this.current].ok();
                ig.game.sndMenu.play();
            }
            if (ig.input.pressed('click')) {
                var ys = this.y;
                var xs = ig.system.width / 2;
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    var w = this.font.widthForString(item.getText()) / 2;
                    if (ig.input.mouse.x >= xs - w && ig.input.mouse.x < xs + w && ig.input.mouse.y >= ys && ig.input.mouse.y < ys + this.font.height) {
                        ig.game.sndMenu.play();
                        if (this.current == i) {
                            item.click();
                            break;
                        } else {
                            this.current = i;
                        }
                    }
                    ys += this.dist;
                }
            }
        },

        draw: function() {
            if (this.clearColor) {
                ig.system.context.fillStyle = this.clearColor;
                ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
            }
            var xs = ig.system.width / 2;
            var ys = this.y;
            if (this.name) {
                this.fontTitle.draw(this.name, xs, ys - this.dist, ig.Font.ALIGN.CENTER);
            }
            for (var i = 0; i < this.items.length; i++) {
                var t = this.items[i].getText();
                if (i == this.current) {
                    this.fontSelected.draw(t, xs, ys, ig.Font.ALIGN.CENTER);
                } else {
                    this.font.draw(t, xs, ys, ig.Font.ALIGN.CENTER);
                }
                ys += this.dist;
            }
        }
    });

    // continue menu items 
    ContinueItemYes = MenuItem.extend({
        getText: function() {
            return 'Yes';
        },
        ok: function() {
            this.parent();
            ig.game.continue();
        }
    });

    // continue menu items 
    ContinueItemNo = MenuItem.extend({
        getText: function() {
            return 'No';
        },
        ok: function() {
            this.parent();
            ig.system.setGame(TitleScreen);
        }
    });

    // continue menu
    ContinueMenu = Menu.extend({
        init: function() {
            this.parent();
            this.name = 'Continue?';
            this.y = 112;
        },
        itemClasses: [ContinueItemYes, ContinueItemNo]
    });

    // pause menu items
    PauseItemResume = MenuItem.extend({
        getText: function() {
            return 'Resume';
        },
        ok: function() {
            this.parent();
            ig.game.gameUnpause();
        }
    });

    // pause menu items
    PauseItemExit = MenuItem.extend({
        getText: function() {
            return 'Exit';
        },
        ok: function() {
            this.parent();
            ig.music.stop();
            ig.system.setGame(TitleScreen);
        }
    });

    // pause menu
    PauseMenu = Menu.extend({
        init: function() {
            this.parent();
            this.y = 108;
        },
        itemClasses: [PauseItemResume, PauseItemExit]
    });

    // title start menu items
    TitleItemStart = MenuItem.extend({
        getText: function() {
            return 'Start Game';
        },
        ok: function() {
            ig.system.setGame(SelectScreen);
        }
    });

    // title continue menu items
    TitleItemContinue = MenuItem.extend({
        getText: function() {
            return 'Continue';
        },
        ok: function() {
            this.parent();
            ig.game.gameStart();
        }
    });

    // title new game menu items
    /*TitleItemNewGame = MenuItem.extend({
        getText: function() {
            return 'New Game';
        },
        ok: function() {
            this.parent();
            ig.gameState.level = 0;
            ig.game.gameStart();
        }
    });*/

    // title quit menu items
    TitleItemQuit = MenuItem.extend({
        getText: function() {
            return 'Quit';
        },
        ok: function() {
            this.parent();

            // CAS 1 : On est sur le Steam Deck / Application PC (NW.js)
            if (typeof nw !== 'undefined') {
                nw.Window.get().close();
            }
            // CAS 2 : On est sur le Web (Chrome, Firefox, Brave...)
            else {
                // Comme on ne peut pas fermer, on redirige vers une autre page
                // Remplacez l'adresse ci-dessous par ce que vous voulez
                window.location.href = "https://www.google.com"; 
                
                // Ou alternativement, afficher un message d'alerte :
                // alert("Merci d'avoir joué ! Vous pouvez fermer l'onglet.");
            }
        }
    });

    // title menu
    TitleMenu = Menu.extend({
        init: function() {
            this.parent();
            this.y = 120;
        },
        itemClasses: [TitleItemStart, TitleItemContinue/*, TitleItemNewGame*/]
    });

    // title menu 2 (with quit)
    TitleMenu2 = Menu.extend({
        init: function() {
            this.parent();
            this.y = 120;
        },        
        itemClasses: [TitleItemStart, TitleItemContinue/*, TitleItemNewGame*/, TitleItemQuit]
    });
});