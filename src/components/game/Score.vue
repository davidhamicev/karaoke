<template>
	<div class="score">
			<audio v-if="isScoreShowed" autoplay class="coins-sound">
				<source src="../../assets/sounds/coins-sound.mp3" type="">
			</audio>
		<h1 class="score__title">Выигрыш:</h1>
		<div class="score__value-wr">
			<!-- <transition name="score-anime"> -->
				<div v-show="isScoreShowed" class="score__value">
					{{ scoreOfCurrentRound }}
				</div>
			<!-- </transition> -->
		</div>
	</div>
</template>
<script>
export default
{
	name: 'Score',
	props: ['scoreOfCurrentRound'],
	data()
	{
		return {
			isScoreShowed: null
		}
	},
	methods:
	{
		showScoreOfRound()
		{
			setTimeout(() =>
			{
				this.isScoreShowed = true;
			}, 1500);
		}
	},
	created()
	{
		this.showScoreOfRound();
	}
}
</script>
<style lang="scss">
	.score-wrp
	{
		max-width: 175rem;
		padding-top: 63px;
		margin-left: 0;
		margin-right: auto;
		overflow: hidden;
		height: 100%;
		flex-shrink: 0;
	}
	.score
	{
		position: relative;
		min-width: 175rem;
		height: 100%;
	}
	.score__title
	{
		display: inline-block;
		font-family: 'Impact';
		font-size: 8rem;
		line-height: 9.8rem;
		@include accent-color;
	}
	.score__value-wr
	{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		min-width: 175rem;
		// height: 90%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.score__value
	{
		font-size: 20rem;
		// line-height: 4.062rem;
	}
</style>