export const state = () => ({
  all_members: [],
})


export const mutations = {
    loadMembers(state, value) {
        state.all_members = value
    },
}