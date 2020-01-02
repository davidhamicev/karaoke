<template>
	<div class="game-settings">
		<div class="game-settings__section">
			<div class="game-settings__section-top">
				<div class="game-settings__section-label">Команды</div>
			</div>
			<div class="game-settings__section-content">
				<div class="game-settings__team" v-for="team in $store.state.teams" :key="team._id">
					<div class="game-settings__team-name">{{ team.name }}</div>
					<div class="game-settings__team-score">баллы: <strong>{{ team.score }}</strong></div>
					<div class="game-settings__team-actions">
						<input type="text" class="game-settings__team-actions-input" v-model="scores[team._id]">
						<div class="button button_green" @click="addTeamScore(team._id)">начислить</div>
					</div>
				</div>
			</div>
		</div>

		<div class="game-settings__section" id="pages">
			<div class="game-settings__section-top">
				<div class="game-settings__section-label">Страницы</div>
			</div>
			<div class="game-settings__section-content game-settings__page-list">
				<div class="game-settings__page">
					<div class="game-settings__page-name">Заставка</div>
					<div class="button button_green" @click="$store.dispatch('action', 'screensaver')">показать</div>
				</div>
				<div class="game-settings__page">
					<div class="game-settings__page-name">Таблица вопросов</div>
					<div class="button button_green" @click="$store.dispatch('showPage', 'menu')">показать</div>
				</div>
				<div class="game-settings__page">
					<div class="game-settings__page-name">Список команд</div>
					<div class="button button_green" @click="$store.dispatch('questions', {action: 'showListOfMembers'})">показать</div>
				</div>
				<div class="game-settings__page">
					<div class="game-settings__page-name">Сигнал неправильного ответа</div>
					<div class="button button_green" @click="$store.dispatch('action', 'incorrect-answer-sound')">запустить</div>
				</div>
				<div class="game-settings__page">
					<div class="game-settings__page-name">Таймер</div>
					<div class="button button_green" @click="toggleTimer" v-html="timerText"></div>
				</div>
			</div>
		</div>

		<div class="game-settings__section">
			<div class="game-settings__section-top">
				<div class="game-settings__section-label">Вопросы</div>
			</div>
			<div class="game-settings__section-content">
				<div class="game-settings__questions-group" v-for="group in $store.state.questionsGroups" :key="group.id">
					<div class="game-settings__questions-group-name">{{ group.name }}</div>
					<div class="game-settings__questions-group-question-list">
						<div
							class="game-settings__questions-group-question"
							:class="{'game-settings__questions-group-question_checked': (checkedQuestion == question._id)}"
							v-for="question in group.questions" :key="question.id"
						>
							<div class="game-settings__questions-group-question-info">
								<div class="game-settings__questions-group-question-name"><strong>Вопрос:</strong><span>{{ question.text }}</span></div>
								<div><strong>Баллы:</strong><span>{{ question.score }}</span></div>
								<div><strong>Ответ:</strong><span>{{ question.answer }}</span></div>
							</div>
							<div
								class="button button_green"
								@click="showQuestion(group, question)"
							>показать вопрос</div>
							<div
								class="button button_green"
								@click="$store.dispatch('questions', {action: 'showAnswerOfQuestion', question: question})"
							>показать ответ</div>
							<div
								class="button button_green"
								@click="$store.dispatch('questions', {action: 'showScoreOfCurrentRound', question: question})"
							>показать выигрыш</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="game-settings__scroll-page" @click="scrollPageToUp" v-if="showScrollUpButton"></div>
	</div>
