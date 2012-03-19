config.init({
	meta: {
		banner: '/*arch.js - @jontyy - MIT licensed - https://github.com/Jontyy/arch.js*/'
	},
	lint: {
		files: ['src/*.js']
	},
	concat: {
		'arch.js': ['src/arch.js', 'src/core.js', 'src/mediator.js', 'src/sandbox.js', 'src/module.js'],
	},
	min: {
		'arch.min.js': ['<banner>', 'arch.js']
	},
	watch: {
		files: './src/*',
		tasks: 'lint concat min' 
	},
	uglify: {},
	jshint: {
		options: {
			expr: true,
			browser: true,
			strict: true,
			undef : true,
			curly : true,
			eqeqeq : true,
			forin : true,
			immed : true,
			latedef : true,
			noarg : true,
			noempty:true,
			regexp:true,
			trailing : true,
			node : true,
			devel:true
		}
	}
});
task.registerTask('default', 'lint concat min');