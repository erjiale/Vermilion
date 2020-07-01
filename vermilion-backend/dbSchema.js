// DB Schema to keep track of how the db looks like

let db = {
    users: [
        {
            userId: 'adfdsagij234rt95ihj',
            email: 'test@mail.com',
            handle: 'user',
            createdAt: '2020-05-31T00:13:45.927Z',
            imageUrl: 'image/about.png',
            bio: "about me",
            website: 'https://user.com',
            location: 'New York, NY'
        }
    ],
    posts: [
        {
            userHandle: 'user',
            body: 'post body',
            createdAt: '2020-05-31T00:13:45.927Z',
            likeCount: '6',
            commentCount: '2'
        }
    ],
    comments: [
        {
            userHandle: 'user',
            postId: 'ijafoskabksdm32',
            body: 'body',
            createdAt: '2020-05-31T00:13:45.927Z'
        }
    ],
    notification: [
        {
            recipient: 'user',
            sender: 'jay',
            read: 'true | false',
            postId: 'ijafoskabksdm32',
            type: 'like | comment',
            createdAt: '2020-05-31T00:13:45.927Z'
        }
    ]
}

const UserDetails = {
    // Redux data - this will be the variables contained by the Redux when we set it up
    credentials: {
        userId: 'adfdsagij234rt95ihj',
        email: 'test@mail.com',
        handle: 'user',
        createdAt: '2020-05-31T00:13:45.927Z',
        imageUrl: 'image/about.png',
        bio: "about me",
        website: 'https://user.com',
        location: 'New York, NY'
    },
    likes: [
        {
            userHandle: 'user',
            postId: 'fsgat34q3hw4tsewfb'
        },
        {
            userHandle: 'user',
            postId: 'nagsjndbsnr43ior4j'
        }
    ]
}

