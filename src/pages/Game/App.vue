<template>
	<div class="container">
		<transition name="video">
			<div v-if="isGameStarted" class="welcome-video">
				<video @ended="isVideoEnded()" autoplay class="video-wr">
					<source src="./../../assets/video/karaoke.mp4" type="video/mp4">
				</video>
			</div>
		</transition>

		<audio loop="true" class="bg-sound">
			<source src="../../assets/sounds/bg-sound.mp3" type="">
		</audio>
		<audio v-if="isVideoFinished" class="select-sound">
			<source src="../../assets/sounds/select-sound.mp3" type="">
		</audio>
		<audio class="time-sound">
			<source src="../../assets/sounds/minute.mp3" type="">
		</audio>
		<audio
			v-if="isErrorStarted"
			@ended="increaseBgSoundAfterError"
			autoplay
			class="error-sound">
			<source src="../../assets/sounds/error.mp3" type="">
		</audio>

		<transition name="logo-anime">
			<div v-show="!isGameStarted || isVideoFinished" class="logo" :class = "{ logo_top: !isGameStarted && isVideoFinished }">
				<img src="../../assets/img/logo.png" alt="">
			</div>
		</transition>
		<div class="game-wr">
			<transition name="questions-list">
				<div v-if="openedTabName==='questions-list'" class="game-questions-wr">
					<div class="game-questions">
						<div class="game-question" v-for="(question, value, index) in questions" :key="index">
							<Subjects v-if="question.show"
								:question-data="question"
								:subject="question.name"
								:selectedQuestion="currentQuestion"
								:showedQuestionsList="openedTabName"/>
						</div>
					</div>
				</div>
			</transition>
			<transition name="question-anime">
				<div v-if="openedTabName==='question-page'" class="question-wrp">
					<Question :questionObj="currentQuestion"/>
				</div>
			</transition>
			<transition name="answer-anime">
				<div v-if="openedTabName==='answer-page'" class="answer-wrp" >
					<Answer :answer-of-question="currentQuestion.answer"/>
				</div>
			</transition>
			<transition name="members-anime">
				<div v-if="openedTabName==='members-page'" class="members-wrp">
					<Members
						:list-of-members="sortedListOfMemebers"/>
				</div>
			</transition>
			<transition name="score-anime">
				<div v-if="openedTabName==='score-page'" class="score-wrp">
					<Score :scoreOfCurrentRound="currentQuestion.score"/>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
import Subjects from '../../components/game/Subjects'
import Question from '../../components/game/Question'
import Answer from '../../components/game/Answer'
import Members from '../../components/game/Members'
import Score from '../../components/game/Score'