</template>
<script>
export default
{
	data()
	{
		return {
			scores: {},
			timerIsRun: false,
			timer: false,
			checkedQuestion: false,
			showScrollUpButton: false
		}
	},
	computed:
	{
		timerText()
		{
			return this.timer ? 'остановить' : 'запустить';
		}
	},
	methods:
	{
		scrollPageToUp()
		{
			window.scrollTo({
				top: document.getElementById("pages").offsetTop,
				behavior: "smooth"
			});
		},
		toggleTimer()
		{
			this.$store.dispatch('action', 'timer');

			if(!this.timer)
				this.timer = setTimeout(this.toggleTimer, (+this.$store.state.otherSettings.timeout * 1000));
			else
			{
				clearTimeout(this.timer);
				this.timer = false;
			}

		},
		selectQuestion({ question })
		{
			question.selected = !question.selected;
			this.$store.dispatch('questions', {action: 'selectQuestion', question: question})
		},
		addTeamScore(teamId)
		{
			this.$store.commit('addTeamScore', {score: this.scores[teamId], teamId: teamId});
			this.scores[teamId] = '';
		},
		async showQuestion(group, question)
		{
			this.checkedQuestion = question._id;
			question.selected = true;
			await this.$store.dispatch('saveQuestion', Object.assign({}, {group: group, question: question}));
			this.$store.dispatch('questions', {action: 'setSelectedQuestionAndShow', question: question});
		}
	},
	mounted()
	{
		document.addEventListener('scroll', () =>
		{
			this.showScrollUpButton = (document.querySelector('html').scrollTop > document.getElementById('pages').offsetTop);
		});
	}
}
</script>
<style lang="scss">
.game-settings__section
{
	background: #f4f4f4;
	padding: 14px 14px 30px;
	margin: 14px 0;
}
.game-settings__section-top
{
	display: flex;
	flex-wrap: nowrap;
	margin-bottom: 10px;
}
.game-settings__section-label
{
	flex-grow: 1;
	line-height: 26px;
	font-family: 'Roboto-bold';
}
.game-settings__team
{
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	padding: 20px 0;
	border-bottom: 1px solid #dedede;
	align-items: center;
}

.game-settings__team-score
{
	width: 100px;

	strong
	{
		font-family: 'Roboto-bold';
	}
}
.game-settings__team-actions
{
	display: flex;

	.button
	{
		margin-left: 0;
	}
}
.game-settings__team-actions-input
{
	border: none;
	width: 70px;
	text-align: center;
	outline: none;
}
.game-settings__page
{
	display: inline-block;
	vertical-align: top;
	text-align: center;
	background: #e5e5e5;
	padding: 11px 17px 6px;
	margin: 0 5px 10px;
	width: 170px;
	height: 85px;

	.button {margin-left: 0;}
}
.game-settings__page-name
{
	margin-bottom: 10px;
}
.game-settings__questions-group-question-info
{
	display: flex;
	flex-direction: column;
	flex-grow: 1;

	div
	{
		margin-bottom: 10px;
	}

	strong
	{
		margin-right: 10px;
		font-family: 'Roboto-bold';
	}
}
.game-settings__questions-group-name
{
	font-weight: 700;
	padding: 10px 0 10px 15px;
	background: yellow;
}
.game-settings__questions-group-question-list
{
	margin: 10px 0 10px 15px;
}
.game-settings__questions-group-question
{
	padding: 20px;
	display: flex;
	flex-wrap: nowrap;
	background: #e5e5e5;
	align-items: flex-start;
}
.game-settings__questions-group-question_checked
{
	background: rgba(0, 0, 255, 0.2);
}
.game-settings__questions-group-question-name
{
	flex-grow: 1;
	align-items: flex-start;
	display: flex;
}
.game-settings__scroll-page
{
	position: fixed;
	bottom: 20px;
	right: 20px;
	width: 60px;
	height: 60px;
	background: #f4f4f4;
	border-radius: 10px;
	border: 2px solid #e5e5e5;
	cursor: pointer;
	opacity: 0.5;
	transition: opacity 0.5s ease;

	&:hover
	{
		opacity: 1;
	}

	&:before
	{
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border-left: 25px solid transparent;
		border-right: 25px solid transparent;
		border-bottom: 30px solid #dedede;
		top: 50%;
		margin-top: -17px;
		left: 50%;
		margin-left: -25px;
	}

	&:after
	{
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border-left: 25px solid transparent;
		border-right: 25px solid transparent;
		border-bottom: 30px solid #f4f4f4;
		top: 50%;
		margin-top: -8px;
		left: 50%;
		margin-left: -25px;
	}
}
</style>