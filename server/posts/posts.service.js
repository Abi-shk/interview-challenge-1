const axios = require('axios').default;

/**
 * Fetches posts from a remote API.
 * @async
 * @param {Object} [params] - The parameters for fetching posts.
 * @param {number} [params.start=0] - The start index of posts to fetch.
 * @param {number} [params.limit=10] - The maximum number of posts to fetch.
 * @returns {Promise<Array>} - A promise that resolves to an array of posts.
 */
async function fetchPosts({cursor,limit}) {
  const { data: posts } = await axios.get(
    'https://jsonplaceholder.typicode.com/posts?limit',
    {
      params: {
        _start: cursor,
        _limit: limit,
      },
    },
  );

  return posts;
}

const fetchImages = async (postId) => {
  try {
    const res = await axios.get(`https://jsonplaceholder.typicode.com/albums/${postId}/photos`,
      {
        params:{
          _start:0,
          _limit:5
        }
      }
    )
    return res.data
  } catch (err) {
    console.log(err);
  }
}

module.exports = { fetchPosts, fetchImages };