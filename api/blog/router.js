const router = require('express').Router();
import { 
    addEventBlog,
    getEventBlogs,
    getBlogTypes,
    updateEventBlog,
    addBlog,
    getBlogs
} from "./service";

// ### EVENT SPONSORS
router.post('/', addBlog);
router.get('/', getBlogs);
router.post('/ev', addEventBlog);
router.get('/ev', getEventBlogs);
router.get('/ev/count', getEventBlogsCount);
router.get('/types', getBlogTypes);
// router.delete('/:eventBlogId', deleteEventBlog);
router.patch('/ev/:id', updateEventBlog);

module.exports = router;