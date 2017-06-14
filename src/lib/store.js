import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import rootReducer from '../reducers/rootReducer';
import { persistentStore } from 'redux-pouchdb';
import PouchDB from 'pouchdb';
import PouchDBauth from 'pouchdb-authentication';

import credentials from './credentials.json';

PouchDB.plugin(PouchDBauth);
const db = new PouchDB('thoughts');
const remoteDb = new PouchDB(credentials.server)

remoteDb.login(credentials.name, credentials.password).then(function() {
  // Sync setups
  db.sync(remoteDb, {
    live: true,
    retry: true
  }).on('change', function (change) {
    // yo, something changed!
    console.log("something changed", change);
  }).on('paused', function (info) {
    // replication was paused, usually because of a lost connection
    console.log("connection lost/paused", info);
  }).on('active', function (info) {
    // replication was resumed
    console.log("connection regained", info);
  }).on('error', function (err) {
    // totally unhandled error (shouldn't happen)
    console.log("something broke", err);
  });
}).catch(function(error) {
  console.error("Cannot connect to remote DB:", error);
});


const createStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  persistentStore(db)
)(createStore);

const initialState = {
  ui: {
    currentThoughtInputValue: "",
  },
  thoughts: {
    thoughts: [],
  }
};

const store = createStoreWithMiddleware(rootReducer, initialState);

export default store;
