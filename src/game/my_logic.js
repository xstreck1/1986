game.module(
        'game.my_logic'
        ).body(function() {

    hex_width = 639. / 13.;
    var hex_side = (hex_width / Math.cos(Math.PI / 6.)) * 0.5;
    var hex_height = hex_side * 1.5;

    step_time = 0.5;
    step_rotation = Math.PI / 3.;
    step_movement = hex_width;
    step_repeat_ms = 1000 * step_time;

    positionX = function(x, y) {
        return  hex_width * x - ((y % 2) * hex_width * 0.5);
    };
    
    Xposition = function(x, y) {
        return  Math.round((x + ((y % 2) * hex_width * 0.5)) / hex_width);
    };
    
    positionY = function(y) {
        return y * hex_height + (hex_side * 0.25);
    };
    
    Yposition = function(y) {
        return  Math.round((y + hex_side * 0.25) / hex_height);
    };
    
    directionRot = function(dir) {
        return dir * step_rotation;
    };
    
    rotationDir = function(rot) {
        return Math.round(3 * rot / Math.PI);
    };

    placeObject = function(x, y, dir, self, sprite_name) {
        self.sprite = new game.Sprite(sprite_name);
        self.sprite.anchor.set(0.5, 0.5);
        self.sprite.position.set(positionX(x, y), positionY(y));
        self.sprite.rotation = directionRot(dir);
        game.scene.stage.addChild(self.sprite);
        game.scene.addObject(self);
    };
    
    replaceObject = function(x, y, dir, self, sprite_name, orig) {
        self.sprite = new game.Sprite(sprite_name);
        self.sprite.anchor.set(0.5, 0.5);
        self.sprite.position.set(positionX(x, y), positionY(y));
        self.sprite.rotation = directionRot(dir);
        game.scene.stage.addChild(self.sprite);
        arr = game.scene.stage.children;
        i1 = arr.indexOf(orig);
        i2 = arr.indexOf(self.sprite);
        game.scene.stage.children = arr.slice(0,i1).concat(arr[i2],arr.slice(i1+1,i2),arr[i1],arr.slice(i2+1));
        orig.remove();
    };

    var border_arrows = [
        [12, 4, 0], [11, 4, 0], [10, 4, 0], [10, 3, 0], [9, 2, 0], [8, 2, 5],
        [8, 1, 5], [7, 1, 5], [6, 1, 5], [5, 1, 4], [4, 1, 4], [3, 2, 4],
        [2, 2, 4], [2, 3, 3], [1, 4, 3], [1, 5, 3], [1, 6, 3], [2, 7, 2], 
        [2, 8, 2], [3, 9, 2], [3, 10, 2], [4, 10, 2], [5, 10, 2], [6, 10, 1],
        [7, 9, 1], [7, 10, 1], [8, 10, 1], [9, 10, 1], [10, 10, 1], [11, 10, 1],
        [12, 10, 1]
    ];
    
    var init_arrows = [
         [13, 5, 0], [12, 6, 0], [13, 7, 0], [12, 8, 0], [13, 9, 0]
    ];
    
    var inland_arrows = [
        [4,2,4], [5,2,4], [6,2,5], [7,2,5],
        [3,3,3], [4,3,4], [5,3,4], [6,3,5], [7,3,5], [8,3,0], [9,3,0], 
        [2,4,3], [3,4,3], [4,4,3], [6,4,0], [7,4,0], [8,4,0], [9,4,0],
        [2,5,3], [3,5,3], [4,5,2], [5,5,2], [6,5,1], [7,5,1], [8,5,0], [9,5,0], [10,5,0], [11,5,0], [12,5,0],
        [2,6,2], [3,6,2], [4,6,2], [5,6,2], [6,6,1], [7,6,1], [8,6,1], [9,6,0], [10,6,0], [11,6,0],
        [3,7,2], [4,7,2], [5,7,2], [6,7,1], [7,7,1], [8,7,1], [9,7,1], [10,7,1], [11,7,0], [12,7,0],
        [3,8,2], [4,8,2], [5,8,2], [6,8,1], [7,8,1], [8,8,1], [9,8,1], [10,8,1], [11,8,1], 
        [4,9,2], [5,9,2], [6,9,1], [8,9,1], [9,9,1], [10,9,1], [11,9,1], [12,9,1]
    ];

    addSigns = function() {
        for (var i = 0; i < border_arrows.length; i++)
            game.scene.signposts.push(
                    new SignPost(border_arrows[i][0], border_arrows[i][1],
                            border_arrows[i][2], 'fixed'));
                            
        for (var i = 0; i < init_arrows.length; i++)
            game.scene.signposts.push(
                    new SignPost(init_arrows[i][0], init_arrows[i][1],
                            init_arrows[i][2], 'start'));
                            
        for (var i = 0; i < inland_arrows.length; i++)
            game.scene.signposts.push(
                    new SignPost(inland_arrows[i][0], inland_arrows[i][1],
                            inland_arrows[i][2], 'inland'));
    };
    
    areOverlapping = function(A, B) {
        return (Math.abs(A.position.x - B.position.x) + 
                Math.abs(A.position.y - B.position.y)) < 20;
    }
});