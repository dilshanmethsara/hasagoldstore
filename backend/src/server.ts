import './lib/env';
import { createApp } from './index.js';

const PORT = process.env.PORT || 3001;

createApp().then((app) => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});
