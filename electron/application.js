const fs       = require('fs');
const path     = require('path');

const electron = require('electron');
const diskdb   = require('diskdb');

const { EventListeners } = require('./listeners.js');

class Application
{
	constructor()
	{
		this.debug = false;//process.env.NODE_ENV == 'debug';

		this.electron = electron;

		this.windows  = {};

		let relativeDbPath = this.debug ? 'debugData' : 'data';

		this.paths    = {
			root: path.normalize(path.join(__dirname, '..')),
			db: path.normalize(path.join(__dirname, '..', relativeDbPath)),
			dist: path.normalize(path.join(__dirname, '..', 'dist/vue'))
		};

		this.events = new EventListeners();

		this.initAppEvents();
	}

	run()
	{
		this.initDatabase();
		this.initFrontendEvents();

		this.createWindow('admin');
		this.createWindow('game');
	}

	initFrontendEvents()
	{
		const eventsList = [
			'getData',
			'createGroup',
			'saveGroup',
			'deleteGroup',
			'createQuestion',
			'saveQuestion',
			'deleteQuestion',
			'createTeam',
			'saveTeam',
			'deleteTeam',
			'addTeamScore',
			'saveOtherSettings',
			'questions',
			'action',
			'showPage',
		];

		for(let ev of eventsList)
			this.electron.ipcMain.on(ev, (event, arg) => this.events[ev](event, this, arg));
	}

	initDatabase()
	{
		if (!fs.existsSync(this.paths.db))
			fs.mkdirSync(this.paths.db, { recursive: true });

		diskdb.connect(this.paths.db, ['teams', 'groups', 'questions', 'settings']);

		let settings = diskdb.settings.findOne();

		if(!settings)
			diskdb.settings.save({timeout: '60'});
		else if(!parseFloat(settings.timeout))
			diskdb.settings.update(settings, {timeout: '60'});

		this.db = {teams: diskdb.teams, groups: diskdb.groups, questions: diskdb.questions, settings: diskdb.settings};
	}

	// инициализация событий создания, закрытия приложения
	initAppEvents()
	{
		this.electron.app.on('ready', () => this.run());

		this.electron.app.on(
			'window-all-closed',
			() =>
			{
				if (process.platform !== 'darwin') this.electron.app.quit();
			}
		);

		this.electron.app.on(
			'activate',
			() =>
			{
				if (this.windows.admin === null)
					this.createWindow('admin');

				if (this.windows.game === null)
					this.createWindow('game');
			}
		);
	}

	// футкция создания нового окна
	createWindow (name)
	{
		let display = this.electron.screen.getPrimaryDisplay(),
			size = display.size,
			width = size.width/2,
			xPos = (name == 'admin' ? 0 : width);

		let wnd = new this.electron.BrowserWindow({
			width: width,
			height: 600,
			x: xPos,
			y: 0,
			webPreferences:
			{
				nodeIntegration: true
			}
		});

		wnd.loadFile(path.join(this.paths.dist, `${name}.html`));

		// Open the DevTools
		if(this.debug)
			wnd.webContents.openDevTools()

		wnd.on(
			'closed',
			() =>
			{
				wnd = null
			}
		);

		this.windows[name] = wnd;
	}
}

module.exports = Application;