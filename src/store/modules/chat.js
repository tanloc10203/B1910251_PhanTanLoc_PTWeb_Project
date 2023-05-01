const state = () => ({
  messages: [],
  typing: false,
});

const mutations = {
  SET_MESSAGES: (state, message) => {
    state.messages = message;
  },
  ADD_MESSAGE: (state, message) => {
    state.messages = [...state.messages, message];
  },
  SET_TYPING: (state, typing) => {
    state.typing = typing;
  },
};

const actions = {
  SET_TYPING: ({ commit }, payload) => {
    commit("SET_TYPING", payload);
  },
  SET_MESSAGES: ({ commit }, payload) => {
    commit("SET_MESSAGES", payload);
  },
  ADD_MESSAGE: ({ commit }, payload) => {
    commit("ADD_MESSAGE", payload);
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
