game.module(
        'game.main'
        )
        .require(
                'game.objects',
                'game.my_logic'
                )
        .body(function() {
            game.Loader.inject({
                backgroundColor: 0x110000,
                initStage: function() {
                    this.bar = new game.Graphics();
                    this.bar.beginFill(0xffffff);
                    this.bar.drawRect(0, 0, 260, 20);

                    this.bar.position.x = game.system.width / 2 - (260 / 2);
                    this.bar.position.y = game.system.height / 2 - (40 / 2);

                    this.bar.scale.x = this.percent / 100;
                    game.system.stage.addChild(this.bar);
                },
                onPercentChange: function() {
                    this.bar.scale.x = this.percent / 100;
                }
            });

            InitScene = game.Scene.extend({
                backgroundColor: 0x110000,
                init: function() {
                    // Title
                    title_text = new game.BitmapText('1968', {font: 'CapitalistW'});
                    this.stage.addChild(title_text);
                    title_text.scale.set(1.5);
                    setAtCenter(title_text, game.system.width / 2, 20);

                    star = new game.Sprite('star');
                    star.position.set(210, 20);
                    star.scale.set(0.3);
                    this.stage.addChild(star);
                    star2 = new game.Sprite('star');
                    star2.position.set(380, 20);
                    star2.scale.set(0.3);
                    this.stage.addChild(star2);

                    // Click to start
                    volume = new game.BitmapText('click on the screen to start', {font: 'CapitalistW'});
                    this.stage.addChild(volume);
                    setAtCenter(volume, game.system.width / 2, 420);

                    // Volume
                    volume = new game.BitmapText('volume', {font: 'CapitalistW'});
                    this.stage.addChild(volume);
                    setAtCenter(volume, game.system.width / 2, 220);

                    this.back_rect = new game.Graphics();
                    this.back_rect.lineStyle(2, 0xFFFFFF, 1);
                    this.back_rect.beginFill(0x000000);
                    this.back_rect.drawRect(0, 0, 320, 40);
                    this.back_rect.position.x = game.system.width / 2 - (320 / 2);
                    this.back_rect.position.y = 270;
                    this.stage.addChild(this.back_rect);

                    this.bar = new game.Graphics();
                    this.bar.beginFill(0xAA1111);
                    this.bar.drawRect(0, 0, 260, 20);
                    this.bar.position.x = game.system.width / 2 - (260 / 2);
                    this.bar.position.y = 280;
                    game.system.stage.addChild(this.bar);
                    
                    user_volume = game.storage.get('volume') || 0;
                    this.setVolume();
                },
                setVolume: function() {
                    this.bar.scale.x = user_volume;
                    game.storage.set('volume', user_volume);
                },
                click: function(event) {
                    if ((event.global.x > this.back_rect.position.x)
                            && (event.global.x < this.back_rect.position.x + 320)
                            && (event.global.y > this.back_rect.position.y)
                            && (event.global.y < this.back_rect.position.y + 40)) {

                        user_volume = (event.global.x - this.bar.position.x) / 260;
                        user_volume = Math.min(1, Math.max(user_volume, 0));
                        this.setVolume();
                    } else
                        game.system.setScene(MainScene);
                }
            });

            MainScene = game.Scene.extend({
                backgroundColor: 0xb9bec7,
                tanks: [],
                signposts: [],
                init_fields: [[14, 5, 0], [13, 6, 0], [14, 7, 0], [13, 8, 0], [14, 9, 0]],
                init: function() {
                    map = new Map();
                    this.prague = new Prague(5, 4, 0);
                    addSigns();
                    this.setTexts();

                    this.addTimer(step_repeat_ms, this.my_timer.bind(this), true);

                    game.audio.playMusic('my_music', user_volume + 0.000001);
                },
                setTexts: function() {
                    this.highscore = game.storage.get('highscore') || 0;

                    this.best_text = new game.BitmapText('BEST: ' + this.highscore + 'h', {font: 'CapitalistR'});
                    this.stage.addChild(this.best_text);
                    this.best_text.alpha = text_blend;
                    this.best_text.position.set(420, 10);
                    
                    this.current_text = new game.BitmapText('time: 0h', {font: 'CapitalistR'});
                    this.stage.addChild(this.current_text);
                    this.current_text.alpha = text_blend;
                    this.current_text.position.set(420, 50);                    
                },
                my_timer: function() {
                    var finished = false;
                    
                    // set text
                    this.current_text.setText("time: " + steps_c + "h");

                    // add new tank 
                    if (++steps_c % 2) {
                        position = Math.floor(Math.random() * this.init_fields.length);
                        this.tanks.push(new Tank(this.init_fields[position][0],
                                this.init_fields[position][1], this.init_fields[position][2]));
                    }

                    // Remove the used marks
                    for (var sing_i = 0; sing_i < this.signposts.length; sing_i++) {
                        this.signposts[sing_i].clear();
                    }

                    // Correct your position and orient yourself by the signpost
                    for (var tank_i = 0; tank_i < this.tanks.length; tank_i++) {
                        if (this.tanks[tank_i].removed)
                            continue;
                        this.tanks[tank_i].correct();
                        // Check if collides with Prague
                        if (areOverlapping(this.tanks[tank_i].sprite, this.prague.sprite)) {
                            this.gameEnd();
                            finished = true;
                        }

                        // React to the signs
                        for (var sing_i = 0; sing_i < this.signposts.length; sing_i++) {
                            if (areOverlapping(this.tanks[tank_i].sprite, this.signposts[sing_i].sprite)) {
                                this.tanks[tank_i].setMove(this.signposts[sing_i].sprite.rotation);
                                this.signposts[sing_i].rideOver();
                            }
                        }
                    }
                    // Check if you do not overlap with another tank. If so, wait for the other guy or remove him.
                    for (var tank_i = 0; tank_i < this.tanks.length; tank_i++) {
                        if (this.tanks[tank_i].removed)
                            continue;
                        for (var tank_j = 0; tank_j < this.tanks.length; tank_j++) {
                            if (tank_j === tank_i || this.tanks[tank_j].removed)
                                continue;
                            if (areOverlapping(this.tanks[tank_i].sprite, this.tanks[tank_j].sprite)) {
                                if (this.tanks[tank_i].dir !== this.tanks[tank_j].dir)
                                    this.tanks[tank_i].halt();
                                else
                                    this.tanks[tank_i].remove();
                            }
                        }
                    }

                    // If fixed but not used, clear position.
                    for (var sing_i = 0; sing_i < this.signposts.length; sing_i++) {
                        this.signposts[sing_i].fixIfFinished();
                    }
                    
                    if (!finished)
                        game.audio.playSound('tank_sound', false, (user_volume * 0.015) + 0.000001);
                },
                gameEnd: function() {
                    if (steps_c > this.highscore)
                        game.storage.set('highscore', steps_c);
                    game.audio.stopSound('tank_sound');
                    game.audio.stopAll();
                    game.system.setScene(EndScene);
                }
            });

            EndScene = game.Scene.extend({
                backgroundColor: 0x883333,
                init: function() {
                    map = new Map();
                    map.sprite.alpha = 1;
                    map.sprite.blendMode = 8;
                    
                    // Title
                    text = new game.BitmapText('You resisted for ' + steps_c + ' hours', {font: 'CapitalistW'});
                    this.stage.addChild(text);
                    setAtCenter(text, game.system.width / 2, 80);
                    text = new game.BitmapText('before the inevitable capture of Prague.', {font: 'CapitalistW'});
                    this.stage.addChild(text);
                    setAtCenter(text, game.system.width / 2, 120);
                    
                    text = new game.BitmapText('Russian forces will stay until 1991.', {font: 'CapitalistW'});
                    this.stage.addChild(text);
                    setAtCenter(text, game.system.width / 2, 320);
                },
                
                click: function() {
                    game.system.setScene(Credits);
                }
            });
            
            Credits = game.Scene.extend({
                backgroundColor: 0x110000,
                init: function() {
                    text = new game.BitmapText('1968', {font: 'CapitalistW'});
                    text.scale.set(1.25);
                    this.stage.addChild(text);
                    setAtCenter(text, game.system.width / 2, 10);
                    text = new game.BitmapText('JustAConcept', {font: 'CapitalistW'});
                    text.scale.set(1.25);
                    this.stage.addChild(text);
                    setAtCenter(text, game.system.width / 2, 60);
                    pad = 160;
                    text = new game.BitmapText('Author: #PunyOne', {font: 'CapitalistW'});
                    this.stage.addChild(text);
                    setAtCenter(text, game.system.width / 2, 0 + pad);
                    text = new game.BitmapText('Author: #AnimalAlbum', {font: 'CapitalistW'});
                    this.stage.addChild(text);
                    setAtCenter(text, game.system.width / 2, 40 + pad);
                    text = new game.BitmapText('Font: Capitalist by Denis Sherbak', {font: 'CapitalistW'});
                    this.stage.addChild(text);
                    setAtCenter(text, game.system.width / 2, 80 + pad);
                    text = new game.BitmapText('Music: Soft piano by ALECXACE', {font: 'CapitalistW'});
                    this.stage.addChild(text);
                    setAtCenter(text, game.system.width / 2, 120 + pad);
                    text = new game.BitmapText('Sound: cognito perceptu', {font: 'CapitalistW'});
                    this.stage.addChild(text);
                    setAtCenter(text, game.system.width / 2, 160 + pad);
                    
                    text = new game.BitmapText('Click to restart', {font: 'CapitalistW'});
                    this.stage.addChild(text);
                    setAtCenter(text, game.system.width / 2, 420);
                },
                
                click: function() {
                    game.system.setScene(MainScene);
                }
            });

            game.start(InitScene);
        });
