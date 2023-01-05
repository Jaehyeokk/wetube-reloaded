import Video from '../models/Video'
import User from '../models/User'

// Home
export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({createdAt: 'desc'})
    return res.render('home', { pageTitle: 'Home', videos });  
  } catch (error) {
    return res.render('server-error')
  }
}

// Watch
export const watch = async (req, res) => {
  const { id } = req.params
  const video = await Video.findById(id).populate('owner')
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found.' })
  }
  return res.render('watch', { pageTitle: video.title, video })
}

// Edit
export const getEdit = async (req, res) => {
  const { id } = req.params
  const { user: { _id } } = req.session
  const video = await Video.findById(id)

  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found.' })
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect('/')
  }

  return res.render('edit', { pageTitle: `Edit ${video.title}`, video });
}

export const postEdit = async (req, res) => {
  const { id } = req.params
  const { user: { _id } } = req.session
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id)

  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found.' })
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect('/')
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashTags(hashtags),
  })
  return res.redirect(`/videos/${id}`);
}

// Upload
export const getUpload = (req, res) => {
  return res.render('upload', { pageTitle: `Upload Video`})
}

export const postUpload = async (req,res) => {
  const { user: { _id: owner } } = req.session
  const { path: fileUrl } = req.file
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      fileUrl,
      title,
      description,
      hashtags: Video.formatHashTags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
      owner
    })

    const user = await User.findById(owner)
    user.videos.push(newVideo._id)
    user.save()

    return res.redirect('/')
  } catch (error) {
    return res.render('upload', {pageTitle: 'Upload Video', errorMessage: error._message})
  }
}

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const { user: { _id } } = req.session
  const video = await Video.findById(id)

  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found.' })
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect('/')
  }

  await Video.findByIdAndDelete(id)

  const user = await User.findById(_id);
  user.videos.splice(user.videos.indexOf(id),1);
  user.save();

  return res.redirect('/')
}

export const search = async (req, res) => {
  const { keyword } = req.query
  let videos = []

  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, 'i')
      }
    })
  }

  return res.render('search', { pageTitle: 'Search', videos })
}