const express = require('express');
const { fetchPosts, fetchImages } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  const { searchParams } = new URL(req.originalUrl, `http://${req.headers.host}`);
  const cursor = searchParams.get("start");
  const limit = searchParams.get("limit");
  console.log(cursor,limit)
  try {
    const posts = await fetchPosts({cursor,limit});
    const userPromises=posts.map((post) =>fetchUserById(post.userId))
    const imgPromises = posts.map(post => fetchImages(post.id));
    const imagesArrays = await Promise.all(imgPromises);
    const userArrays = await Promise.all(userPromises);
    const postsWithImages = posts.map((post, index) => ({
      ...post,
      images: imagesArrays[index]
    }));
    const postWithImageAndUserdata= postsWithImages.map((post,index)=>({
      ...post,
      userData:userArrays[index]
    }))

    res.json(postWithImageAndUserdata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
