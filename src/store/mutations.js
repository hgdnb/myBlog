import * as types from './mutation-types'

const mutaions = {
  [types.isLoading] (state, info) {
    state.isLoading = info
  }
}

export default mutaions
