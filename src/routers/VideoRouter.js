import express from 'express';
import { see, edit, upload, remove  } from '../controllers/VideoController'

const videoRouter = express.Router();

videoRouter.get('/uplaod', upload)
videoRouter.get('/:id(\\d+)', see)
videoRouter.get('/:id(\\d+)/edit', edit)
videoRouter.get('/:id(\\d+)/delete', remove)

export default videoRouter