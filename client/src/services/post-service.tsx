import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';
//////////////endre til postservice
export type Sonny_Angel = {
  angel_id: number;
  series_id: number;
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

export type Product = {
  
}






export type Collection = {
  collection_id: number;
  series: string;
  reldate: Date;
  description: string;
}

export type CollectionComment = {
  colcom_id: number;
  collection_id: number;
  user_id: number; 
  content: string; 
  created_at: Date; 
};

export type CollectionLike = {
  collike_id: number;
  collection_id: number; 
  like_count: number;  
}

class CollectionService{
  // legg inn alle get bla bla
}

const collectionService = new CollectionService();

export type Post = {
  post_id: number;
  title: string;
  user_id: number;
  content: string;
  img: string;
  //likes: number;
};

export type PostComment = {
  poscom_id: number;
  post_id: number;
  user_id: number; 
  content: string; 
  created_at: Date; 
};

export type PostLike = {
  poslike_id: number;
  post_id: number; 
  like_count: number;  
}

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
  create(title: string, user_id: number, content: string, img: string) {
    return axios
      .post<{ post_id: number }>('/posts', { title: title, user_id: user_id, content: content, img: img })
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

  likePost(post_id: number): Promise<void> {
    return axios
    .post('/posts/' + post_id + '/likes')
    .then(() => {});
  }

  getPosLikes(post_id: number): Promise<number> {
    return axios
      .get<{ like_count: number }>('/posts/' + post_id + '/likes')
      .then((response) => response.data.like_count);
  }

  addPosCom(post_id: number, user_id: number, content: string, created_at: Date) {
    return axios
      .post<{ poscom_id: number }>('/posts/' + post_id + '/comments', { user_id, content, created_at })
      .then((response) => response.data.poscom_id);
  }

  getPosComs(post_id: number) {
    return axios.get<PostComment[]>('/posts/' + post_id + '/comments').then((response) => response.data);
  }
}

const postService = new PostService();


export default { angelService, collectionService, postService };