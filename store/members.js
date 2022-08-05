export const state = () => ({
  board_members: [],
  board_members_picture: {}
})


export const mutations = {
    loadMembers(state, value) {
        state.board_members = value
    },
    loadMembersPicture(state, value) {
        state.board_members_picture = value
    },
}