import express from 'express';
import { createContainer, getContainers, deleteContainer } from '../controllers/favoritesContainerController.js';
import { authorization } from '../middlewares/auth.js';

const router = express.Router();

// Routes for managing favorites containers
router.get('/', authorization, getContainers); // Get all containers
router.post('/create', authorization, createContainer); // Create a new container
router.delete('/:containerId', authorization, deleteContainer); // Delete a container

export default router;
