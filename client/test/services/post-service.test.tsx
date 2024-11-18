import axios from 'axios';
import postService, {Post, PostComment} from '../../src/services/post-service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PostService test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('get should fetch a single post by ID', async () => {
        const mockPost: Post = {
            post_id: 1,
            user_id: 1,
            username: 'Titty',
            title: 'Titty post',
            content: 'Tittys post',
            image: 'tittyimage.jpg',
            created_at: new Date('2023-01-01T12:00:00Z'),
            updated_at: new Date('2023-01-01T12:00:00Z'),
        };

        const post_id = 1;
        mockedAxios.get.mockResolvedValue({data: mockPost});

        const post = await postService.getAll();
        expect(post).toEqual(mockPosts);
    });

    test('getAll should fetch and return all Posts', async () => {
        const mockPosts: Post = [
            {
                post_id: 1,
                user_id:1,
                username:'Titty',
                title: 'Titty post',
                content: 'Tittys post',
                image: 'Tittyimage.jpg',
                created_at:new Date('2023-01-01T12:00:00Z'),
                updated_at:new Date('2023-01-01T12:00:00Z'),
            },

            {
                post_id: 2,
                user_id: 2,
                username: 'Slikki',
                title: 'Slikki posts',
                content: 'Slikkis post',
                image:'Slikkiimage.jpg',
                created_at: new Date('2023-01-01T12:00:00Z'),
                updated_at:new Date('2023-01-01T12:00:00Z'), 
            },
        ];
        mockedAxios.get.mockResolvedValue({data: mockPosts});

        const posts = await postService.getAll();

        expect(mockedAxios.get).toHaveBeenCalledWith('/posts');
        expect(posts).toEqual(mockPosts);
    });

    test('createPost should create a new post', async () => {
        const newPosts = { name: 'Ny-post' };
        const mockResponse = { post_id: 3, };
        const username = 'Titty post';
        const title = 'Titty post';
        const content = 'Tittys post';
        const image = 'Tittyimage.jpg';
        
        mockedAxios.post.mockedResolvedValue({ data: {sucess: true} });

        const post_id = await postService.createPost(user_id, username, title, content, image);

        expect(mockedAxios.post).toHaveBeenCalledWith('/posts', { user_id, username, title, content, image });
        expect(post_id).toBe(mockResponse.post_id);
    });

    test('updatePost should update a post', async () => {
        const post_id = 1;
        const title = 'Updated Title';
        const content = 'Updated Content';
        const image = 'updated_image.jpg';

        mockedAxios.post.mockResolvedValue({ data: {success: true} });
        const response = await postService.updatePost(post_id, title, content, image);

        expect(mockedAxios.put).toHaveBeenCalledWith(`/posts/${post_id}`, { title, content, image });
        expect(response).toEqual({ success: true });
    });

    test('deletePost should delete a post', async () => {
        const post_id = 1;
        mockedAxios.delete.mockResolvedValue({ data: { success: true } });

        const response = await postService.deletePost(post_id);

        expect(mockedAxios.delete).toHaveBeenCalledWith(`/posts/${post_id}`);
        expect(response).toEqual({ success: true });
    });
    test('addPostComment should add a comment to a post', async () => {
        const post_id = 1;
        const user_id = 1;
        const content = 'This is a comment';
        const created_at = new Date('2023-01-01T12:00:00Z');
        const mockResponse = { postcomment_id: 1 };

        mockedAxios.post.mockResolvedValue({ data: mockResponse });

        const postcomment_id = await postService.addPostComment(post_id, user_id, content, created_at);

        expect(mockedAxios.post).toHaveBeenCalledWith(`/posts/${post_id}/comments`, { user_id, content, created_at });
        expect(postcomment_id).toBe(mockResponse.postcomment_id);
    });

    test('getPostComments should fetch comments for a post', async () => {
        const post_id = 1;
        const mockComments: PostComment[] = [
            {
                postcomment_id: 1,
                post_id: 1,
                user_id: 1,
                content: 'Comment 1',
                created_at: new Date('2023-01-01T12:00:00Z'),
            },
            {
                postcomment_id: 2,
                post_id: 1,
                user_id: 2,
                content: 'Comment 2',
                created_at: new Date('2023-01-02T12:00:00Z'),
            },
        ];

        mockedAxios.get.mockResolvedValue({ data: mockComments });

        const comments = await postService.getPostComments(post_id);

        expect(mockedAxios.get).toHaveBeenCalledWith(`/posts/${post_id}/comments`);
        expect(comments).toEqual(mockComments);
    });

    test('updatePost should throw an error if API call fails', async () => {
        const post_id = 1;
        const title = 'Updated Title';
        const content = 'Updated Content';
        const image = 'updated_image.jpg';

        mockedAxios.put.mockRejectedValue(new Error('Failed to update post'));

        await expect(postService.updatePost(post_id, title, content, image)).rejects.toThrow('Failed to update post');
        expect(mockedAxios.put).toHaveBeenCalledWith(`/posts/${post_id}`, { title, content, image });
    });

    test('deletePost should delete a post', async () => {
        const post_id = 1;

        mockedAxios.delete.mockResolvedValue({ data: { success: true } });

        const response = await postService.deletePost(post_id);

        expect(mockedAxios.delete).toHaveBeenCalledWith(`/posts/${post_id}`);
        expect(response).toEqual({ success: true });
    });

    test('deletePost should throw an error if API call fails', async () => {
        const post_id = 1;

        mockedAxios.delete.mockRejectedValue(new Error('Failed to delete post'));

        await expect(postService.deletePost(post_id)).rejects.toThrow('Failed to delete post');
        expect(mockedAxios.delete).toHaveBeenCalledWith(`/posts/${post_id}`);
    });
});

