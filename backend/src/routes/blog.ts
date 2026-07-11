import { Router } from 'express';
import { blogService } from '../services/blogService';
import { ApiError } from '../types';

const router = Router();

// List blog posts
router.get('/', async (req, res) => {
  try {
    const { adminAll } = req.query;
    const posts = await blogService.list(adminAll === 'true');
    res.json(posts);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch blog posts' });
    }
  }
});

// Get blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await blogService.getBySlug(slug);
    res.json(post);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(404).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch blog post' });
    }
  }
});

export { router as blogRoutes };
