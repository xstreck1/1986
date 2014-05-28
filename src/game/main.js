game.module(
        'game.main'
        )
        .require(
                'game.objects',
                'game.my_logic'
                )
        .body(function() {
            SceneGame = game.Scene.extend({
                backgroundColor: 0xb9bec7,
                tanks: [],
                signposts: [],
                prague: {},
                current_text: {},
                init: function() {                    
                    map = new Map();
                    this.prague = new Prague(5, 4, 0);
                    addSigns();

                    this.current_text = new game.BitmapText('TIME: 0h', {font: 'Capitalist'});
                    this.stage.addChild(this.current_text);
                    this.current_text.alpha = 0.8;
                    this.current_text.position.set(450, 00);
                    

                    this.addTimer(step_repeat_ms, this.my_timer.bind(this), true);
                    
                    this.gameEnd();
                },
                my_timer: function() {
                    // set text
                    this.current_text.setText("TIME: " + steps_c + "h");

                    // add new tank 
                    if (++steps_c % 2) {
                        position = Math.floor(Math.random() * init_arrows.length);
                        this.tanks.push(new Tank(init_arrows[position][0], init_arrows[position][1], init_arrows[position][2]));
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
                    this.timers = [];
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
                    current_text.position.set(40, 00);
                }
            });

            game.start();
        });
