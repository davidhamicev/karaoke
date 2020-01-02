<template>
	<div>
		<vue-tabs class="main__tabs" v-if="$store.state.user.logged">
			<v-tab title="Настройки">
				<SettingsTab />
			</v-tab>
			<v-tab title="Игра">
				<GameSettings />
			</v-tab>
		</vue-tabs>
		<Login v-else />
	</div>
</template>

<script>
import SettingsTab from '@/components/settings/SettingsTab.vue'
import GameSettings from '@/components/settings/GameSettings.vue'
import Login from '@/components/settings/Login.vue'
export default
{
	components:
	{
		SettingsTab,
		GameSettings,
		Login
	},
	methods: {},
	created()
	{
		// без window. не работает
		const { ipcRenderer } = process.env.NODE_ENV === 'production' ? window.require('electron') : require('../../fake-electron');
		this.$store.state.ipc = ipcRenderer;
		this.$store.dispatch('getData');
	}
}
</script>
<style lang="scss">
* {box-sizing: border-box;}
html, body {height: 100%;}
body
{
	font-family: 'Roboto-regular';
	font-size: 12px;
}

.button
{
	border: none;
	outline: none;
	cursor: pointer;
	padding: 6px 7px;
	margin-left: 10px;
	white-space: nowrap;
	display: inline-block;
}
.button_red { background: #f8acac; }
.button_green { background: #acf8e5; }
.button_gray { background: #dedede; }
.button_light-green { background: #aef8ac; }
.button_dark_gray { background: #aaaeaa; }

.nav-tabs
{
	list-style-type: none;
	padding: 0;
	margin: 0;

	.tab
	{
		display: inline-block;
	}

	.tabs__link
	{
		padding: 12px 30px;
		text-decoration: none;
		display: block;
	}
}

.main__tabs
{
	.tabs__link
	{
		background: #f1f1f1;
		color: #000;

		&.active_tab
		{
			background: #dedede;
		}
	}
}

.settings-tab__tabs
{
	.tabs__link
	{
		background: #dedede;

		&.active_tab
		{
			background: #6fa8fd;
			color: #fff;
		}
	}
}
</style>