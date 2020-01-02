module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	pages: {
		admin: {
			pageName: 'admin',
			// entry for the page
			entry: 'src/pages/Admin/main.js',
			// the source template
			template: 'public/index.html',
			// output as dist/index.html
			filename: 'admin.html',
			// when using title option,
			// template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
			title: 'Admin Page'
		},
		game: {
			pageName: 'game',
			// entry for the page
			entry: 'src/pages/Game/main.js',
			// the source template
			template: 'public/index.html',
			// output as dist/index.html
			filename: 'game.html',
			// when using title option,
			// template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
			title: 'Game Page'
		}
	},
	chainWebpack: config => {
		const oneOfsMap = config.module.rule('scss').oneOfs.store
		oneOfsMap.forEach(item => {
			item
				.use('sass-resources-loader')
				.loader('sass-resources-loader')
				.options({
					resources: 'src/assets/scss/variables.scss'
				})
				.end()
		})

	}
}