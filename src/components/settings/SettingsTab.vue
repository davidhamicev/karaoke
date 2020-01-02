<template>
	<div class="settings-tab">
		<vue-tabs class="settings-tab__tabs">
			<v-tab title="Вопросы/Ответы" v-if="$store.state.user.login == 'admin'">
				<Questions />
			</v-tab>
			<v-tab title="Команды">
				<Teams />
			</v-tab>
			<v-tab title="Другие настройки" v-if="$store.state.user.login == 'admin'">
				<OtherSettings />
			</v-tab>
		</vue-tabs>
	</div>
</template>
<script>
	import Questions from '@/components/settings/Questions.vue'
	import Teams from '@/components/settings/Teams.vue'
	import OtherSettings from '@/components/settings/OtherSettings.vue'
	export default
	{
		components: {Questions, Teams, OtherSettings}
	}
</script>