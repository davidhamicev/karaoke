<template>
	<div class="login-wr">
		<div class="login">
			<input type="text" placeholder="Логин" v-model="$store.state.user.login">
			<input type="text" placeholder="Пароль" v-model="$store.state.user.password">
			<div class="error" v-show="$store.state.user.error" v-html="$store.state.user.error"></div>
			<button class="button button_light-green" @click="login">войти</button>
		</div>
	</div>
</template>
<script>
import md5 from 'md5'
export default
{
	methods:
	{
		login()
		{
			this.$store.state.user.error = '';

			if(!this.$store.state.user.login)
			{
				this.$store.state.user.error = 'Укажите логин';
				return;
			}

			if(this.$store.state.allowedUsers.indexOf(this.$store.state.user.login) == -1)
			{
				this.$store.state.user.error = 'Пользователь не найден';
				return;
			}

			if(!this.$store.state.user.password)
			{
				this.$store.state.user.error = 'Укажите пароль';
				return;
			}

			let date = new Date();

			if(date.getHours() < 5)
				date.setDate(date.getDate() - 1);

			let month      = ('0' + (date.getMonth()+1)).slice(-2),
				day        = ('0' + date.getDate()).slice(-2),
				year       = date.getFullYear(),
				salt       = 'passHashStringO2',
				passString = `${this.$store.state.user.login}-${salt}-${day}.${month}.${year}`,
				passHash   = md5(passString).substr(0, 5);

			if(this.$store.state.user.password != passHash)
			{
				this.$store.state.user.error = 'Не правильный пароль';
				return;
			}

			this.$store.state.user.logged = true;
		}
	}
}
</script>
<style lang="scss">
.login-wr
{
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
}
.login
{
	display: flex;
	flex-direction: column;
	align-items: center;

	.button
	{
		margin: 0;
	}

	.error
	{
		margin-bottom: 10px;
		color: #f00;
	}

	input
	{
		margin-bottom: 10px;
	}
}
</style>