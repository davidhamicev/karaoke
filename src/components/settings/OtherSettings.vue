<template>
	<div class="other-settings">
		<div class="other-settings__item">
			<div class="other-settings__item__fields">
				<div class="other-settings__item__field">
					<div class="other-settings__item__field-label">Время на раздумие в секундах</div>
					<input type="text" class="other-settings__item__field-input" v-model="$store.state.otherSettings.timeout">
				</div>
			</div>
			<div class="other-settings__item__buttons">
				<div class="button button_green" @click="$store.commit('saveOtherSettings')">сохранить</div>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
.other-settings__add-btn-wr
{
	margin-top: 12px;
	margin-bottom: 12px;
}
.other-settings__item
{
	margin-top: 20px;
	padding: 14px;
	background: #f4f4f4;
	display: flex;
	flex-wrap: nowrap;
}
.other-settings__item__buttons
{
	display: flex;
	flex-wrap: wrap;
	flex-grow: 0;
	align-items: flex-start;
}
.other-settings__item__fields
{
	flex-grow: 1;
}
.other-settings__item__field-label
{
	font-family: 'Roboto-bold';
	margin-bottom: 14px;
}
.other-settings__item__field-input
{
	background: #fff;
	padding: 12px 14px;
	margin-bottom: 14px;
	border: none;
	outline: none;
	width: 100%;
}
</style>