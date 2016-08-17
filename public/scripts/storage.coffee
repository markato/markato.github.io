_ = require 'underscore'

module.exports.init = (firebase, user) ->
  getUserBucket: (callback) ->
    return callback(null) unless user?

    firebase.database().ref("/users/#{user.uid}").once('value')
    .then (snapshot) =>
      callback snapshot.val()
    .catch (err) =>
      console.log err
      alert err

  setUserBucketKey: (key, val) ->
    firebase.database().ref("/users/#{user.uid}/#{key}").set(val)
