import axios from 'axios'
import { createStore } from 'vuex'

export default createStore({
  state: {
    authorization: localStorage.getItem("token"),
    name: localStorage.getItem("name"),
    plate: [],
    postList: [] as Object[],
  },
  getters: {
    getAuthToken: (state) => {
      return state.authorization
    },
    getName: (state) => {
      return state.name
    },
    getPlate: (state) => {
      return state.plate
    },
    getPlateName: (state) => (id: number) => {
      for (let i = 0; i < state.plate.length; i++) {
        if (state.plate[i]["id"] == id) {
          return state.plate[i]["name"]
        }
      }
    },
    getPlateData: (state) => (id: number) => {
      for (let i = 0; i < state.plate.length; i++) {
        if (state.plate[i]["id"] == id) {
          return state.plate[i]
        }
      }
      return null
    },
    getPost: (state) => (id: number) => {
      for (let i = 0; i < state.postList.length; i++) {
        if (state.postList[i]["id"] == id) {
          return state.postList[i]
        }
      }
      return null
    }
  },
  mutations: {
    setAuthToken: (state, token: string) => {
      state.authorization = token
      localStorage.setItem("token", token)
    },
    setName: (state, name: string) => {
      state.name = name
      localStorage.setItem("name", name)
    },
    setPlate: (state, plate) => {
      state.plate = plate
    },
    addPost: (state, post: Object) => {
      state.postList.push(post)
    }
  },
  actions: {
  },
  modules: {
  }
})
