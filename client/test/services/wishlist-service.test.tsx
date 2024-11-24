import axios from 'axios';
import wishlistService, { Wishlist } from '../../src/services/wishlist-service';
//link to nettside explaining use : https://medium.com/@swatikpl44/mastering-mocking-techniques-in-jest-for-react-testing-cbf4d7fde7ee
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WishlistService Tests', () => {
        afterEach(() => {
        jest.clearAllMocks();
    });

  test('getUserWishlist should fetch and return all wishlist items for a user', async () => {
    const mockWishlist: Wishlist[] = [
      { user_id: 1, angel_id: 101 },
      { user_id: 1, angel_id: 102 },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockWishlist });

    const wishlist = await wishlistService.getUserWishlist(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('/1/wishlist');
    expect(wishlist).toEqual(mockWishlist);
  });

  test('getUserWishlist should handle errors and return an empty array', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Failed to fetch wishlist'));

    const wishlist = await wishlistService.getUserWishlist(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('/1/wishlist');
    expect(wishlist).toEqual([]); // Should return an empty array on failure
  });

  test('addWishlist should successfully add an item to the wishlist', async () => {
    mockedAxios.post.mockResolvedValue({});

    await wishlistService.addWishlist(1, 101);

    expect(mockedAxios.post).toHaveBeenCalledWith('/1/wishlist', { angelId: 101 });
  });

  test('addWishlist should handle errors gracefully', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Failed to add to wishlist'));

    await wishlistService.addWishlist(1, 101);

    expect(mockedAxios.post).toHaveBeenCalledWith('/1/wishlist', { angelId: 101 });
  });

  test('removeWishlist should successfully remove an item from the wishlist', async () => {
    mockedAxios.delete.mockResolvedValue({});

    await wishlistService.removeWishlist(1, 101);

    expect(mockedAxios.delete).toHaveBeenCalledWith('/1/wishlist', {
      data: { seriesId: 101 },
    });
  });

  test('removeWishlist should handle errors gracefully', async () => {
    mockedAxios.delete.mockRejectedValue(new Error('Failed to remove from wishlist'));

    await wishlistService.removeWishlist(1, 101);

    expect(mockedAxios.delete).toHaveBeenCalledWith('/1/wishlist', {
      data: { seriesId: 101 },
    });
  });
});
