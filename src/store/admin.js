import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state:
	{
		allowedUsers: ['admin', 'manager'],
		user:
		{
			logged: true,
			login: 'admin',
			password: '',
			error: ''
		},
		questionsGroups: [],
		teams: [],
		otherSettings: {}
	},
	mutations:
	{
		// начисление команде очков
		addTeamScore(state, data)
		{
			for(let index in state.teams)
			{
				if(state.teams[index]._id != data.teamId)
					continue;

				let newScore = parseInt(state.teams[index].score) + (parseInt(data.score)||0);
				let savedData = state.ipc.sendSync('addTeamScore', {id: state.teams[index]._id, score: newScore});

				state.teams[index]['_id'] = savedData._id;
				state.teams[index].score  = newScore;

				break;
			}
		},

		// сохранение настроек с вкладки "другие настройки"
		saveOtherSettings(state)
		{
			let savedData = state.ipc.sendSync('saveOtherSettings', state.otherSettings);

			if(typeof savedData['_id'] !== 'undefined')
				Vue.set(state.otherSettings, '_id', savedData._id);
		},

		addGroup(state, group)
		{
			state.questionsGroups.push(group);
		},

		// добавление группы вопросов
		saveGroup(state, groupData)
		{
			for(let [index, group] of state.questionsGroups.entries())
			{
				if(group._id != groupData._id)
					continue;
				groupData['questions'] = state.questionsGroups[index].questions;
				Vue.set(state.questionsGroups, index, groupData);
				break;
			}
		},

		deleteGroup(state, groupData)
		{
			for(let [index, group] of state.questionsGroups.entries())
			{
				if(group._id != groupData._id)
					continue;
				state.ipc.sendSync('deleteGroup', groupData);
				state.questionsGroups.splice(index, 1);
				break;
			}
		},

		// добавление вопроса
		addQuestion(state, data)
		{
			for(let [index, group] of state.questionsGroups.entries())
			{
				if(group._id != data.groupId)
					continue;

				state.questionsGroups[index].questions.push(data.question)
			}
		},

		// сохранение вопроса
		saveQuestion(state, data)
		{
			for(let [i, group] of state.questionsGroups.entries())
			{
				if(group._id != data.groupId)
					continue;

				for(let [j, question] of group.questions.entries())
				{
					if(data.question._id != question._id)
						continue;

					Vue.set(state.questionsGroups[i].questions, j, Object.assign({}, data.question));
					state.questionsGroups[i].questions[j] = Object.assign({}, data.question);
				}

				break;
			}
		},

		deleteQuestion(state, data)
		{
			for(let [i, group] of state.questionsGroups.entries())
			{
				if(group._id != data.group._id)
					continue;

				for(let [j, question] of group.questions.entries())
				{
					if(data.question._id != question._id)
						continue;
					state.ipc.sendSync('deleteQuestion', data.question);
					state.questionsGroups[i].questions.splice(j, 1);
					break;
				}
			}
		},

		// добавление команды
		addTeam(state, team)
		{
			state.teams.push(team);
		},

		// сохранение команды
		saveTeam(state, data)
		{
			for(let [index, team] of state.teams.entries())
			{
				if(team._id != data.teamId)
					continue;
				Vue.set(state.teams, index, data.team);
				break;
			}
		},

		// удаление команды
		deleteTeam(state, teamId)
		{
			for(let [index, team] of state.teams.entries())
			{
				if(team._id != teamId)
					continue;

				state.ipc.sendSync('deleteTeam', teamId);
				Vue.delete(state.teams, index);
				break;
			}
		}
	},
	actions:
	{
		saveGroup({ state, commit }, group)
		{
			let newGroup;
			if(typeof group._id == 'undefined')
			{
				// отправляем запрос на создание новой группы в БД
				// оттуда же получаем ID новой записи и возвращаем ее
				newGroup = state.ipc.sendSync('createGroup', group);
				commit('addGroup', newGroup);
				return newGroup;
			}

			// отправляем запрос на сохранение изменений в группе
			newGroup = state.ipc.sendSync('saveGroup', group);
			commit('saveGroup', newGroup);
			return newGroup;
		},

		saveQuestion({ state, commit }, data)
		{
			let newQuestion;
			if(typeof data.question.file == 'undefined')
				data.question.file = false;

			if(typeof data.question._id == 'undefined')
			{
				// отправляем запрос на создание новой группы в БД
				// оттуда же получаем ID новой записи и возвращаем ее
				newQuestion = state.ipc.sendSync('createQuestion', data.question);
				commit('addQuestion', {groupId: data.group._id, question: newQuestion});
				return newQuestion;
			}

			// отправляем запрос на сохранение изменений в группе
			newQuestion = state.ipc.sendSync('saveQuestion', data.question);
			commit('saveQuestion', {groupId: data.group._id, question: newQuestion});
			return newQuestion;
		},

		saveTeam({ state, commit }, team)
		{
			let newTeam;
			if(typeof team._id == 'undefined')
			{
				// отправляем запрос на создание новой команды в БД
				// оттуда же получаем ID новой записи и возвращаем ее
				newTeam = state.ipc.sendSync('createTeam', team);
				commit('addTeam', newTeam);
				return newTeam;
			}

			// отправляем запрос на сохранение изменений в команде
			newTeam = state.ipc.sendSync('saveTeam', team);
			commit('saveTeam', {teamId: team._id, team: newTeam});
			return newTeam;
		},

		getData({ state })
		{
			let data              = state.ipc.sendSync('getData');

			state.teams           = data.teams;
			state.otherSettings   = data.settings;
			state.questionsGroups = data.groups;
		},

		showPage({ state }, name)
		{
			state.ipc.send('showPage', {action: 'showQuestionsList', name: name});
		},

		action({ state }, data)
		{
			state.ipc.send('action', {action: 'action', data: data});
		},

		questions({ state }, data)
		{
			state.ipc.send('questions', data);
		}
	},
	modules: {}
})