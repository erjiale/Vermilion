const functions = require('firebase-functions');
const express = require('express'); //setting up express
const app = express();
const cors = require('cors');

const { db } = require('./util/admin');

const FBAuth = require('./util/fbAuth'); // for private requests
const { 
    getAllPosts, 
    postOnePost, 
    getPost,
    commentOnPost,
    likePost,
    unlikePost,
    deletePost
} = require('./handlers/posts');
const { 
    signup, 
    login, 
    uploadImage, 
    addUserDetails, 
    getAuthenticatedUser,
    getUserDetails,
    markNotificationsRead,
    signupWithProvider,
    searchUsers
} = require('./handlers/users');
const {
    sendFriendRequests,
    getFriendRequests,
    deleteFriendRequest,
    acceptFriendRequest,
    getAllFriends
} = require('./handlers/friends');

app.use(cors());

// Posts Routes -- /api/...
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, postOnePost);
app.get('/post/:postId', getPost); // the colon ':' in the url tells to take its value as a param
app.post('/post/:postId/comment', FBAuth, commentOnPost); //comment on post
app.get('/post/:postId/like', FBAuth, likePost);
app.get('/post/:postId/unlike', FBAuth, unlikePost);
app.delete('/post/:postId', FBAuth, deletePost);
// Users Routes -- /api/...
app.post('/signup', signup);
app.post('/signup/provider', signupWithProvider);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);
app.get('/users', searchUsers); // with query => /?search={query}
// Friends Routes
app.post('/friend-request/:handle', FBAuth, sendFriendRequests);
app.get('/friend-requests', FBAuth, getFriendRequests);
app.delete('/friend-request/:friendReqId', FBAuth, deleteFriendRequest);
app.post('/friend-request/:friendReqId/accept', FBAuth, acceptFriendRequest);
app.get('/friends', FBAuth, getAllFriends);

// https://baseurl.com/api/
exports.api = functions.https.onRequest(app); // export the app route with all the functions

// Database Triggers
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
    .onCreate(snapshot => { // snapshot of this like document created
        return db.doc(`/posts/${snapshot.data().postId}`).get() // returns a promise
        .then(doc => {
            if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'like',
                    read: false,
                    postId: doc.id
                });
            }
        })
        .catch(err => {
            console.error(err);
        })
    });

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
    .onDelete(snapshot => {
        return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(err => {
                console.error(err)
            });
    });

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
    .onCreate(snapshot => {
        return db.doc(`/posts/${snapshot.data().postId}`).get() // returns a promise
        .then(doc => {
            if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
                return db.doc(`/notifications/${snapshot.id}`).set({
                    createdAt: new Date().toISOString(),
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    type: 'comment',
                    read: false,
                    postId: doc.id
                })
            }
        })
        .catch(err => {
            console.error(err);
        })
    });

exports.onUserImageChange = functions.firestore.document('users/{id}')
    .onUpdate(change => {
        console.log(change.before.data());
        console.log(change.after.data());
        // eventually may want to update more than one post, batch write needed
        if(change.before.data().imageUrl !== change.after.data().imageUrl) {
            console.log('image has changed');
            let batch = db.batch();
            return db.collection('posts')
                .where('userHandle', '==', change.before.data().handle)
                .get()
                .then(data => {
                    data.forEach(doc => {
                        const post = db.doc(`/posts/${doc.id}`)
                        batch.update(post, { userImage: change.after.data().imageUrl})
                    })
                    return batch.commit();
                });
        } else return true; // otherwise we return undefined 
        
    })

exports.onPostDelete = functions.firestore.document('posts/{postId}')
    .onDelete((snapshot, context) => {
        const postId = context.params.postId;
        const batch = db.batch();
        return db.collection('comments')
            .where('postId', '==', postId) 
            .get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/comments/${doc.id}`))
                })
                return db.collection('likes')
                    .where('postId', '==', postId)
                    .get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/likes/${doc.id}`))
                })
                return db.collection('notifications')
                    .where('postId', '==', postId)
                    .get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`))
                })
                return batch.commit()
            })
            .catch(err => {
                console.error(err);
            })
    })

exports.onUserDelete = functions.firestore.document('users/{userHandle}')
    .onDelete((snapshot, context) => {
        const userHandle = context.params.userHandle;
        const batch = db.batch();

        return db.collection('posts')
            .where('userHandle', '==', userHandle)
            .get()
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/posts/${doc.id}`))
                })
                return db.collection('notifications')
                    .where('recipient', '==', userHandle)
                    .get()
            })
            .then(data => {
                data.forEach(doc => {
                    batch.delete(db.doc(`/notifications/${doc.id}`))
                })
                return batch.commit();
            })
            .catch(err => {
                console.error(err);
            })
    })