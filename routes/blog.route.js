const express = require('express');
const { auth } = require('../middelware/auth');
const { BlogModel } = require('../models/blog.model');

const blogRoute = express.Router();


blogRoute.post('/blogs', async (req, res) => {
  console.log(JSON.stringify(req.body))
  try {
      const { title, username, category, content } = req.body;
      const blogs = new BlogModel({title, username, category, content})
      await blogs.save()
      res.status(201).json(blogs)
  }catch(err){
      res.status(500).json({error:'Book Not Added!'})
  }
})

blogRoute.get('/blogs', auth, async (req, res) => {
    try {
      const { category, title, sort, order } = req.query;
      let filter = {};
  
      if (category) {
        filter.category = category;
      }
  
      if (title) {
        filter.title = { $regex: new RegExp(title, 'i') };
      }
  
      let sortCriteria = {};
  
      if (sort === 'date') {
        sortCriteria.date = order === 'desc' ? -1 : 1;
      } else {
        sortCriteria.date = 1;
      }
  
      const blogs = await BlogModel.find(filter).sort(sortCriteria);
      res.status(200).json(blogs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  


blogRoute.patch('/blogs/:id', auth, async (req, res) => { 
  const { id } = req.params;
  try {
    await BlogModel.findByIdAndUpdate(id, req.body);
    res.status(200).json({ msg: 'blog updated' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

blogRoute.delete('/blogs/:id', auth, async (req, res) => { 
  const { id } = req.params;
  try {
    await BlogModel.findByIdAndDelete(id); 
    res.status(202).json({ msg: 'blog Deleted!' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

blogRoute.post('/blogs/:id/comment', auth, async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user = req.user; 
      const blog = await BlogModel.findById(id);
  
      if (!blog) {
        return res.status(404).json({ msg: 'blog not found' });
      }
  
      const comment = {
        content: content,
        username: user
      };
  
      blog.comments.push(comment);
  
      await blog.save();
  
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
 
  

module.exports = { blogRoute };