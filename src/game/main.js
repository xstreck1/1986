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
                init: function() {
                    text = new game.BitmapText('Time:', {font: 'Pixel'});                    
                   
                    this.stage.addChild(text);
                    text.setText('ss');
                    text.updateText();
                    map = new Map();
                    this.prague = new Prague(5, 4, 0);
                    addSigns();
                    /*this.tanks.push(new Tank(13, 1, 0));
                     this.tanks.push(new Tank(13, 3, 0));
                     this.tanks.push(new Tank(13, 5, 0));
                     this.tanks.push(new Tank(13, 7, 0));*/
                    this.tanks.push(new Tank(15, 7, 0));
                    this.tanks.push(new Tank(13, 8, 0));
                    
                    text = new game.BitmapText('text', {font: 'Pixel'});
                    this.stage.addChild(text);

                    this.addTimer(step_repeat_ms, this.my_timer.bind(this), true);
                },
                my_timer: function() {
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
                    game.system.setScene(EndScene);
                }
            });
            
            EndScene = game.Scene.extend({
                init: function() {
                    map = new Map();
                }
            });

            game.start();
            game.system.pauseOnHide = true;
        });
