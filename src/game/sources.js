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
            game.scene.stage.addChild(this.sprite);
        },
        
        update: function() {
            if (this.move_type == 0 ) {
                rot = this.sprite.rotation; 
                this.sprite.position.x -= Math.cos(rot);
                this.sprite.position.y -= Math.sin(rot);
                
                
            } else {
                dir = this.move_type == 1 ? 1 : -1;
                this.sprite.rotation += (Math.PI * dir) * 0.01;
            }
        },
        
        mousedown: function() {
            console.log('mouse');
        }
    });

});



