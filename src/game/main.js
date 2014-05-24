game.module(
    'game.main'
)
.require(
    'game.sources',
    'game.my_logic'
)
.body(function() {
    

SceneGame = game.Scene.extend({
    backgroundColor: 0xb9bec7,
    movement: 0,
    
    init : function() {        
        map = new Map();
        tank = new Tank();
        tank.sprite.position.set(610,175);
    },
    
    update : function() {
        tank.update();
    },
    
    mousedown: function() {
        tank.move_type = (tank.move_type + 1) % 3;
    }
});

game.start();

});
