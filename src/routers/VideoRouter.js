import express from 'express';
import { watch, getEdit, postEdit, getUpload, postUpload, remove  } from '../controllers/VideoController'

const videoRouter = express.Router();
// path - /videos

videoRouter.get('/:id(\\d+)', watch)
videoRouter.route('/:id(\\d+)/edit').get(getEdit).post(postEdit)
videoRouter.route('/upload').get(getUpload).post(postUpload)

// videoRouter.get('/:id(\\d+)/delete', remove)

export default videoRouter