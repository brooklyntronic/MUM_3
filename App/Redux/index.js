import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    nav: require('./NavigationRedux').reducer,
    search: require('./SearchRedux').reducer,
    user: require('./UserRedux').reducer,
    matchups: require('./MatchupRedux').reducer,
    messages: require('./MessagesRedux').reducer,
    file: require('./FileRedux').reducer
  })

  return configureStore(rootReducer, rootSaga)
}
