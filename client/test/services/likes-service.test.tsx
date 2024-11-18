import axios from 'axios';
import likesService, { Likes } from '../../src/services/likes-service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LikesService Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getUserLikes should fetch and return all likes for a user', async () => {
    const mockLikes: Likes[] = [
      { user_id: 1, angel_id: 101 },
      { user_id: 1, angel_id: 102 },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockLikes });

    const likes = await likesService.getUserLikes(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('/1/likes');
    expect(likes).toEqual(mockLikes);
  });

  test('getUserLikes should handle errors and return an empty array', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Failed to fetch likes'));

    const likes = await likesService.getUserLikes(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('/1/likes');
    expect(likes).toEqual([]); 
  });

  test('addLike should successfully add a like', async () => {
    mockedAxios.post.mockResolvedValue({});

    await likesService.addLike(1, 101);

    expect(mockedAxios.post).toHaveBeenCalledWith('/1/likes', { angelId: 101 });
  });

  test('addLike should handle errors gracefully', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Failed to add like'));

    await likesService.addLike(1, 101);

    expect(mockedAxios.post).toHaveBeenCalledWith('/1/likes', { angelId: 101 });
  });

  test('removeLike should successfully remove a like', async () => {
    mockedAxios.delete.mockResolvedValue({});

    await likesService.removeLike(1, 101);

    expect(mockedAxios.delete).toHaveBeenCalledWith('/1/likes', {
      data: { seriesId: 101 },
    });
  });

  test('removeLike should handle errors gracefully', async () => {
    mockedAxios.delete.mockRejectedValue(new Error('Failed to remove like'));

    await likesService.removeLike(1, 101);

    expect(mockedAxios.delete).toHaveBeenCalledWith('/1/likes', {
      data: { seriesId: 101 },
    });
  });
});
