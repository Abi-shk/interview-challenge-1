import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import { useWindowWidth } from '../context/WidthContext';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [nomoreData, setNomoreData] = useState(false);

  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    fetchPost();
  }, [isSmallerDevice]);

  const fetchPost = async () => {
    setIsLoading(true)
    const { data: data } = await axios.get('/api/v1/posts', {
      params: { start: cursor, limit: isSmallerDevice ? 6 : 12 },
    });
    setPosts([...posts, ...data]);
    if (!isSmallerDevice && data.length < 12) {
      setNomoreData(true)
    } else if (isSmallerDevice && data.length < 6) {
      setNomoreData(true)
    }
    setCursor(isSmallerDevice ? cursor + 6 : cursor + 12);
    setIsLoading(false);
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LoadMoreButton hidden={nomoreData} onClick={fetchPost} disabled={isLoading}>
          {!isLoading ? 'Load More' : 'Loading...'}
        </LoadMoreButton>
      </div>
    </Container>
  );
}