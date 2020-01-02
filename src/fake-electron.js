class rendererIpc
{
	sendSync(method, data)
	{
		if (typeof this[method] === "function")
			return this[method](data);
		return false;
	}

	send(method, data)
	{
		console.log(method, data);
	}

	on(channel, data)
	{
		console.log(`add event listener to channel ${channel} with data:`, data);
	}

	// возвращение массива всех данных (команды, группы вопросов, настройки) при запуске приложения
	getData()
	{
		return {
			teams: [{"name":"test team 1","score":100,"_id":"eabeaa248939405ab2cf2a75ab8ec6ea"}],
			groups: [
				{
					"name":"test",
					"questions":[
						{
							"answer": "Супер исполнитель, Супер песня",
							"file": false,
							"group_id": "18ba954d6eec4045b4872f3438c1c3f6",
							"score": "100",
							"text": "Идея текста этой песни пришла в голову автору после того, " +
									"как он прочитал заметку в газете о забегании этого парнокопытного млекопитающего в магазин «Березка». " +
									"Позже, песня стала хитом всех пионеров.",
							"_id": "84525bb9815149d4bfb65b4f62e1672d"
						},
						{
							"answer": "Супер исполнитель, Супер песня",
							"file": false,
							"group_id": "18ba954d6eec4045b4872f3438c1c3f6",
							"score": "200",
							"text": "Идея текста этой песни пришла в голову автору после того, " +
									"как он прочитал заметку в газете о забегании этого парнокопытного млекопитающего в магазин «Березка». " +
									"Позже, песня стала хитом всех пионеров.",
							"_id": "ff113f8224de4cbabaf30e06eba7fa67"
						},
						{
							"answer": "Супер исполнитель, Супер песня",
							"file": false,
							"group_id": "18ba954d6eec4045b4872f3438c1c3f6",
							"score": "200",
							"text": "Идея текста этой песни пришла в голову автору после того, " +
									"как он прочитал заметку в газете о забегании этого парнокопытного млекопитающего в магазин «Березка». " +
									"Позже, песня стала хитом всех пионеров.",
							"_id": "ff113f8224de4cbabaf30e06eba7fa68"
						}
					],
					"show":true,
					"_id":"18ba954d6eec4045b4872f3438c1c3f6"
				}
			],
			settings: {timeout: '10'}
		};
	}

	// создание новой группы вопросов
	createGroup(group)
	{
		return Object.assign({_id: new Date().getTime()}, group);
	}

	// сохранение изменений в группе вопросов
	saveGroup(group)
	{
		return group;
	}

	// удаление группы вопросов
	deleteGroup(group)
	{
		return group;
	}

	// создание нового вопроса
	createQuestion(data)
	{
		return Object.assign({_id: new Date().getTime()}, data.question);
	}

	// сохранение вопроса
	saveQuestion(data)
	{
		return data;
	}

	deleteQuestion(data)
	{
		return data;
	}

	// создание нового вопроса
	createTeam(team)
	{
		return Object.assign({_id: new Date().getTime()}, team);
	}

	// сохранение вопроса
	saveTeam(team)
	{
		return team;
	}

	deleteTeam(teamId)
	{
		console.log(`delete team #${teamId}`);
		return true;
	}
}

export const ipcRenderer = new rendererIpc;