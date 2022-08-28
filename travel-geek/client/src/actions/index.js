import axios from 'axios';
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG } from './types';
import Cookies from 'js-cookie';

export const fetchUser = () => async dispatch => {
  let token = Cookies.get('jwt');
  console.log('jwt token: ', token);
  const res = await axios.get('/api/current_user', {
    headers: { Authorization: `Bearer ${token}`}
  });

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, file, history) => async dispatch => {

  const uploadConfig = await axios.get('/api/blogs/image/presigned-url');
  console.log('uploadConfig: ', uploadConfig);

  await axios.put(uploadConfig.data.url, file, {
    headers: {
      'Content-Type': file.type
    }
  })
  console.log('values: ', values);



  const res = await axios.post('/api/blogs', {
    ...values,
    url: uploadConfig.data.key
  });

  history.push('/blogs');
  dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const fetchBlogs = () => async dispatch => {
  const res = await axios.get('/api/blogs', );

  dispatch({ type: FETCH_BLOGS, payload: res.data });
};

export const fetchBlog = id => async dispatch => {
  const res = await axios.get(`/api/blogs/${id}`);

  dispatch({ type: FETCH_BLOG, payload: res.data });
};
