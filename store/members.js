export const state = () => ({
  all_members: [],
})


export const mutations = {
    async loadMembers(state, value) {
        state.all_members = value
    },
}