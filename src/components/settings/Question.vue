<template>
	<div class="question">
		<div class="question__fields">
			<div class="question__field">
				<div class="question__field-label">Вопрос</div>
				<input type="text" class="question__field-input" v-model="question.text">
			</div>
			<div class="question__field">
				<div class="question__field-label">Правильный ответ</div>
				<input type="text" class="question__field-input" v-model="question.answer">
			</div>
			<div class="question__field">
				<div class="question__field-label">Баллы за правильный ответ</div>
				<input type="text" class="question__field-input" v-model="question.score">
			</div>
		</div>
		<div class="question__file-wr">
			<label class="button button_gray question__file-label">
				файл
				<input class="question__file-input" type="file" ref="questionFile" @change="changeFile">
			</label>
			<div class="question__file-preview-wr" v-if="question.file">
				<div class="question__file-preview-image-wr">
					<img :src="question.file" class="question__file-preview-image">
				</div>
				<span class="question__file-delete" @click="deleteQuestionFile">Удалить</span>
			</div>
		</div>
		<div class="question__buttons">
			<div class="button button_green" @click="$emit('save', question)">сохранить</div>
			<div class="button button_red" @click="$emit('delete', question)">удалить</div>
		</div>
	</div>
</template>
<script>
export default
{
	props: ['question'],
	methods:
	{
		changeFile()
		{
			if(this.$refs.questionFile.files && this.$refs.questionFile.files[0])
			{
				var reader = new FileReader();

				reader.onload = e => {
					this.$set(this.question, 'file', e.target.result);
				}

				reader.readAsDataURL(this.$refs.questionFile.files[0]);
			}
		},

		deleteQuestionFile()
		{
			this.$set(this.question, 'file', false);
		}
	}
}
</script>
<style lang="scss">
.question
{
	margin-top: 20px;
	padding: 14px;
	background: #f4f4f4;
	display: flex;
	flex-wrap: nowrap;
}
.question__buttons
{
	display: flex;
	flex-wrap: wrap;
	flex-grow: 0;
	align-items: flex-start;
}
.question__fields
{
	flex-grow: 1;
}
.question__field-label
{
	font-family: 'Roboto-bold';
	margin-bottom: 14px;
}
.question__field-input
{
	background: #fff;
	padding: 12px 14px;
	margin-bottom: 14px;
	border: none;
	outline: none;
	width: 100%;
}
.question__file-input
{
	display: none;
}
.question__file-preview-image-wr
{
	display: inline-block;
	width: 27px;
	height: 27px;
	margin-right: 10px;
}
.question__file-preview-image
{
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.question__file-delete
{
	cursor: pointer;
}
.question__file-preview-wr
{
	display: flex;
	align-items: center;
}
.button.question__file-label
{
	margin: 35px 0 50px 0;
}
.question__file-wr
{
	padding-left: 20px;
}
</style>