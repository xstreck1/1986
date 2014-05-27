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
                    this.tanks.push(new Tank(13, 9, 0));

                    this.addTimer(step_repeat_ms, this.my_timer.bind(this), true);
                },
                my_timer: function() {
                    for (var tank_i = 0; tank_i < this.tanks.length; tank_i++) {
                        this.tanks[tank_i].correct();
                        for (var sing_i = 0; sing_i < this.signposts.length; sing_i++) {
                            if (areOverlapping(this.tanks[tank_i].sprite, this.signposts[sing_i].sprite)){
                                this.tanks[tank_i].setMove(this.signposts[sing_i].sprite.rotation);
                            }
                        }
                    }
                }
            });

            game.start();

        });
