import axios from 'axios';
import angelCommentService, { AngelComment } from '../../src/services/angelcomment-service';

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

    mockedAxios.put.mockResolvedValue({ data: mockResponse });

    const response = await angelCommentService.editAngelComment(angelcomment_id, content);

    expect(mockedAxios.put).toHaveBeenCalledWith(`/angels/comments/1`, { content });
    expect(response).toEqual(mockResponse);
  });

  test('editAngelComment should throw an error on failure', async () => {
    mockedAxios.put.mockRejectedValue(new Error('Failed to update comment'));

    await expect(angelCommentService.editAngelComment(1, 'Updated content')).rejects.toThrow('Failed to update comment');
    expect(mockedAxios.put).toHaveBeenCalledWith(`/angels/comments/1`, { content: 'Updated content' });
  });

  test('deleteAngelComment should delete a comment successfully', async () => {
    mockedAxios.delete.mockResolvedValue({});

    await angelCommentService.deleteAngelComment(1);

    expect(mockedAxios.delete).toHaveBeenCalledWith('/angels/comments/1');
  });

  test('deleteAngelComment should throw an error on failure', async () => {
    mockedAxios.delete.mockRejectedValue(new Error('Failed to delete comment'));

    await expect(angelCommentService.deleteAngelComment(1)).rejects.toThrow('Failed to delete comment');
    expect(mockedAxios.delete).toHaveBeenCalledWith('/angels/comments/1');
  });
});
