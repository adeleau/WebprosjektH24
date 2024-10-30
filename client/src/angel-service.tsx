import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Sonny_Angel = {
  angel_id: number;
  series: string;
  name: string;
  description: string;
  image: string;
};

class AngelService {
  /**
   * Get angels with given id.
   */
  get(angel_id: number) {
    return axios.get<Sonny_Angel>('/angels/' + angel_id).then((response) => response.data);
  }

  /**
   * Get all angels.
   */
  getAll() {
    return axios.get<Sonny_Angel[]>('/angels').then((response) => response.data);
  }
}

const angelService = new AngelService();

export type Post = {
  post_id: number;
  title: string;
  content: string;
  img: string;
};

class PostService {
  /**
   * Get posts with given id.
   */
  get(post_id: number) {
    return axios.get<Post>('/posts/' + post_id).then((response) => response.data);
  }

  /**
   * Get all posts.
   */
  getAll() {
    return axios.get<Post[]>('/posts').then((response) => response.data);
  }

  /**
   * Create new post having the given title.
   *
   * Resolves the newly created post id.
   */
  create(title: string, content: string, img: string) {
    return axios
      .post<{ post_id: number }>('/posts', { title: title, content: content, img: img })
      .then((response) => response.data.post_id);
  }

  updatePost(post_id: number, title: string, content: string, img: string) {
    return axios
      .put<{ post_id: number }>('/posts/' + post_id, { title: title, content: content, img: img })
      .then((response) => response.data.post_id);
  }

  deletePost(post_id: number) {
    return axios.delete<{ post_id: number }>('/posts/' + post_id).then((response) => response.data.post_id);
  }
}

const postService = new PostService();

export default { angelService, postService };