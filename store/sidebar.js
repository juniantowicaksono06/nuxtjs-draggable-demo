export const state = () => ({
  sidebar_data: {},
})


export const mutations = {
    setSidebarData(state, value) {
        state.sidebar_data = value
    },
}