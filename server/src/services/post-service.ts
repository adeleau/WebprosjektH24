// VI HAR IKKE LAGT TIL POST I DB ENDA
// import axios from "axios";

// export type Post = {
//     post_id: number; 
    
// };

// export type PostCardProps = {
//     post: Post;
// };

// class PostService {
//     getAll() {
//         return axios.get<Array<Post>>("/posts")
//             .then((res) => res.data)
//             .catch((err) => {
//                 console.error("Error fetching posts:", err);
//                 throw err;
//             });
//     }

//     getById(id: number) {
//         return axios.get<Post>(`/posts/${id}`)
//             .then((res) => res.data)
//             .catch((err) => {
//                 console.error(`Error fetching post with id ${id}:`, err);
//                 throw err;
//             });
//     }
// }

// export default new PostService();