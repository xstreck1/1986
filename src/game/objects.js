game.module(
        'game.objects'
        ).require(
        'game.my_logic',
        'engine.audio'
        ).body(function() {
    game.addAsset('background.png', 'back');
    game.addAsset('tank.png', 'tank');
    game.addAsset('arrow_green.png', 'inland');
    game.addAsset('arrow_orange.png', 'turned');
    game.addAsset('arrow_red.png', 'fixed');
    game.addAsset('arrow_white.png', 'finished');
    game.addAsset('prague.png', 'prague');
    game.addAsset('font.fnt');
    game.addAsset('font_b.fnt');
    game.addAsset('font_w.fnt');
    game.addAudio('hall_of_the_mountain_king.mp3', 'my_music');
    
    Map = game.Class.extend({
        init: function() {
            this.sprite = new game.Sprite('back');
            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.position.set(game.system.width / 2, game.system.height / 2);
            game.scene.stage.addChild(this.sprite);
        }
    });

    Prague = game.Class.extend({
        init: function(x, y, dir) {
            placeObject(x, y, dir, this, 'prague');
            this.sprite.blendMode = 5;   
        }
    });

    SignPost = game.Class.extend({
        x: 0,
        y: 0,
        dir: 0,
        orig_dir: 0,
        state: 'none',
        used: false,
        
        init: function(x, y, dir, state) {
            this.x = x;
            this.y = y;
            this.dir = dir;
            this.orig_dir = dir;
            this.state = state;
            placeObject(x, y, dir, this, state);
            this.sprite.blendMode = 2;      
            this.sprite.interactive = state === 'inland';
            this.sprite.click = this.click.bind(this);
        },
        
        click: function(event) {
            dist = Math.sqrt(
                   Math.pow(positionY(this.y) - event.global.y, 2) +
                   Math.pow(positionX(this.x, this.y)  - event.global.x, 2));
            if (dist > (hex_width / 2)) 
                return;

            if (this.state === 'inland') {
                this.state = 'turned';
                this.sprite.setTexture('turned');
            }
            this.dir = (this.dir + 1) % 6;
            this.sprite.rotation = directionRot(this.dir);
            this.sprite.interactive = true;
            this.sprite.click = this.click.bind(this);
            this.sprite.blendMode = 2;   
        },
        
        clear: function() {
            this.used = false;
        },
        
        rideOver: function() {
            if (this.state === 'turned') {
                this.sprite.setTexture('fixed');
                this.sprite.interactive = false;
                this.sprite.blendMode = 2;   
                this.state = 'fixed';
            }
            this.used = true;
        },
        
        fixIfFinished: function() {
            if (this.dir !== this.orig_dir && this.state === 'fixed' && !this.used) {
                this.sprite.setTexture('finished');
                this.sprite.interactive = false;
                this.sprite.blendMode = 2;   
                this.state = 'finished';
                this.dir = this.orig_dir;
                this.sprite.rotation = directionRot(this.dir);
            }
        }
    });

    Tank = game.Class.extend({
        move_type: 3,
        x: 0,
        y: 0,
        dir: 0,
        removed: false,
        
        init: function(x, y, dir) {
            this.x = x;
            this.y = y;
            this.dir = dir;
            placeObject(x, y, dir, this, 'tank');
        },
        update: function() {
            if (this.move_type === 0)
                return;
            else if (this.move_type === 3) {
                rot = this.sprite.rotation;
                step_lenght = (game.system.delta / step_time) * step_movement;
                this.sprite.position.x -= Math.cos(rot) * step_lenght;
                this.sprite.position.y -= Math.sin(rot) * step_lenght;


            } else {
                dir = this.move_type === 1 ? 1 : -1;
                this.sprite.rotation += dir * (game.system.delta / step_time) * step_rotation;
                while (this.sprite.rotation < 0.)
                    this.sprite.rotation += (Math.PI * 2);
                this.sprite.rotation = this.sprite.rotation % (Math.PI * 2);
            }
        },

        correct: function() {
            this.dir = rotationDir(this.sprite.rotation);
            this.sprite.rotation = directionRot(this.dir);
            this.y = Yposition(this.sprite.position.y);
            this.sprite.position.y = positionY(this.y);
            this.x = Xposition(this.sprite.position.x, this.y);
            this.sprite.position.x = positionX(this.x, this.y);
        },
        setMove: function(other_rot) {
            var diff = other_rot - this.sprite.rotation;
            if (Math.min(Math.abs(diff), Math.abs((Math.PI * 2) - Math.abs(diff))) < Math.PI / 4.) {
                this.move_type = 3;
            } else if (diff * -1 > Math.PI || (diff > 0 && diff < Math.PI))
                this.move_type = 1;
            else
                this.move_type = 2;
        },
        remove: function() {
            this.removed = true;
            this.sprite.remove();
        },
        halt: function() {
            if (this.move_type === 3)
                this.move_type = 0;
        }
    });

});



