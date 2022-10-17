export const state = () => ({
    labels: []
})
  
export const mutations = {
    loadLabels(state, value) {
        state.labels = value
    }
}