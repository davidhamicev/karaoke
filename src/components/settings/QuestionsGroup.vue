<template>
	<div class="questions-group">
		<div class="questions-group__header">
			<input type="text" class="questions-group__name" v-model="group.name">
			<div class="questions-group__grow"></div>
			<label class="questions-group__show-label">
				<input type="checkbox" v-model="group.show" @change="saveGroup">
				Показать на экране игры
			</label>
			<div class="button button_gray" v-html="togglerText" @click="open = !open"></div>
			<div class="button button_green" @click="addQuestion">добавить вопрос</div>
			<div class="button button_green" @click="saveGroup">сохранить</div>
			<div class="button button_red" @click="$emit('deleteGroup', group)">удалить</div>
		</div>
		<transition name="fade">
			<div class="questions-group__list" v-if="open">
				<Question
					v-for="(question, index) in questions"
					:key="index"
					:question="question"
					@save="saveQuestion"
					@delete="deleteQuestion"
				/>
			</div>
		</transition>
	</div>
</template>
<script>
	import Question from '@/components/settings/Question.vue';
	export default
	{
		props: ['group'],

		components:
		{
			Question
		},

		data()
		{
			return {
				open: true,
				questions: []
			}
		},

		computed:
		{
			togglerText()
			{
				return this.open ? 'свернуть' : 'развернуть';
			}
		},

		methods:
		{
			async saveGroup()
			{
				let group = await this.$store.dispatch('saveGroup', Object.assign({}, this.group));

				if(typeof this.group['_id'] === 'undefined')
					this.group['_id'] = group._id;

				for(let index in this.questions)
					this.questions[index]['group_id'] = this.group._id;
			},

			async deleteGroup()
			{
				await this.$store.commit('deleteGroup', this.group)
			},

			addQuestion()
			{
				let question = {
					text: '',
					answer: '',
					score: 0,
					group_id: (typeof this.group['_id'] !== 'undefined' ? this.group._id : false),
					selected: false
				};

				this.questions.push(question);
			},

			async saveQuestion(question)
			{
				// если еще не сохранена группа вопросов и мы пытаемся сохранить вопрос, то сначала сохраняем группу вопросов
				if(typeof this.group['_id'] === 'undefined')
					await this.saveGroup();

				let quest = await this.$store.dispatch('saveQuestion', Object.assign({}, {group: this.group, question: question}));

				for(let [i, q] of this.questions.entries())
				{
					if(JSON.stringify(q) !== JSON.stringify(question))
						continue;
					this.$set(this.questions, i, JSON.parse(JSON.stringify(quest)));
					break;
				}
			},

			deleteQuestion(question)
			{
				for(let [index, quest] of this.questions.entries())
				{
					if(JSON.stringify(question) !== JSON.stringify(quest))
						continue;

					this.$delete(this.questions, index);

					if(typeof this.group._id !== 'undefined' && typeof question._id !== 'undefined')
						this.$store.commit('deleteQuestion', {group: this.group, question: question});

					break;
				}
			}
		},

		mounted()
		{
			for(let question of this.group.questions)
				this.questions.push(Object.assign({}, question));
		}
	}
</script>
<style lang="scss">
.questions-group
{
	padding: 12px 0;
}

.questions-group__header
{
	display: flex;
	align-items: center;
}
.questions-group__grow
{
	flex-grow: 1;
}
.questions-group__name
{
	background: #f4f4f4;
	padding: 12px 14px;
	border: none;
	outline: none;
	width: 100%;
}
.questions-group__list
{
	overflow: hidden;
}
.questions-group__show-label
{
	white-space: nowrap;
	cursor: pointer;
	margin: 0 10px;
}
.fade-enter-active, .fade-leave-active
{
	transition: all .3s;
	max-height: 1500px;
}
.fade-enter, .fade-leave-to
{
	max-height: 0px;
}
</style>