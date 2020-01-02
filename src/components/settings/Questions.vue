<template>
	<div class="questions">
		<div class="questions__add-btn-wr">
			<div class="button button_green" @click="addGroup">добавить группу вопросов</div>
		</div>
		<QuestionsGroup v-for="(group, index) in groups" :key="index" :group="group" @deleteGroup="deleteGroup"/>
	</div>
</template>
<script>
import QuestionsGroup from '@/components/settings/QuestionsGroup.vue'
export default
{
	components:
	{
		QuestionsGroup
	},
	data()
	{
		return {
			groups: []
		}
	},
	methods:
	{
		addGroup()
		{
			this.groups.push({
				name: '',
				show: true,
				questions: []
			});
		},

		async deleteGroup(groupData)
		{
			await this.$store.commit('deleteGroup', groupData);

			for(let [index, group] of this.groups.entries())
			{
				if(group.id != groupData.id)
					continue;
				this.groups.splice(index, 1);
				break;
			}
		}
	},
	mounted()
	{
		for(let group of this.$store.state.questionsGroups)
			this.groups.push(Object.assign({}, group));
	}
}
</script>
<style lang="scss">
.questions__add-btn-wr
{
	margin-top: 12px;
}
</style>