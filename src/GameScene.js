var GameScene = cc.Scene.extend({

    ctor: function () {
        this._super();
        
        this.initPhysics();
        this.initDebugMode();
        this.scheduleUpdate();
    },
    
    initPhysics: function () {
        this.space = new cp.Space();
        this.space.iterations = 10;
        this.space.gravity = cp.v(0, -800);
        this.space.damping = 1;
        this.space.collisionSlop = 0.1;

        this.addPhysicsCircle();
        this.addWallsAndGround();
    },

    addWallsAndGround: function() {
        var bottomWall = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, 0), cp.v(1000, 0), 130);
        this.space.addStaticShape(bottomWall);
    },

    addPhysicsCircle: function() {
        var body = new cp.Body(10, cp.momentForCircle(10, 0, 64, cp.v(0, 0)));
        body.setPos(cp.v(480, 720));

        var shape = new cp.CircleShape(body, 30, cp.v(0, 0));

        this.space.addBody(body);
        this.space.addShape(shape);
    },

    initDebugMode: function() {
        var phDebugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild(phDebugNode, 10);
    },

    update: function(dt) {
        this.space.step(dt);
    }
});