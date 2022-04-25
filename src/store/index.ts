import { createStore } from 'vuex'

export default createStore({
  state: {
    authorization: localStorage.getItem("token"),
    name: localStorage.getItem("name"),
    userId: Number(localStorage.getItem("userId")),
    plate: [],
    postList: [] as Object[],
    imgToken: "",
  },
  getters: {
    getAuthToken: (state) => {
      return state.authorization
    },
    getName: (state) => {
      return state.name
    },
    getUserId: (state) => {
      return state.userId
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
    },
    getImgToken: (state) => {
      return state.imgToken
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
    setUserId: (state, userId: number) => {
      state.userId = Number(userId)
      localStorage.setItem("userId", String(userId))
    },
    setPlate: (state, plate) => {
      state.plate = plate
    },
    addPost: (state, post: Object) => {
      state.postList.push(post)
    },
    setImgToken: (state, token: string) => {
      state.imgToken = token
    }
  },
  actions: {
  },
  modules: {
  }
})