export default
{
	components: { Subjects, Question, Answer, Members, Score },
	data()
	{
		return {
			isBgSoundRunned: false,
			isGameStarted: false,
			isVideoFinished: false,
			isTimerStarted: false,
			isErrorStarted: false,
			openedTabName: null,
			questions: {},
			allGameData: null,
			currentQuestion:
			{
				subject: null,
				score: null,
				file: null,
				question: null,
				answer: null,
				id: null
			},
			listOfMembers: [
			{
				subject: null,
				score: null,
				question: null,
				answer: null,
				id: null
			}]
		}
	},
	computed:
	{
		isSubjectFinished()
		{
			return this.questions
		},
		sortedListOfMemebers()
		{
			return this.sortMembersByScore(this.listOfMembers);
		}
	},
	ready: function()
	{
		this.addListeners();
	},
	methods:
	{
		startGame()
		{
			this.isGameStarted = true;
			const greetVideo = document.querySelector('.video-wr');
			greetVideo.play();
		},
		sortMembersByScore(members)
		{
			members.sort((a, b) => a.score < b.score ? 1 : -1);
			return members;
		},
		/* метод для отслеживания завершения видео */
		isVideoEnded()
		{
			this.isVideoFinished = true;
			this.isGameStarted = false;
		},
		/** получение списка вопросов */
		getAllQuestions(questionsList)
		{
			this.questions = questionsList;
		},
		/** получение списка команд */
		getListOfMembers(members)
		{
			this.listOfMembers = members;
		},
		/** выбор вопроса и отображение его на табло */
		setSelectedQuestionAndShow(questionObj)
		{
			document.querySelector('.select-sound').play();
			this.stopBgSound();

			let currentQuestionObj = this.questions.find( question => {
				return questionObj.group_id == question._id
			});

			this.currentQuestion = {
				subject: currentQuestionObj.name,
				score: questionObj.score,
				file: questionObj.file,
				question: questionObj.text,
				answer: questionObj.answer,
				id: questionObj._id
			}

			for (let subject of this.questions)
			{
				subject.questions = subject.questions.map((question) =>
				{
					if (question._id === this.currentQuestion.id)
						question.selected = true;
					return question;
				});
			}
			setTimeout(()=>
			{
				this.openedTabName = 'question-page';
			}, 500);
		},
		/** показать таблицу вопросов */
		showQuestionsList()
		{
			this.isVideoEnded();
			this.runBgSound();
			setTimeout(() =>
			{
				this.openedTabName = 'questions-list';
			}, 500);

			this.currentQuestion =
			{
				subject: null,
				score: null,
				file: null,
				question: null,
				answer: null,
				id: null
			}
		},
		/** показ ответа на вопрос */
		showAnswerOfQuestion()
		{
			this.stopBgSound();
			setTimeout( () =>
			{
				this.openedTabName = 'answer-page';
			}, 500);
		},
		/** показ зачетной таблицы команд */
		showListOfMembers()
		{
			this.isVideoEnded();
			this.runBgSound();
			setTimeout(() =>
			{
				this.openedTabName = 'members-page';
			}, 500);
		},
		/* Показать выигрыш за текущий раунд */
		showScoreOfCurrentRound()
		{
			this.stopBgSound();
			setTimeout(() =>
			{
				this.openedTabName = 'score-page';
			}, 500);
		},
		/* обновление баллов команд */
		recountScoreOfMemebers(memberData)
		{
			for (let member of this.listOfMembers)
			{
				if (member._id == memberData.id)
					member.score = memberData.score
			}
		},
		/* включение/отключение аудио таймера */
		soundOfQuestionToggle()
		{
			document.querySelector('.time-sound').currentTime = 0;

			if(this.isTimerStarted)
			{
				clearTimeout(this.isTimerStarted);
				this.isTimerStarted = false;
				document.querySelector('.time-sound').pause();
			}
			else
			{
				document.querySelector('.time-sound').play();
				this.isTimerStarted = setTimeout(() => this.soundOfQuestionToggle, Number(this.gameData.settings.timeout)*1000);
			}
		},
		/* включения звука ошибки */
		soundOfError()
		{
			this.isErrorStarted = true;
		},
		/* включение фоновой музыки после отключения таймера */
		increaseBgSoundAfterError()
		{
			this.isErrorStarted = false;
		},
		/* обновления информации вопросов */
		update()
		{
			this.$set(this, 'gameData', this.$store.state.ipc.sendSync('getData'));
			this.getAllQuestions(this.gameData.groups);
			this.getListOfMembers(this.gameData.teams);
		},
		/* плавное включение фоновой музыки */
		runBgSound()
		{
			if(this.isBgSoundRunned)
				return;

			this.isBgSoundRunned = true;

			document.querySelector('.bg-sound').volume = 0;
			document.querySelector('.bg-sound').play();

			this.changeBgSoundVolume(0, 1);
		},
		/* плавное отключение фоновой музыки */
		stopBgSound()
		{
			if(!this.isBgSoundRunned)
				return;

			this.isBgSoundRunned = false;

			document.querySelector('.bg-sound').volume = 1;
			this.changeBgSoundVolume(1, 0);
		},
		changeBgSoundVolume(currentVolume, needVolume)
		{
			let delta = currentVolume < needVolume ? 0.01 : -0.01;

			let maxVolume = 1,
				minVolume = 0;

			let newVolume = currentVolume + delta;

			newVolume = Math.min(Math.max(minVolume, (currentVolume + delta)), maxVolume);

			document.querySelector('.bg-sound').volume = newVolume;

			if(
				(delta > 0 && newVolume >= needVolume)
				||
				(delta < 0 && newVolume <= needVolume)
			)
			{
				if(needVolume == 0)
				{
					document.querySelector('.bg-sound').pause();
					document.querySelector('.bg-sound').currentTime = 0;
				}
				return;
			}

			setTimeout(() => this.changeBgSoundVolume(newVolume, needVolume), 40);
		}
	},
	created()
	{
		// без window. не работает
		const { ipcRenderer } = process.env.NODE_ENV === 'production' ? window.require('electron') : require('../../fake-electron');
		this.$store.state.ipc = ipcRenderer;

		this.gameData = this.$store.state.ipc.sendSync('getData');

		this.getAllQuestions(this.gameData.groups);
		this.getListOfMembers(this.gameData.teams);

		this.$store.state.ipc.on('update', () => this.update());

		this.$store.state.ipc.on('questions', (event, data) => this[data.action](data.question));
		this.$store.state.ipc.on('showPage', (event, data) => this[data.action]());
		this.$store.state.ipc.on('addTeamScore', (event, data) => this.recountScoreOfMemebers(data));
		this.$store.state.ipc.on('action', (event, data) =>
		{
			if (data.data==='timer')
				this.soundOfQuestionToggle();

			if (data.data==='screensaver')
			{
				if ( !this.isVideoFinished && !this.isGameStarted)
					this.startGame();
			}

			if (data.data==='incorrect-answer-sound')
				this.soundOfError();
		});
	}
}
</script>
<style lang="scss">
	.btn
	{
		background-color: #cecece;
		bottom: 250px;
		position: absolute;
		color: black;
		font-size: 7rem;
		cursor: pointer;
		padding: 3rem;
	}

	*,div
	{
		box-sizing: border-box;
	}
	html
	{
		font-size: 10px;
	}
	body
	{
		width: 100vw;
		height: 100vh;
		padding: 0;
		margin: 0;
		background-image: url('./../../assets/img/main-bg.jpg');
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		overflow: hidden;
	}
	.container
	{
		display: flex;
		position: relative;
		font-family: $accent-font;
		width: 100vw;
		height: 100vh;
		color: white;
		text-align: center;
	}
	.welcome-video
	{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		video
		{
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	.game-wr
	{
		width: 175rem;
		position: relative;
		padding-top: 187px;
		margin: 0 auto;
		// width: 100%;
		display: flex;
	}
	.logo
	{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 102rem;
		img
		{
			width: 100%;
		}
	}
	.logo_top
	{
		max-width: 16.8rem;
		top: 23px;
		transform: translate(-50%, 0);
	}
	.video
	{
		opacity: 1;
	}
	.video-enter,
	.video-leave-to
	{
		opacity: 0;
	}
	.video-enter-active,
	.video-leave-active
	{
		transition: 1s;
	}
	.video-enter-to,
	.video-leave
	{
		opacity: 1;
	}
	.logo-anime-enter
	{
		opacity: 0;
		max-width: 102.2rem;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.logo-anime-enter-active
	{
		transition-duration: 2s;
	}
	.logo-anime-enter-to
	{
		opacity: 1;
	}
	.game-questions-wr
	{
		width: 175rem;
		overflow: hidden;
		margin-left: 0;
		margin-right: auto;
	}
	.game-questions
	{
		min-width: 175rem;
	}
	.subject_visible
	{
		display: none;
	}
	.questions-list-enter
	{
		width: 0rem;
	}
	.questions-list-enter-active,
	.questions-list-leave-active,
	{
		transition: 1s linear;
	}
	.questions-list-enter-to
	{
		width: 175rem;
		transition-delay: 2s;
	}
	.questions-list-leave-to
	{
		width: 0;
		transition-delay: .9s;
	}
	.members-wrp
	{
		/*width: 230rem;*/
		width: 100%;
		overflow: hidden;
		margin: 0 auto;
	}
	.members-anime-enter
	{
		width: 0;
	}
	.members-anime-enter-active
	{
		transition: .7s linear;
	}
	.members-anime-enter-to
	{
		width: 230rem;
		transition-delay: 2s;
	}
	.question-anime-enter,
	.answer-anime-enter,
	.score-anime-enter
	{
		width: 0;
	}
	.question-anime-enter-active,
	.answer-anime-enter-active,
	.score-anime-enter-active
	{
		transition: 1.5s linear;
	}
	.question-anime-enter-to,
	.answer-anime-enter-to,
	.score-anime-enter-to
	{
		width: 175rem;
		transition-delay: 1.2s;
	}
	.question-anime-enter-to
	{
		transition-delay: 2.3s;
	}
	.question-anime-leave,
	.answer-anime-leave,
	.score-anime-leave
	{
		opacity: 1;
	}
	.members-anime-leave
	{
		width: 230rem;
	}
	.members-anime-leave-to
	{
		width: 0;
	}
	.question-anime-leave-active,
	.members-anime-leave-active,
	.answer-anime-leave-active,
	.score-anime-leave-active
	{
		transition: 1s linear;
	}
	.question-anime-leave-to,
	.answer-anime-leave-to,
	.score-anime-leave-to
	{
		opacity: 0;
	}

	@media (max-width: 1800px)
	{
		html
		{
			font-size: 9px;
		}
	}
	@media (max-width: 1700px)
	{
		html
		{
			font-size: 8px;
		}
		.game-wr
		{
			padding-top: 170px;
		}
	}
	@media (max-width: 1500px)
	{
		html
		{
			font-size: 7px;
		}
		.game-wr
		{
			padding-top: 155px;
		}
	}
	@media (max-width: 1440px)
	{
		html
		{
			font-size: 6px;
		}
		.game-wr
		{
			padding-top: 140px;
		}
	}
	@media (max-width: 1024px)
		{
			html
			{

				font-size: 4px;
			}
			.game-wr
			{
				padding-top: 130px;
			}
		}

</style>
