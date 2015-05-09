

sendPosition = function(position) {
    chatStream.emit('position', position);
};

sendAngular = function(angular) {
    chatStream.emit('angular', angular);
};

Template.wrapper.helpers({
    games: function() {
        var height = 600,
            width = 800;

        var game = new Phaser.Game(width, height, Phaser.AUTO, 'games', {preload: preload, create: create, update: update });

        function preload() {
            game.load.image('flyer', 'images/phaser-dude.jpg');
        }

        function create() {
            var self = this;

            chatStream.on('position', function(message) {
                self.player.position.x = message.x;
                self.player.position.y = message.y;
            });

            chatStream.on('angular', function(message) {
                self.player.angle = message.angle;
            });

            /* физика */
            game.physics.startSystem(Phaser.Physics.Arcade);

            /* фон */
            game.stage.backgroundColor = '#ffffff';

            /* player */
            this.player = game.add.sprite(0, 0, 'flyer');
            this.player.anchor.setTo(0.5, 0.5);

            game.physics.enable(this.player, Phaser.Physics.ARCADE);

            this.player.body.collideWorldBounds = true;
            this.player.body.bounce.set(1);

            console.log(this.player);
        }

        function update() {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
            this.player.body.angularVelocity = 0;



            if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.player.body.angularVelocity = -100;

                sendAngular({
                    angle: this.player.angle
                });
            } else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.player.body.angularVelocity = 100;

                sendAngular({
                    angle: this.player.angle
                });
            } else {
                this.player.body.velocity.x = 0;
            }

            if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                game.physics.arcade.velocityFromAngle(this.player.angle, 200, this.player.body.velocity);

                sendPosition({
                    x: this.player.position.x,
                    y: this.player.position.y
                });
            }

            if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
                game.physics.arcade.velocityFromAngle(this.player.angle, -100, this.player.body.velocity);

                sendPosition({
                    x: this.player.position.x,
                    y: this.player.position.y
                });
            }
        }
    }
});

