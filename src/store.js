import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//防止刷新问题
let Tid = sessionStorage.getItem("Tid")|| 1
// console.log("获取缓存", Tid)

export default new Vuex.Store({
    state: {
        // bigNavName: "1",
        // twoNavNameId: "1",
        Tid: Tid,//顶部tabid
    },
    mutations: {
        // getBigNavName(state, value) {
        //     console.log(value)  
        //     state.bigNavName = value
        // },
        // getTwoNavNameId(state, value) {
        //     console.log(value)
        //     state.twoNavNameId = value
        // },
    },
    actions: {}
})
