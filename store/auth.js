export const state = () => ({
  // identity: {},
  credentials: null,
 })
  
export const mutations = {
  credentials(state, data) {
    state.credentials = data
  },
  // setProfile(state, data) {
  //   state.identity = data;
  // },
  destroy(state) {
    state.identity = {};
    state.credentials = null;
  }
}