import data from './teams.json';

export const builders = data.members.map(member => {
	const team = data.teams.find(t => t.id === member.teamId);
	return {
		...member,
		department: team ? team.name : 'Unassigned'
	};
});
