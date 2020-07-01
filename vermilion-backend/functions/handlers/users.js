const { admin, db } = require('../util/admin');
const firebase = require('firebase');

const config = require('../util/config');
firebase.initializeApp(config); // needed for authenticating (register, and login)

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validators');

exports.signup = (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle.toLowerCase()
    };
    
    // validate the data, checking fields are not empty, emails are valid, and passwords match.
    // destructuring - we are extracting valid and errors from validateSignupData
    const { valid, errors } = validateSignupData(newUser);
    if(!valid) return res.status(400).json(errors);
    
    const noImg = 'no-img.png' // 7)
    // Validate Uniqueness of both email and handle
    let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exists) { // check if the handle/username exists already
                return res.status(400).json({ handle: 'this handle is already taken'});
            }
            else { // create the user
                return firebase // need to return a promise because inside a .then()
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(idToken => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId // sets userId: userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token })
        })
        .catch(err => {     
            console.error(err);
            if(err.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: 'Email is already in use'});
            }
            else if (err.code === 'auth/weak-password') {
                return res.status(400).json({ password: err.message });
            }
            else {
                return res.status(500).json({ general: 'Something went wrong, please try again' });
                // return res.status(500).json(err);
            }
        });
};

exports.signupWithProvider = (req, res) => {
    const newUser = {
        email: req.body.email,
        handle: req.body.handle,
        uid: req.body.uid
    };

    const noImg = 'no-img.png' // 7)

    // let token, userId;
    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if(doc.exists) { // check if the handle/username exists already
                return res.status(400).json({ handle: 'Handle is taken'});
            }
            else {
                const userCredentials = {
                    handle: newUser.handle,
                    email: newUser.email,
                    createdAt: new Date().toISOString(),
                    imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                    userId: newUser.uid 
                };
                // token = idToken;
                return db.doc(`/users/${newUser.handle}`).set(userCredentials);
            }
        })
        .then((data) => {
            return res.status(201).json({ success: "Signed up!" });
        })
        .catch(err => {     
            console.error(err);
            return res.status(500).json({ general: 'Something wrong with the server' });
        });
};

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    // Got to validate
    const { valid, errors } = validateLoginData(user);
    if(!valid) return res.status(400).json(errors);

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token => {
            return res.json({token});
        })
        .catch(err => {
            console.error(err);
            // if(err.code === 'auth/wrong-password') { // check the email and password match 
            //     return res.status(403).json({ general: 'Wrong credentials' });
            // } 
            if (err.code === 'auth/user-not-found') {
                return res.status(403).json({ general: 'Email not registered' });
            }
            else {
                return res.status(500).json({ general: 'Wrong credentails' });
            }
        })
};

// Add user details.
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() => {
            return res.json({ message: "Details added successfully" })
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}; 

// GET own user details
exports.getAuthenticatedUser = (req, res) => {
    let userData = {};
    db
        .doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            if(doc.exists) {
                userData.credentials = doc.data();
                // get the likes the user has given out
                return db.collection('likes').where('userHandle', '==', req.user.handle).get()
            }
        })
        .then(data => {
            userData.likes = []
            data.forEach(doc => {
                userData.likes.push(doc.data());
            });
            return db.collection('notifications').where('recipient', '==', req.user.handle)
                    .orderBy('createdAt', 'desc').limit(10).get() // limit to 10 notifications
        })
        .then(data => { // this promise - used to return the notifications
            userData.notifications = []
            data.forEach(doc => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    type: doc.data().type,
                    read: doc.data().read,
                    postId: doc.data().postId,
                    notificationId: doc.id
                })
            })
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code })
        })
};

// GET any user's profile details
exports.getUserDetails = (req, res) => {
    const userData = {};

    db.doc(`/users/${req.params.handle.toLowerCase()}`)
        .get()
        .then(doc => {
            if(doc.exists) {
                userData.user = doc.data();
                return db.collection('posts').where('userHandle', '==', req.params.handle.toLowerCase())
                            .orderBy('createdAt', 'desc')
                            .get();
            }
            else {
                return res.status(404).json({ error: 'User not found'})
            }
        })
        .then(data => {
            userData.posts = [];
            data.forEach(doc => {
                userData.posts.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    userHandle: doc.data().userHandle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    postId: doc.id,
                })
            });
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

// Upload User Profile IMG.
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os'); // OS module - provides Operating System-related utility methods and properties.
    const fs = require('fs'); // FS module - provides API for interacting with the file system.

    const busboy = new BusBoy({ headers: req.headers })

    let imageFilename;
    let imageToBeUploaded = {};

    // open the 'file', and then pass parameters for the file.
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
            return res.status(400).json({ error: 'Wrong file type submitted '});  
        }
        // img.png - we aim to get this file extension
        // e.g. 'png'
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFilename = `${Math.round(Math.random()*100000000000)}.${imageExtension}`; // generates a random filename for the img
        const filepath = path.join(os.tmpdir(), imageFilename) //tmpdir = temporary directory
        imageToBeUploaded = { filepath, mimetype }; 

        // use fs system to create the file.
        file.pipe(fs.createWriteStream(filepath)); // pipe() 'jams' all functions passed together.
    });

    // After we've created the file, we 'finish' by storing it on a user's imageUrl
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filepath, {
            resumable: false,
            matadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            // construct the img url to add it to the user
            // w/o alt media, it's gonna download the file to our computer instead of showing it on the browser.
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFilename}?alt=media` 
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl }) // update({ field: value }), updates a docs' field to a new value
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfully'});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
    });
    // Have to end the busboy
    busboy.end(req.rawBody); // property that is in every request Object
};

exports.markNotificationsRead = (req, res) => {
    let batch = db.batch(); // batch write function used when need to write/update multiple documents
    req.body.forEach(notificationId => {
        const notification = db.doc(`/notifications/${notificationId}`)
        batch.update(notification, { read: true })
    });
    batch.commit()
        .then(() => {
            return res.json({ message: 'Notifications marked READ'})
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code })
        });
};

exports.searchUsers = (req, res) => {

    db.collection('users')
        .get()
        .then(data => {
            let allUsers = [];
            data.forEach(doc => {
                allUsers.push({
                    user: doc.data().handle,
                    userImage: doc.data().imageUrl
                })
            })
            allUsers = allUsers.filter(eachUser => 
                eachUser.user.includes(req.query.search.toLowerCase())
            )
            return res.json(allUsers);
        })
        .catch(err => {
            return res.status(500).json({error: 'Something wrong with the server'})
        })

    // db.collection('users')
    //     .get()
    //     .then(data => {
    //         let allUsers = [];
    //         data.forEach(doc => {
    //             allUsers.push({
    //                 user: doc.data().handle
    //             })
    //         })
    //         return res.json(allUsers);
    //     })
    //     .catch(err => {
    //         return res.status(500).json({ error: err});
    //     })
};