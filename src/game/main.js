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
                init: function() {
                    map = new Map();
                    prague = new Prague(5, 4, 0);
                    addSigns();
                    /*this.tanks.push(new Tank(13, 1, 0));
                     this.tanks.push(new Tank(13, 3, 0));
                     this.tanks.push(new Tank(13, 5, 0));
                     this.tanks.push(new Tank(13, 7, 0));*/
                    this.tanks.push(new Tank(15, 7, 0));
                    this.tanks.push(new Tank(13, 8, 0));

                    this.addTimer(step_repeat_ms, this.my_timer.bind(this), true);
                },
                my_timer: function() {
                    for (var tank_i = 0; tank_i < this.tanks.length; tank_i++) {
                        if (this.tanks[tank_i].removed)
                            continue;
                        this.tanks[tank_i].correct();
                        for (var sing_i = 0; sing_i < this.signposts.length; sing_i++) {
                            if (areOverlapping(this.tanks[tank_i].sprite, this.signposts[sing_i].sprite)) {
                                this.tanks[tank_i].setMove(this.signposts[sing_i].sprite.rotation);
                                this.signposts[sing_i].rideOver();
                            }
                        }
                    }
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
                }
            });

            game.start();

        });
