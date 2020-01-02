class EventListeners
{
	/**
	 * функции для обработки групп
	 */
	createGroup(event, app, group)
	{
		let newGroup = app.db.groups.save(group);
		app.windows.game.webContents.send('update', true);
		event.returnValue = newGroup;
	}

	saveGroup(event, app, group)
	{
		app.db.groups.update({_id: group._id}, group, {multi: false, upsert: false});
		app.windows.game.webContents.send('update', true);
		event.returnValue = group;
	}

	deleteGroup(event, app, group)
	{
		// при удалении группы удаляем и вопросы в этой группе
		app.db.groups.remove({_id: group._id});
		app.db.questions.remove({group_id: group._id});
		app.windows.game.webContents.send('update', true);
		event.returnValue = true;
	}

	/**
	 * функции для обработки вопросов
	 */
	createQuestion(event, app, question)
	{
		let newQuestion = app.db.questions.save(question);
		app.windows.game.webContents.send('update', true);
		event.returnValue = newQuestion;
	}

	saveQuestion(event, app, question)
	{
		app.db.questions.update({_id: question._id}, question, {multi: false, upsert: false});
		app.windows.game.webContents.send('update', true);
		event.returnValue = question;
	}

	deleteQuestion(event, app, question)
	{
		app.db.questions.remove({_id: question._id});
		app.windows.game.webContents.send('update', true);
		event.returnValue = true;
	}

	/**
	 * функции для обработки списка команд
	 */
	createTeam(event, app, team)
	{
		let newTeam = app.db.teams.save(team);
		app.windows.game.webContents.send('update', true);
		event.returnValue = newTeam;
	}

	saveTeam(event, app, team)
	{
		app.db.teams.update({_id: team._id}, team, {multi: false, upsert: false});
		app.windows.game.webContents.send('update', true);
		event.returnValue = team;
	}

	deleteTeam(event, app, teamId)
	{
		app.db.teams.remove({_id: teamId});
		app.windows.game.webContents.send('update', true);
		event.returnValue = teamId;
	}

	addTeamScore(event, app, data)
	{
		app.db.teams.update({_id: data.id}, {score: data.score}, {multi: false, upsert: false});
		app.windows.game.webContents.send('addTeamScore', data);
		event.returnValue = app.db.teams.findOne({_id: data.id});
	}

	//сохранение других настроек
	saveOtherSettings(event, app, data)
	{
		let newSettings;

		if(typeof data['_id'] === 'undefined')
		{
			newSettings = app.db.settings.save(data);
			event.returnValue = newSettings;
			return;
		}

		app.db.settings.update({_id: data['_id']}, data, {multi: false, upsert: false});
		app.windows.game.webContents.send('update', true);
		event.returnValue = true;
	}

	getData(event, app, data)
	{
		let loadedSettings = app.db.settings.findOne();

		if(typeof loadedSettings == 'undefined')
			loadedSettings = {};

		let returnData = {
			teams: app.db.teams.find(),
			groups: app.db.groups.find(),
			settings: loadedSettings
		};

		for(let group of returnData.groups)
			group.questions = app.db.questions.find({group_id: group._id});

		event.returnValue = returnData;
	}

	/**
	 * функции для обработки событий с вкладки "игра" - показ экранов, выбор вопросов, начисление баллов и т.д.
	 */
	questions(event, app, arg)
	{
		app.windows.game.webContents.send('questions', arg);
	}

	action(event, app, arg)
	{
		app.windows.game.webContents.send('action', arg);
	}

	showPage(event, app, arg)
	{
		app.windows.game.webContents.send('showPage', arg);
	}
}

module.exports = {EventListeners};