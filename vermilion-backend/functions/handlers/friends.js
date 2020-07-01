const { db } = require('../util/admin');

exports.sendFriendRequests = (req, res) => {
    const friendReq = {
        createdAt: new Date().toISOString(),
        sender: req.user.handle,
        recipient: req.params.handle,
        senderImageUrl: req.user.imageUrl
    };

    db.doc(`/users/${req.params.handle}`)
        .get()
        .then(doc => {
            if(doc.exists && req.params.handle !== req.user.handle) {
                return db.collection('friend-requests')
                        .where('recipient', '==', req.params.handle)
                        .where('sender', '==', req.user.handle)
                        .limit(1)
                        .get()
            }
            else if(req.params.handle === req.user.handle) {
                return res.status(400).json({ error: 'Cannot send friend request to yourself'});
            }
            else {
                return res.status(404).json({ error: 'User not found'});
            }
        })
        .then(data => {
            if(data.empty) {
                return db.collection('friend-requests')
                    .where('sender', '==', req.params.handle)
                    .where('recipient', '==', req.user.handle)
                    .limit(1)
                    .get()
            }
            else {
                return res.status(400).json({ error: 'Friend request pending'})
            }
        })
        .then(data => {
            if(data.empty) {
                return db.collection('friends')
                        .where('friend1', '==', req.user.handle)
                        .where('friend2', '==', req.params.handle)
                        .get()
            }
            else {
                return res.status(400).json({ error: req.params.handle + ' already sent you a friend request'})
            }
        })
        .then(data => {
            if(data.empty) {
                return db.collection('friends')
                    .where('friend2', '==', req.user.handle)
                    .where('friend1', '==', req.params.handle)
                    .get()
            }
            else {
                return res.status(400).json({ error: 'You and ' + req.params.handle + ' are already friends'})
            }
        })
        .then(data => {
            if(data.empty) {
                db.collection('friend-requests').add(friendReq);
            }
            else {
                return res.status(400).json({ error: 'You and ' + req.params.handle + ' are already friends'})
            }
        })
        .then(() => {
            return res.json(friendReq);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ general: 'An error occurred with the server'} + err);
        })
};

exports.getFriendRequests = (req, res) => {
    db.collection('friend-requests')
        .where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let friendRequests = [];
            data.forEach(doc => {
                friendRequests.push({
                    createdAt: doc.data().createdAt,
                    sender: doc.data().sender,
                    recipient: doc.data().recipient,
                    senderImageUrl: doc.data().senderImageUrl
                })
            })
            return res.json(friendRequests);
        })
        .catch(err => console.error(err));
};

exports.deleteFriendRequest = (req, res) => {
    const document = db.doc(`/friend-requests/${req.params.friendReqId}`);

    document.get()
        .then(doc => {
            if(doc.exists) {
                // check: only recipient or sender of the friend request can delete it
                if(doc.data().recipient === req.user.handle || doc.data().sender === req.user.handle) { 
                    document.delete();
                }
                else {
                    return res.status(403).json({ error: 'Unauthorized'})
                }
            }
            else {
                return res.status(404).json({error: 'Friend Request not found'})
            }
        })
        .then(() => {
            res.json({ error: 'Friend Request deleted successfully' })
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ general: 'Something wrong with the server'})
        });
};

exports.acceptFriendRequest = (req, res) => {
    const document = db.doc(`/friend-requests/${req.params.friendReqId}`);
    const friend = {
        friend1: req.user.handle,
        friend1Image: req.user.imageUrl,
        createdAt: new Date().toISOString()
    };

    document
        .get()
        .then(doc => {
            if(doc.exists) {
                if(doc.data().recipient === req.user.handle) {
                    friend.friend2 = doc.data().sender;
                    friend.friend2Image = doc.data().senderImageUrl;
                    document.delete();
                    db.collection('friends').add(friend)
                }
                else {
                    return res.status(403).json({ error: 'Unauthorized'})
                }
            }
            else {
                return res.status(404).json({ error: 'Friend Request not found'})
            }
        })
        .then(() => {
            return res.json(friend)
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ general: 'Something wrong with the server'})
        })
};

exports.getAllFriends = (req, res) => {
    let friends = [];
    db.collection('friends')
        .where('friend1', '==', req.user.handle)
        .get()
        .then(data => {
            data.forEach(doc => {
                friends.push({
                    friend: doc.data().friend2,
                    friendImage: doc.data().friend2Image
                })
            })
            return db.collection('friends')
                .where('friend2', '==', req.user.handle)
                .get()
        })
        .then(data => {
            data.forEach(doc => {
                friends.push({
                    friend: doc.data().friend1,
                    friendImage: doc.data().friend1Image
                })
            })
            return res.json(friends);
        })
        .catch(err => {
            console.error(err);
        })
};