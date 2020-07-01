const { admin, db } = require('./admin');

// fbAUth used to verify the user before letting them post to db
module.exports = (req, res, next) => {
    let idToken; //'Authorization' header's value usually starts with 'Bearer ' followed by a token. Good convention
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1]; // Only want the token
        console.log(idToken);
    }
    else {
        console.error('No token found');
        res.status(403).json({ error: 'Unauthorized'});
    }
    // Now need to verify the token if one is available, and make sure it's a valid token.
    // return res.status(403).json({ msg: idToKen });
    admin
        .auth()
        .verifyIdToken(idToken)
        .then(decodedToken => {
            req.user = decodedToken;
            return db
                .collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1) // limits results to one document
                .get();
        })
        .then(data => {
            req.user.handle = data.docs[0].data().handle; // attaching the user's handle to the req.user to be used later;
            req.user.imageUrl = data.docs[0].data().imageUrl; // 9)++, used for posting a comment
            return next(); // allow request to proceed to app.post('./post',...)
        })
        .catch(err => {
            console.error('Error when verifying token', err);
            return res.status(403).json(err);
        })
};