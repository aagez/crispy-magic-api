
module.exports = {
  facebook: {
    clientID : FACEBOOK_ID_HERE,
    clientSecret : 'FACEBOOK_SECRET_HERE',
    callbackURL : 'http://localhost:8080/auth/facebook/callback'
  },
  google: {
    clientID: 'GOOGLE_ID_HERE',
    clientSecret: 'GOOGLE_SECRET_HERE',
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },
  twitter: {
    consumerKey: 'TWITTER_KEY_HERE',
    consumerSecret: 'TWITTER_SECRET_HERE',
    callbackURL: "http://localhost:8080/auth/twitter/callback"
  }
}