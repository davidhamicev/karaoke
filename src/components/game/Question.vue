<template>
	<div class="question">
		<h1 class="question__title">Вопрос:</h1>
		<transition name="question-wr">
			<div v-if="isQuestionShowed" class="question__text-wr">
				<div
					v-if="questionObj.file"
					class="question__img-wr"
					><img :src="questionObj.file" alt="" class="question__img">
				</div>
				<div v-else class="question__text">
					{{ questionObj.question }}
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
export default
{
	name: 'Question',
	props: ['questionObj'],
	data()
	{
		return {
			isQuestionShowed: null
		}
	},
	methods:
	{
		showTextOfQuestion()
		{
			setTimeout(() =>
			{
				this.isQuestionShowed = true;
			}, 3000);
		}
	},
	created()
	{
		this.showTextOfQuestion();
		console.log(this.questionObj);
	}
}
</script>

<style lang="scss">
	.question-wrp
	{
		width: 175rem;
		margin-left: 0;
		margin-right: auto;
		padding-top: 65px;
		overflow: hidden;
	}
	.question
	{
		min-width: 175rem;
		text-align: center;
	}
	.question__title
	{
		display: inline-block;
		font-family: 'Impact';
		font-size: 8rem;
		@include accent-color;
	}
	.question__text-wr
	{
		width: 175rem;
		overflow: hidden;
	}
	.question__img-wr
	{
		height: 45vh;
		width: 60%;
		margin: 0 auto;
		overflow: hidden;
	}
	.question__img
	{
		width: 100%;
		object-fit: cover;
	}
	.question__text
	{
		min-width: 175rem;
		font-family: $second-font;
		font-size: 8.6rem;
		line-height: 11.5rem;
	}
	.question-wr-enter
	{
		width: 0;
	}
	.question-wr-enter-active
	{
		transition: 1s;
	}
	.question-wr-enter-to
	{
		width: 175rem;
	}
</style>