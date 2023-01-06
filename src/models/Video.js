import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, default: '', required: true, trim: true, minLength: 5, MAxLength: 30 },
  fileUrl: { type: String, required: true },
  description: { type: String, default: '', required: true, trim: true, minLength: 20, maxLength: 140 },
  createdAt: { type: Date, default: Date.now, required: true },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'User' },
});

videoSchema.static('formatHashTags', (hashtags) => {
  return hashtags.split(',').map((word) => (word.startsWith('#') ? word : `#${word}`));
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
