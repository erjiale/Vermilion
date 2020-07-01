const { db } = require('../util/admin');

exports.getAllPosts = (req, res) => {
    db
        .collection('posts')
        .orderBy('createdAt', 'desc') // orders how posts is saved by latest to newest posts
        .get()
        .then(data => {
            let posts = [];
            data.forEach(doc => {
                posts.push({
                    postId: doc.id,
                    body: doc.data().body, // same as `...doc.data()`, spread-operator
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount,
                    userImage: doc.data().userImage
                });
            });
            return res.json(posts);
        })
        .catch(err => console.error(err));
};

exports.postOnePost = (req, res) => {
    if(req.body.body.trim() === '') {
        return res.status(400).json({ body: "Must not be empty"})
    }
    const newPost = {
        body: req.body.body,
        // userHandle: req.body.userHandle,
        userHandle: req.user.handle, // now after FBAuth, we have a req.user.handle we can use directly
        userImage: req.user.imageUrl, // 10)
        createdAt: new Date().toISOString(), // changes the data from unix to actual time "2020-05-31T00:13:45.927Z"
        likeCount: 0,
        commentCount: 0
    };

    db
        .collection('posts')
        .add(newPost)
        .then(doc => {
            const resPost = newPost; // constants you can change the key values but not the actual data type or complete value of the object
            resPost.postId = doc.id;
            res.json(resPost);
        })
        .catch(err => {
            res.status(500).json({ err: 'something went wrong with server'}); // status 500: server problem
            console.error(err);
        })
}

// GET one specific post
exports.getPost = (req, res) => {
    let postData = {};

    db.doc(`/posts/${req.params.postId}`).get()
        .then(doc => {
            if(!doc.exists) {
                return res.status(404).json({ error: 'Post not found' })
            }
            postData = doc.data();
            postData.postId = doc.id;
            return db
                .collection('comments')
                .orderBy('createdAt', 'desc')
                .where('postId', '==', req.params.postId)
                .get() // fetch comments of this scream
        })
        .then(data => {
            postData.comments = [];
            data.forEach(doc => {
                postData.comments.push(doc.data())
            });
            return res.json(postData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code })
        })
};

// Comment on Post
exports.commentOnPost = (req, res) => {
    if(req.body.body.trim() === '') return res.status(400).json({ comment: 'Must not be empty' });

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        postId: req.params.postId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl // this is an add-on: to fetch the commentators' image next to a comment
    }

    // check the post still exits
    db.doc(`/posts/${req.params.postId}`).get()
        .then(doc => {
            if(doc.exists) {
                doc.ref.update({ commentCount: doc.data().commentCount + 1 }) // Increment the commentCount by 1
                return db.collection('comments').add(newComment);
            }
            else {
                return res.status(404).json({ error: 'Post not found'})
            }
        })
        .then(() => { // document added succesfully
            return res.json(newComment); // So we return newComment back to the user
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: 'Something wrong' });
        })
};

// Like a Post
exports.likePost = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('postId', '==', req.params.postId).limit(1); // it's a query and will return some docs, so we limit(1), will still return an array of size 1;
    
    const postDocument = db.doc(`/posts/${req.params.postId}`);

    let postData;

    // first check whether the post exists, and then whether we've liked it already
    postDocument.get()
        .then(doc => {
            if (doc.exists) {
                postData = doc.data();
                postData.postId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Post not found' });
            }
        })
        .then(data => {
            if(data.empty) { // if not liked yet
                return db.collection('likes').add({
                    postId: req.params.postId,
                    userHandle: req.user.handle
                })
                .then(() => {
                    postData.likeCount++; // we have to update the number of likes the post has
                    return postDocument.update({ likeCount: postData.likeCount }) 
                })
                .then(() => {
                    return res.json(postData);
                })
            } else {
                return res.status(400).json({ error: 'Post already liked' })
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
    
};

// Unlike a Post
exports.unlikePost = (req, res) => {
    const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
        .where('postId', '==', req.params.postId).limit(1); // it's a query and will return some docs, so we limit(1), will still return an array of size 1;

    const postDocument = db.doc(`/posts/${req.params.postId}`);

    let postData;

    // first check whether the post exists, and then whether we've liked it already
    postDocument.get()
        .then(doc => {
            if (doc.exists) {
                postData = doc.data();
                postData.postId = doc.id;
                return likeDocument.get();
            } else {
                return res.status(404).json({ error: 'Post not found' });
            }
        })
        .then(data => {
            if(data.empty) { // if not liked
                return res.status(400).json({ error: 'Post not liked' })
            } else { // unlike only if it has already been liked
                return db.doc(`likes/${data.docs[0].id}`).delete()
                    .then(() => {
                        postData.likeCount--;
                        return postDocument.update({ likeCount: postData.likeCount });
                    })
                    .then(() => {
                        res.json(postData)
                    })
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code });
        })
};

// Delete a Post
exports.deletePost = (req, res) => {
    const document = db.doc(`/posts/${req.params.postId}`);
    document.get()
        .then(doc => {
            if(!doc.exists) {
                return res.status(404).json({ error: 'Post not found' })
            }
            // check we are deleting our own post and not someone else's
            if(doc.data().userHandle !== req.user.handle) {
                return res.status(403).json({ error: "Unauthorized" })
            }
            else {
                document.delete()
            }
        })
        .then(() => {
            res.json({ error: 'Post deleted successfully' })
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code })
        }) 
};