<template>
	<div class="answer">
		<audio v-if="isAnswerShowed" autoplay class="answer-sound">
			<source src="../../assets/sounds/answer-sound.mp3" type="">
		</audio>
		<h1 class="answer__title">Ответ:</h1>
		<transition name="answer-text">
			<div v-show="isAnswerShowed" class="answer__text-wr">
				<div class="answer__text">
					{{ nameOfSong }}
				</div>
			</div>
		</transition>
		<transition name="answer-singer">
			<div v-if="isAnswerShowed" class="answer__singer-wr">
				<div class="answer__singer">
					{{ nameOfSinger }}
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
export default
{
	name: 'Answer',
	props: ['answerOfQuestion'],
	data()
	{
		return {
			isAnswerShowed: null,
			nameOfSinger: this.answerOfQuestion.slice(0, this.answerOfQuestion.indexOf(',')),
			nameOfSong: this.answerOfQuestion.slice(this.answerOfQuestion.indexOf(',')+1, this.answerOfQuestion.length)
		}
	},
	methods:
	{
		showTextOfAnswer()
		{
			setTimeout(
				()=>
				{
					this.isAnswerShowed = true;
				},
				1500
			);
		}
	},
	created()
	{
		this.showTextOfAnswer();
	}

}
</script>
<style lang="scss">
	.answer-wrp
	{
		max-width: 175rem;
		padding-top: 63px;
		padding-bottom: 83px;
		margin-left: 0;
		margin-right: auto;
		overflow: hidden;
		height: 100%;
	}
	.answer
	{
		min-width: 175rem;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.answer__title
	{
		font-family: 'Impact';
		font-size: 8rem;
		display: inline-block;
		margin: 0;
		@include accent-color;
	}
	.answer__text-wr,
	.answer__singer-wr
	{
		width: 175rem;
		overflow: hidden;
	}
	.answer__text
	{
		min-width: 175rem;
		font-family: $second-font;
		font-size: 20rem;
		line-height: 20rem;
		padding-right: 2rem;
		padding-left: 2rem;
	}
	.answer__singer
	{
		min-width: 175rem;
		font-size: 4.8rem;
		font-family: 'MyriadPro-Regular';
	}
	.answer-text-enter,
	.answer-singer-enter
	{
		width: 0;
	}
	.answer-text-enter-active,
	.answer-singer-enter-active
	{
		transition: 1s ease;
	}
	.answer-text-enter-to,
	.answer-singer-enter-to
	{
		width: 175rem;
	}
	.answer-text-enter-to,
	.answer-singer-enter-to
	{
		transition-delay: .8s;
	}
</style>