game.module(
        'game.objects'
        ).require(
        'game.my_logic'
        ).body(function() {
    game.addAsset('background.png', 'back');
    game.addAsset('tank.png', 'tank');
    game.addAsset('arrow_blue.png', 'blue_arrow');
    game.addAsset('arrow_white.png', 'white_arrow');
    game.addAsset('prague.png', 'prague');
    
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
        }
    });

    SignPost = game.Class.extend({
        x: 0,
        y: 0,
        dir: 0,
        turnable: true,
        init: function(x, y, dir, turnable) {
            this.x = x;
            this.y = y;
            this.dir = dir;
            this.turnable = turnable;
            placeObject(x, y, dir, this, turnable ? 'blue_arrow' : 'white_arrow');
        }
    });

    Tank = game.Class.extend({
        move_type: 0,
        x: 0,
        y: 0,
        dir: 0,
        init: function(x, y, dir) {
            this.x = x;
            this.y = y;
            this.dir = dir;
            placeObject(x, y, dir, this, 'tank');
        },
        update: function() {
            if (this.move_type === 0) {
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
        
        changeType: function() {
            this.move_type = (this.move_type + 1) % 3;
        },
        
        setMove: function(other_rot) {
            var diff = other_rot - this.sprite.rotation;
            if (Math.min(Math.abs(diff), Math.abs((Math.PI * 2) - Math.abs(diff))) < Math.PI / 4.)
                this.move_type = 0;
            else if (diff * -1 > Math.PI || (diff > 0 && diff < Math.PI))
                this.move_type = 1;
            else
                this.move_type = 2;                
        }
    });

});



