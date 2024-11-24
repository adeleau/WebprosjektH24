import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/';

export type Post = {
    post_id: number;
    user_id: number;
    username?: string;
    title: string;
    content: string;
    image: string;
    created_at: Date;
    updated_at: Date;
};

class PostService {
  get(post_id: number) {
    return axios.get<Post>('/posts/' + post_id)
    .then((response) => response.data);
  }
  
  getAll() {
    return axios
      .get<Post[]>('/posts')
      .then((response) => response.data);
  }
  
  createPost(user_id: number, title: string, content: string, image: string): Promise<number> {
    return axios
      .post('/posts', { user_id, title, content, image })
      .then((response) => response.data.post_id);
  }
  
    
    updatePost(post_id: number, title: string, content: string, image: string) {
    
      return axios
        .put(`/posts/${post_id}`, { title, content, image }) 
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          console.error('Post Update Failed:', error.response?.data || error.message);
          throw error;
        });
    }
    
    
  deletePost(post_id: number) {
    return axios.delete('/posts/' + post_id)
    .then((response) => response.data);
  }

}

export default new PostService();