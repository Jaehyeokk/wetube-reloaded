import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 20 },
  hashtags: { type: Array, trim: true },
  createdAt: { type: String, default: Date.now, required: true},
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
})

videoSchema.static('formatHashtags', function(hashtags) {
  return hashtags.trim().split(',').map((word) => word.startsWith('#') ? word : `#${word}`)
})

const VideoModel = mongoose.model('Video', videoSchema)

export default VideoModel