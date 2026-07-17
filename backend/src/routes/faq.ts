import { Router } from 'express';
import { faqService } from '../services/faqService';
import { ApiError } from '../types';

const router = Router();

// List FAQs
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const faqs = await faqService.list(category as string);
    res.json(faqs);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(400).json({ code: error.code, message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Failed to fetch FAQs' });
    }
  }
});

export { router as faqRoutes };
