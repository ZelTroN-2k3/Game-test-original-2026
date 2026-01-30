ig.module( 'game.levels.StartEnd' )
.requires( 'impact.image' )
.defines(function(){
LevelStartEnd=/*JSON[*/{
	"entities": [],
	"layer": [
		{
			"name": "back",
			"width": 1,
			"height": 1,
			"linkWithCollision": false,
			"visible": true,
			"tilesetName": "media/back1.png",
			"repeat": true,
			"preRender": false,
			"distance": "1",
			"tilesize": 256,
			"foreground": false,
			"data": [
				[1]
			]
		},
		{
			"name": "layer_0",
			"width": 16,
			"height": 14,
			"linkWithCollision": false,
			"visible": true,
			"tilesetName": "media/tiles.png",
			"repeat": false,
			"preRender": false,
			"distance": 1,
			"tilesize": 16,
			"foreground": false,
			"data": [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,39,0,0,0],
				[0,7,27,0,17,0,28,28,0,0,8,48,49,50,18,0],
				[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
				[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13],
				[13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13]
			]
		},
		{
			"name": "collision",
			"width": 16,
			"height": 14,
			"linkWithCollision": false,
			"visible": true,
			"tilesetName": "",
			"repeat": false,
			"preRender": false,
			"distance": 1,
			"tilesize": 16,
			"foreground": false,
			"data": [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			]
		}
	]
}/*]JSON*/;
LevelStartEndResources=[new ig.Image('media/back1.png'), new ig.Image('media/tiles.png')];
});