var GameScene = cc.Scene.extend({
    winsize : null,
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

        this.winsize = cc.director.getWinSize();

        this.addPhysicsCircle();
        this.addPhysicsBox();
        this.addWallsAndGround();
        this.addCollisionHandler();
    },

    addWallsAndGround: function() {
        var bottomWall = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, 0), cp.v(this.winsize.width, 0), 100);
        this.space.addStaticShape(bottomWall);
    },

    addPhysicsCircle: function() {
        var sprite = new cc.PhysicsSprite(res.orange); // PhysicsSprite 객체 생성

        var body = new cp.Body(10, cp.momentForCircle(10, 0, 64, cp.v(0, 0)));
        body.setPos(cp.v(this.winsize.width/2, 720));

        var shape = new cp.CircleShape(body, 64, cp.v(0, 0));
        shape.setCollisionType(2000);
        shape.sprite = sprite;

        this.space.addBody(body);
        this.space.addShape(shape);

        sprite.setBody(body); // Sprite에 body 설정
        this.addChild(sprite);
    },

    addPhysicsBox: function() {
        var sprite = new cc.PhysicsSprite(res.crate);

        var body = new cp.Body(10, cp.momentForBox(10, 128, 128));
        body.setPos(cp.v(this.winsize.width/2, 1000));

        var shape = new cp.BoxShape(body, 128, 128);
        shape.setCollisionType(1000);
        shape.sprite = sprite;

        this.space.addBody(body);
        this.space.addShape(shape);

        sprite.setBody(body);
        this.addChild(sprite);
    },

    addCollisionHandler: function() {
        var beginHandler = function(arbiter, space) {

            var contactingShape = arbiter.getA();
            var contactedShape = arbiter.getB();

            space.addPostStepCallback(function () {
                space.removeShape(contactingShape);
                space.removeBody(contactingShape.body);
                contactingShape.sprite.removeFromParent();
            });

            space.addPostStepCallback(function () {
                space.removeShape(contactedShape);
                space.removeBody(contactedShape.body);
                contactedShape.sprite.removeFromParent();
            });

            return true;
        };

        var preSolveHandler = function(arbiter, space) {
            return true;
        };

        var postSolveHandler = function(arbiter, space) {
        };

        var separateHandler = function(arbiter, space) {
        };

        this.space.addCollisionHandler(1000, 2000, beginHandler, preSolveHandler,
            postSolveHandler, separateHandler);
    },

    initDebugMode: function() {
        var phDebugNode = new cc.PhysicsDebugNode(this.space);
        this.addChild(phDebugNode, 10);
    },

    update: function(dt) {
        this.space.step(dt);
    }
});