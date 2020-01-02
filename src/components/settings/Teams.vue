<template>
	<div class="teams">
		<div class="teams__add-btn-wr">
			<div class="button button_green" @click="addTeam">добавить команду</div>
		</div>
		<div class="teams__item" v-for="(team, index) in teams" :key="index">
			<div class="teams__item__fields">
				<div class="teams__item__field">
					<div class="teams__item__field-label">Название команды</div>
					<input type="text" class="teams__item__field-input" v-model="team.name">
				</div>
			</div>
			<div class="teams__item__buttons">
				<div class="button button_green" @click="saveTeam(team)">сохранить</div>
				<div class="button button_red" @click="deleteTeam(team)">удалить</div>
			</div>
		</div>
	</div>
</template>
<script>
export default
{
	data()
	{
		return {
			teams: []
		}
	},
	methods:
	{
		addTeam()
		{
			this.teams.push({
				name: '',
				score: 0
			});
		},

		async saveTeam(team)
		{
			let newTeam = await this.$store.dispatch('saveTeam', team);

			for(let index in this.teams)
			{
				if(JSON.stringify(team) !== JSON.stringify(this.teams[index]))
					continue;
				this.$set(this.teams, index, newTeam);
			}
		},

		deleteTeam(team)
		{
			this.$store.commit('deleteTeam', team._id);

			for(let [index, t] of this.teams.entries())
			{
				if(t._id != team._id)
					continue;

				this.$delete(this.teams, index);
				break;
			}
		}
	},
	mounted()
	{
		for(let team of this.$store.state.teams)
			this.teams.push(Object.assign({}, team));
	}
}
</script>
<style lang="scss">
.teams__add-btn-wr
{
	margin-top: 12px;
	margin-bottom: 12px;
}
.teams__item
{
	margin-top: 20px;
	padding: 14px;
	background: #f4f4f4;
	display: flex;
	flex-wrap: nowrap;
}
.teams__item__buttons
{
	display: flex;
	flex-wrap: wrap;
	flex-grow: 0;
	align-items: flex-start;
}
.teams__item__fields
{
	flex-grow: 1;
}
.teams__item__field-label
{
	font-family: 'Roboto-bold';
	margin-bottom: 14px;
}
.teams__item__field-input
{
	background: #fff;
	padding: 12px 14px;
	margin-bottom: 14px;
	border: none;
	outline: none;
	width: 100%;
}
</style>