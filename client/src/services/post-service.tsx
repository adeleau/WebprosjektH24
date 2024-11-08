import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Post = {
    post_id: number;
    user_id: number;
    title: string;
    content: string;
    image: string;
    created_at: Date;
    updated_at: Date;
  };
  
  export type PostComment = {
    postcomment_id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at: Date;
  };
  
//   export type PostLike = {
//     poslike_id: number;
//     post_id: number;
//     like_count: number;
//   };

export type PostCardProps = {
    post: Post;
};

class PostService {
    get(post_id: number) {
      return axios
        .get<Post>('/posts/' + post_id)
        .then((response) => response.data);
    }
  
    getAll() {
      return axios
        .get<Post[]>('/posts')
        .then((response) => response.data);
    }
  
    createPost(title: string, user_id: number, content: string, image: string, created_at: Date) {
      return axios
        .post<Post>('/posts', { title: title, user_id: user_id, content: content, image: image, created_at: created_at })
        .then((response) => response.data.post_id);
    }
  
    updatePost(post_id: number, title: string, content: string, image: string, created_at: Date, updated_at: Date) {
      return axios
        .put<Post>('/posts/' + post_id, { title: title, content: content, image: image, created_at: created_at, updated_at: updated_at })
        .then((response) => response.data.post_id);
    }
  
    deletePost(post_id: number) {
      return axios
        .delete<Post>('/posts/' + post_id)
        .then((response) => response.data.post_id);
    }
  
    // likePost(post_id: number): Promise<void> {
    //   return axios
    //   .post('/posts/' + post_id + '/likes')
    //   .then(() => {});
    // }
  
    // getPostLikes(post_id: number): Promise<number> {
    //   return axios
    //     .get<{ like_count: number }>('/posts/' + post_id + '/likes')
    //     .then((response) => response.data.like_count);
    // }
  
    addPostComment(post_id: number, user_id: number, content: string, created_at: Date) {
      return axios
        .post<PostComment>('/posts/' + post_id + '/comments', { user_id, content, created_at })
        .then((response) => response.data.postcomment_id);
    }
  
    getPostComments(post_id: number) {
      return axios
        .get<PostComment[]>('/posts/' + post_id + '/comments')
        .then((response) => response.data);
    }
}

export default new PostService();