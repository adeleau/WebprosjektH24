import axios from 'axios';
import angelCommentService, { AngelComment } from '../../src/services/angelcomment-service';
//link to nettside explaining use : https://medium.com/@swatikpl44/mastering-mocking-techniques-in-jest-for-react-testing-cbf4d7fde7ee
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AngelCommentService Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAngelComments should fetch and return all comments for an angel', async () => {
    const mockComments: AngelComment[] = [
      {
        angelcomment_id: 1,
        angel_id: 1,
        user_id: 2,
        username: 'Adele',
        content: 'hei',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        angelcomment_id: 2,
        angel_id: 1,
        user_id: 3,
        username: 'Julia',
        content: 'yo',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockComments });

    const comments = await angelCommentService.getAngelComments(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('/angels/1/comments');
    expect(comments).toEqual(mockComments);
  });

  test('getAngelComments should throw an error on failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Failed to fetch comments'));

    await expect(angelCommentService.getAngelComments(1)).rejects.toThrow('Failed to fetch comments');
    expect(mockedAxios.get).toHaveBeenCalledWith('/angels/1/comments');
  });

  test('addAngelComment should successfully add a new comment', async () => {
    const mockResponse = { angelcomment_id: 3 };
    const angel_id = 1;
    const user_id = 2;
    const content = 'New comment';

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const angelcomment_id = await angelCommentService.addAngelComment(angel_id, user_id, content);

    expect(mockedAxios.post).toHaveBeenCalledWith('/angels/1/comments', { angel_id, user_id, content });
    expect(angelcomment_id).toEqual(mockResponse.angelcomment_id);
  });

  test('addAngelComment should throw an error on failure', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Failed to add comment'));

    await expect(angelCommentService.addAngelComment(1, 2, 'New comment')).rejects.toThrow('Failed to add comment');
    expect(mockedAxios.post).toHaveBeenCalledWith('/angels/1/comments', { angel_id: 1, user_id: 2, content: 'New comment' });
  });

  test('editAngelComment should successfully edit a comment', async () => {
    const mockResponse = { message: 'Comment updated successfully' };
    const angelcomment_id = 1;
    const content = 'Updated content';
    const user_id = 123; // Example user ID
    const role = 'admin';

    mockedAxios.put.mockResolvedValue({ data: mockResponse });

    const response = await angelCommentService.editAngelComment(angelcomment_id, content, user_id, role);

    expect(mockedAxios.put).toHaveBeenCalledWith(`/angels/comments/1`, { content, user_id, role });
    expect(response).toEqual(mockResponse);
  });

  test('editAngelComment should throw an error on failure', async () => {
    mockedAxios.put.mockRejectedValue(new Error('Failed to update comment'));

    await expect(angelCommentService.editAngelComment(1, 'Updated content', 123, 'admin')).rejects.toThrow('Failed to update comment');
    expect(mockedAxios.put).toHaveBeenCalledWith(`/angels/comments/1`, { content: 'Updated content', user_id:123, role: 'admin' });
  });

  test('deleteAngelComment should delete a comment successfully', async () => {
    const angelcomment_id = 1;
    const user_id = 123; // Mock user_id
    const role = 'admin'; // Mock role
    mockedAxios.delete.mockResolvedValue({});
  
    await angelCommentService.deleteAngelComment(angelcomment_id, user_id, role);
  
    expect(mockedAxios.delete).toHaveBeenCalledWith('/angels/comments/1', {
      data: { user_id, role }, // Include the payload
    });
  });

  test('deleteAngelComment should throw an error on failure', async () => {
    const angelcomment_id = 1;
    const user_id = 123; 
    const role = 'admin'
    mockedAxios.delete.mockRejectedValue(new Error('Failed to delete comment'));

    await expect(angelCommentService.deleteAngelComment(angelcomment_id, user_id, role))
        .rejects.toThrow('Failed to delete comment');

    expect(mockedAxios.delete).toHaveBeenCalledWith('/angels/comments/1', {
        data: { user_id, role }, // Include the payload
    });
  });

  test('getAngelComments should match the snapshot', async () => {
    const mockComments: AngelComment[] = [
      {
        angelcomment_id: 1,
        angel_id: 1,
        user_id: 2,
        username: 'Adele',
        content: 'hei',
        created_at: new Date('2024-01-01T10:00:00Z'),
        updated_at: new Date('2024-01-01T12:00:00Z'),
      },
      {
        angelcomment_id: 2,
        angel_id: 1,
        user_id: 3,
        username: 'Julia',
        content: 'yo',
        created_at: new Date('2024-02-01T10:00:00Z'),
        updated_at: new Date('2024-02-01T12:00:00Z'),
      },
    ];
  
    mockedAxios.get.mockResolvedValue({ data: mockComments });
  
    const comments = await angelCommentService.getAngelComments(1);
  
    expect(mockedAxios.get).toHaveBeenCalledWith('/angels/1/comments');
    expect(comments).toMatchSnapshot();
  });
  
})
