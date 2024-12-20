import axios from 'axios';
import postService, { Post } from '../../src/services/post-service';
//link to nettside explaining use : https://medium.com/@swatikpl44/mastering-mocking-techniques-in-jest-for-react-testing-cbf4d7fde7ee
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PostService test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAll should match the snapshot', async () => {
        const mockPosts: Post[] = [
            {
                post_id: 1,
                user_id: 1,
                title: 'Angel post',
                content: 'My post',
                image: 'Angelimage.jpg',
                created_at: new Date('2023-01-01T12:00:00Z'),
                updated_at: new Date('2023-01-01T12:00:00Z'),
            },
            {
                post_id: 2,
                user_id: 2,
                title: 'Test post',
                content: 'Test',
                image: 'Testimage.jpg',
                created_at: new Date('2023-01-01T12:00:00Z'),
                updated_at: new Date('2023-01-01T12:00:00Z'),
            },
        ];

        mockedAxios.get.mockResolvedValue({ data: mockPosts });

        const posts = await postService.getAll();

        expect(mockedAxios.get).toHaveBeenCalledWith('/posts');
        expect(posts).toMatchSnapshot();
    });

    test('get should match the snapshot', async () => {
        const mockPost: Post = {
            post_id: 1,
            user_id: 1,
            title: 'Angel post',
            content: 'My post',
            image: 'angelimage.jpg',
            created_at: new Date('2023-01-01T12:00:00Z'),
            updated_at: new Date('2023-01-01T12:00:00Z'),
        };

        mockedAxios.get.mockResolvedValue({ data: mockPost });

        const post = await postService.get(1);

        expect(mockedAxios.get).toHaveBeenCalledWith('/posts/1');
        expect(post).toMatchSnapshot();
    });

    test('get should throw an error if API call fails', async () => {
        const post_id = 1;

        mockedAxios.get.mockRejectedValue(new Error('Failed to fetch post'));

        await expect(postService.get(post_id)).rejects.toThrow('Failed to fetch post');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/posts/${post_id}`);
    });

    test('getAll should fetch and return all Posts', async () => {
        const mockPosts: Post[] = [
            {
                post_id: 1,
                user_id: 1,
                title: 'Angel post',
                content: 'My post',
                image: 'Angelimage.jpg',
                created_at: new Date('2023-01-01T12:00:00Z'),
                updated_at: new Date('2023-01-01T12:00:00Z'),
            },
            {
                post_id: 2,
                user_id: 2,
                title: 'Test post',
                content: 'Test',
                image: 'Testimage.jpg',
                created_at: new Date('2023-01-01T12:00:00Z'),
                updated_at: new Date('2023-01-01T12:00:00Z'),
            },
        ];
        mockedAxios.get.mockResolvedValue({ data: mockPosts });

        const posts = await postService.getAll();

        expect(mockedAxios.get).toHaveBeenCalledWith('/posts');
        expect(posts).toEqual(mockPosts);
    });

    test('createPost should create a new post', async () => {
        const user_id = 1;
        const title = 'Angel post';
        const content = 'My post';
        const image = 'Angelimage.jpg';

        const mockResponse = { post_id: 3 };

        mockedAxios.post.mockResolvedValue({ data: mockResponse });

        const post_id = await postService.createPost(user_id, title, content, image);
       // const post_id = await postService.createPost(user_id, title, content, image);

        expect(mockedAxios.post).toHaveBeenCalledWith('/posts', { user_id, title, content, image });
        //expect(mockedAxios.post).toHaveBeenCalledWith('/posts', { user_id, title, content, image });
        expect(post_id).toBe(mockResponse.post_id);
    });

    test('updatePost should update a post', async () => {
        const post_id = 1;
        const title = 'Updated Title';
        const content = 'Updated Content';
        const image = 'updated_image.jpg';

        //mockedAxios.put.mockResolvedValue({ data: { success: true } });
        mockedAxios.put.mockResolvedValue({ data: { success: true } });
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

    test('updatePost should throw an error if API call fails', async () => {
        const post_id = 1;
        const title = 'Updated Title';
        const content = 'Updated Content';
        const image = 'updated_image.jpg';

        mockedAxios.put.mockRejectedValue(new Error('Failed to update post'));

        await expect(postService.updatePost(post_id, title, content, image)).rejects.toThrow('Failed to update post');
        expect(mockedAxios.put).toHaveBeenCalledWith(`/posts/${post_id}`, { title, content, image });
    });

    test('deletePost should throw an error if API call fails', async () => {
        const post_id = 1;

        mockedAxios.delete.mockRejectedValue(new Error('Failed to delete post'));

        await expect(postService.deletePost(post_id)).rejects.toThrow('Failed to delete post');
        expect(mockedAxios.delete).toHaveBeenCalledWith(`/posts/${post_id}`);
    });
});
