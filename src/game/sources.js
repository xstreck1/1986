game.module(
        'game.sources'
        ).require(
        'game.my_logic'
        ).body(function() {
    game.addAsset('hex_some.jpg');
    game.addAsset('tank.jpg');

    Map = game.Class.extend({
        init: function() {
            this.sprite = new game.Sprite('hex_some.jpg');
            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.position.set(game.system.width / 2, game.system.height / 2);
            game.scene.stage.addChild(this.sprite);
        }
    });
    
    Tank = game.Class.extend({
        move_type : 0,
        
        init: function() {
            this.sprite = new game.Sprite('tank.jpg');
            this.sprite.anchor.set(0.5, 0.5);
            this.sprite.position.set(300,300);
            game.scene.stage.addChild(this.sprite);
            game.scene.addObject(this);
        },
        
        update: function() {
            if (this.move_type == 0 ) {
                rot = this.sprite.rotation; 
                step_lenght = ( game.system.delta / step_time) * step_movement;
                this.sprite.position.x -= Math.cos(rot) * step_lenght;
                this.sprite.position.y -= Math.sin(rot) * step_lenght;
                
                
            } else {
                dir = this.move_type == 1 ? 1 : -1;
                this.sprite.rotation +=  dir * ( game.system.delta / step_time) * step_rotation;
                this.sprite.rotation = this.sprite.rotation % (Math.PI * 2);
                console.log(this.sprite.rotation);
            }
        },
        
        mousedown: function() {
            console.log('mouse');
        }
    });

});



