const fakeUser = {
  username: 'Nicolas',
  loggedIn: true,
}

// const videos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const videos = [
  {
    title: 'First Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minutes ago',
    views: 59,
    id: 1,
  },
  {
    title: 'Second Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minutes ago',
    views: 59,
    id: 1,
  },
  {
    title: 'Third Video',
    rating: 5,
    comments: 2,
    createdAt: '2 minutes ago',
    views: 59,
    id: 1,
  },
]

export const trending = (req, res) => res.render('home', { pageTitle: 'Home', fakeUser, videos });
export const see = (req, res) => res.render('watch', { pageTitle: 'Watch' })
export const edit = (req, res) => res.render('edit', { pageTitle: 'Edit' });
export const search = (req, res) => res.send('Search');
export const upload = (req, res) => res.send('Upload Video');
export const remove = (req, res) => res.send('remove Video');