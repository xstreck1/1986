game.module(
        'game.main'
        )
        .require(
                'game.objects',
                'game.my_logic'
                )
        .body(function() {
            game.Loader.inject({
                backgroundColor: 0x00000000,
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

            SceneGame = game.Scene.extend({
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

                    game.audio.playMusic('my_music');
                    this.gameEnd();
                },
                setTexts: function() {
                    this.current_text = new game.BitmapText('time: 0h', {font: 'Capitalist'});
                    this.stage.addChild(this.current_text);
                    this.current_text.alpha = text_blend;
                    this.current_text.position.set(450, 30);

                    this.highscore = game.storage.get('highscore') || 0;

                    this.best_text = new game.BitmapText('BEST: ' + this.highscore + 'h', {font: 'Capitalist'});
                    this.stage.addChild(this.best_text);
                    this.best_text.alpha = text_blend;
                    this.best_text.position.set(450, 00);
                },
                my_timer: function() {
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
                },
                gameEnd: function() {
                    for (var timer_t = 0; timer_t < this.timers.length; timer_t ++)
                        this.timers[timer_t].pause();
                    if (steps_c >  this.highscore)
                        game.storage.set('highscore', steps_c);
                    game.system.setScene(EndScene);
                }
            });

            EndScene = game.Scene.extend({
                backgroundColor: 0x883333,
                init: function() {
                    map = new Map();
                    map.sprite.alpha = 1;
                    map.sprite.blendMode = 8;
                    current_text = new game.BitmapText('elapsed: ' + steps_c, {font: 'CapitalistW'});
                    this.stage.addChild(current_text);
                    current_text.alpha = 0.8;
                    current_text.style.align = 'right';
                    current_text.position.set(0, 0);
                }
            });

            game.start();
        });
