import express from 'express';
import { watch, getEdit, postEdit, getUpload, postUpload, deleteVideo  } from '../controllers/VideoController'

const videoRouter = express.Router();
// path - /videos

videoRouter.route('/upload').get(getUpload).post(postUpload)
videoRouter.get('/:id([0-9a-f]{24})', watch)
videoRouter.route('/:id([0-9a-f]{24})/edit').get(getEdit).post(postEdit)
videoRouter.route('/:id([0-9a-f]{24})/delete').get(deleteVideo)


export default videoRouter