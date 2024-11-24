import axios from 'axios';
import angelService, { Angel, Angel_History } from '../../src/services/angel-service';
//Link to nettside explaining use : https://medium.com/@swatikpl44/mastering-mocking-techniques-in-jest-for-react-testing-cbf4d7fde7ee
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

//We are using mocked since this is what managed to work for us and it gave us the best result
//We are using beforeEach and spyOn since it is most compatible with Reacts asynchronius
describe('AngelService test', () => {
    // To suppress error logs (ChatGPT)
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    

    afterEach(() => {
        jest.restoreAllMocks();
    });    

    test('getAll should fetch and return all angels', async () => {
        const mockAngels: Angel[] = [
            { angel_id: 1, name: 'Apple', description: 'Apple Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Apple.png', release_year: 2019, views: 6, user_id: 2/*created/updated at?*/, series_id: 4 },
            { angel_id: 2, name: 'Cow', description: 'Cow Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cow_01-1.jpg', release_year: 2018, views: 11, user_id: 1/*created/updated at?*/, series_id: 7 },
            { angel_id: 3, name: 'Candy', description: 'Candy Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_candy_01.jpg', release_year: 2018, views: 7, user_id: 3/*created/updated at?*/, series_id: 7 },
        ];

        mockedAxios.get.mockResolvedValue({data: mockAngels});

        const angels = await angelService.getAll();

        expect(mockedAxios.get).toHaveBeenCalledWith('/angels');
        expect(angels).toEqual(mockAngels);
    });

    test('getAll should throw an error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Failed to fetch all angels'));

        await expect(angelService.getAll()).rejects.toThrow('Failed to fetch all angels');
        expect(mockedAxios.get).toHaveBeenCalledWith('/angels');
    });

    test('getAll should handle errors gracefully', async () => {
        const errorMessage = 'Failed to fetch all angels';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));
    
        await expect(angelService.getAll()).rejects.toThrow(errorMessage);
    
        expect(mockedAxios.get).toHaveBeenCalledWith('/angels');
    });
    

    test('getAll should handle errors gracefully', async () => {
        const errorMessage = 'Failed to fetch all angels';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));
    
        await expect(angelService.getAll()).rejects.toThrow(errorMessage);
    
        expect(mockedAxios.get).toHaveBeenCalledWith('/angels');
    });
    

    test('get should return the correct angel', async () => {
        const mockAngel = { angel_id: 1, name: 'Apple', description: 'Apple Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Apple.png', release_year: 2019, views: 6, user_id: 2/*created/updated at?*/, series_id: 4 };
        mockedAxios.get.mockResolvedValue({ data: mockAngel });

        const gotAngel = await angelService.get(1);

        expect(mockedAxios.get).toHaveBeenCalledWith('/angels/1');
        expect(gotAngel).toEqual(mockAngel);
    });

    test('get should throw an error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Failed to fetch angel'));

        await expect(angelService.get(1)).rejects.toThrow('Failed to fetch angel');
        expect(mockedAxios.get).toHaveBeenCalledWith('/angels/1');
    });

    test('createAngel should successfully create a new angel', async () => {
        const newAngel = { name: 'Ant', description: 'Ant Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2022/04/ant.png', release_year: 2022, views: 3, user_id: 2, series_id: 10 }

        const mockResponse = { angel_id: 4, ...newAngel };

        mockedAxios.post.mockResolvedValue({ data: mockResponse });
    
        const createdAngel = await angelService.createAngel(newAngel);
    
        expect(mockedAxios.post).toHaveBeenCalledWith('/angels', newAngel);
        expect(createdAngel).toEqual(mockResponse);
    });
    test('getCreatedAt should fetch the created timestamp of an angel', async () => {
        const angel_id = 1;
        const mockResponse = { created_at: '2024-01-01T00:00:00Z' };
    
        mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    
        const result = await angelService.getCreatedAt(angel_id);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/created_at`);
        expect(result).toEqual(mockResponse.created_at);
    });
    
    test('getCreatedAt should handle errors gracefully', async () => {
        const angel_id = 1;
        mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch created timestamp'));
    
        await expect(angelService.getCreatedAt(angel_id)).rejects.toThrow('Failed to fetch created timestamp');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/created_at`);
    });
    
    test('getUpdatedAt should fetch the updated timestamp of an angel', async () => {
        const angel_id = 1;
        const mockResponse = { updated_at: '2024-01-01T12:00:00Z' };
    
        mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    
        const result = await angelService.getUpdatedAt(angel_id);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/updated_at`);
        expect(result).toEqual(mockResponse.updated_at);
    });
    
    test('getUpdatedAt should handle errors gracefully', async () => {
        const angel_id = 1;
        mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch updated timestamp'));
    
        await expect(angelService.getUpdatedAt(angel_id)).rejects.toThrow('Failed to fetch updated timestamp');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/updated_at`);
    });
    
    test('getCreatedAt should fetch the created timestamp of an angel', async () => {
        const angel_id = 1;
        const mockResponse = { created_at: '2024-01-01T00:00:00Z' };
    
        mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    
        const result = await angelService.getCreatedAt(angel_id);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/created_at`);
        expect(result).toEqual(mockResponse.created_at);
    });
    
    test('getCreatedAt should handle errors gracefully', async () => {
        const angel_id = 1;
        mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch created timestamp'));
    
        await expect(angelService.getCreatedAt(angel_id)).rejects.toThrow('Failed to fetch created timestamp');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/created_at`);
    });
    
    test('getUpdatedAt should fetch the updated timestamp of an angel', async () => {
        const angel_id = 1;
        const mockResponse = { updated_at: '2024-01-01T12:00:00Z' };
    
        mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    
        const result = await angelService.getUpdatedAt(angel_id);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/updated_at`);
        expect(result).toEqual(mockResponse.updated_at);
    });
    
    test('getUpdatedAt should handle errors gracefully', async () => {
        const angel_id = 1;
        mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch updated timestamp'));
    
        await expect(angelService.getUpdatedAt(angel_id)).rejects.toThrow('Failed to fetch updated timestamp');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/updated_at`);
    });
    
    test('createAngel should throw an error on failure', async () => {
        const newAngel = { name: 'Ant', description: 'Ant Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2022/04/ant.png', release_year: 2022, views: 3, user_id: 2/*created/updated at?*/, series_id: 10 }
                
        mockedAxios.post.mockRejectedValue(new Error('Failed to create angel'));
        
        await expect(angelService.createAngel(newAngel)).rejects.toThrow('Failed to create angel');
        expect(mockedAxios.post).toHaveBeenCalledWith('/angels', newAngel);
    });

    test('createAngel should match the snapshot of the created angel', async () => {
        const newAngel = { 
            name: 'Ant', 
            description: 'Ant Sonny Angel', 
            image: 'https://example.com/ant.png', 
            release_year: 2022, 
            views: 3, 
            user_id: 2, 
            series_id: 10 
        };
        const mockResponse = { 
            angel_id: 4, 
            ...newAngel 
        };
    
        mockedAxios.post.mockResolvedValue({ data: mockResponse });
    
        const createdAngel = await angelService.createAngel(newAngel);
        expect(mockedAxios.post).toHaveBeenCalledWith('/angels', expect.objectContaining(newAngel));
        expect(createdAngel).toMatchSnapshot();
    });
    

    test('createAngel should match the snapshot of the created angel', async () => {
        const newAngel = { 
            name: 'Ant', 
            description: 'Ant Sonny Angel', 
            image: 'https://example.com/ant.png', 
            release_year: 2022, 
            views: 3, 
            user_id: 2, 
            series_id: 10 
        };
        const mockResponse = { 
            angel_id: 4, 
            ...newAngel 
        };
    
        mockedAxios.post.mockResolvedValue({ data: mockResponse });
    
        const createdAngel = await angelService.createAngel(newAngel);
        expect(mockedAxios.post).toHaveBeenCalledWith('/angels', expect.objectContaining(newAngel));
        expect(createdAngel).toMatchSnapshot();
    });
    
    test('updateAngel should successfully update an existing angel', async () => {
        const updateAngel = { angel_id: 3, name: 'Candy updated', description: 'Candy Sonny Angel updated', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_candy_01.jpg', release_year: 2018, views: 7, user_id: 3, series_id: 4 }

        mockedAxios.put.mockResolvedValue({ data: updateAngel });
    
        const updatedAngel = await angelService.updateAngel(updateAngel);
    
        expect(mockedAxios.put).toHaveBeenCalledWith(`/angels/${updateAngel.angel_id}`, updateAngel);
        expect(updatedAngel).toEqual(updateAngel);
    });

    test('updateAngel should throw an error on failure', async () => {
        const updateAngel = { angel_id: 3, name: 'Ant', description: 'Ant Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2022/04/ant.png', release_year: 2022, views: 3, user_id: 2/*created/updated at?*/, series_id: 10 }
       
        mockedAxios.put.mockRejectedValue(new Error('Failed to update angel'));
        
        await expect(angelService.updateAngel(updateAngel)).rejects.toThrow('Failed to update angel');
        expect(mockedAxios.put).toHaveBeenCalledWith(`/angels/${updateAngel.angel_id}`, updateAngel);
    });

    test('updateAngel should throw an error if angel_id is missing', async () => {
        const updateAngel = { name: 'Candy updated', description: 'Updated description' }; // No angel_id provided
    
        await expect(angelService.updateAngel(updateAngel as any)).rejects.toThrow('Missing angel_id');
    });
    

    test('updateAngel should throw an error if angel_id is missing', async () => {
        const updateAngel = { name: 'Candy updated', description: 'Updated description' }; // No angel_id provided
    
        await expect(angelService.updateAngel(updateAngel as any)).rejects.toThrow('Missing angel_id');
    });
    
    test('deleteAngel should delete an angel successfully', async () => {
        mockedAxios.delete.mockResolvedValue({});
    
        await angelService.deleteAngel(1);
    
        expect(mockedAxios.delete).toHaveBeenCalledWith('/angels/1');
    });
    
    test('deleteAngel should throw an error on failure', async () => {
        mockedAxios.delete.mockRejectedValue(new Error('Failed to delete angel'));
    
        await expect(angelService.deleteAngel(1)).rejects.toThrow('Failed to delete angel');
        
        expect(mockedAxios.delete).toHaveBeenCalledWith('/angels/1');
    });

    test('deleteAngel should handle errors gracefully', async () => {
        const angel_id = 1;
        const errorMessage = 'Failed to delete angel';
        mockedAxios.delete.mockRejectedValue(new Error(errorMessage));
    
        await expect(angelService.deleteAngel(angel_id)).rejects.toThrow(errorMessage);
    
        expect(mockedAxios.delete).toHaveBeenCalledWith(`/angels/${angel_id}`);
    });
    

    test('deleteAngel should handle errors gracefully', async () => {
        const angel_id = 1;
        const errorMessage = 'Failed to delete angel';
        mockedAxios.delete.mockRejectedValue(new Error(errorMessage));
    
        await expect(angelService.deleteAngel(angel_id)).rejects.toThrow(errorMessage);
    
        expect(mockedAxios.delete).toHaveBeenCalledWith(`/angels/${angel_id}`);
    });
    
    test('incrementViews should successfully increment the views of an angel', async () => {
        const angel_id = 2;
        const mockResponse = { angel_id: 2, views: 12 };
    
        mockedAxios.put.mockResolvedValue({ data: mockResponse });
    
        const result = await angelService.incrementViews(angel_id);
    
        expect(mockedAxios.put).toHaveBeenCalledWith(`/angels/${angel_id}/increment-views`);
        expect(result).toEqual(mockResponse);
    });
    
    test('incrementViews should throw an error on failure', async () => {
        const angel_id = 2;
    
        mockedAxios.put.mockRejectedValue(new Error('Failed to increment views'));
    
        await expect(angelService.incrementViews(angel_id)).rejects.toThrow('Failed to increment views');
        expect(mockedAxios.put).toHaveBeenCalledWith(`/angels/${angel_id}/increment-views`);
    });

    test('getBySeries should return a list of angels for a series', async () => {
        const series_id = 7;
        const mockResponse = [
            { angel_id: 2, name: 'Cow', description: 'Cow Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cow_01-1.jpg', release_year: 2018, views: 11, user_id: 1/*created/updated at?*/, series_id: 7 },
            { angel_id: 3, name: 'Candy', description: 'Candy Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_candy_01.jpg', release_year: 2018, views: 7, user_id: 3/*created/updated at?*/, series_id: 7 },
        ];
    
        mockedAxios.get.mockResolvedValue({ data: mockResponse });
    
        const result = await angelService.getBySeries(series_id);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/series/${series_id}`);
        expect(result).toEqual(mockResponse);
    });
    
    test('getBySeries should throw an error on failure', async () => {
        const series_id = 7;
    
        mockedAxios.get.mockRejectedValue(new Error('Failed to fetch angels'));
    
        await expect(angelService.getBySeries(series_id)).rejects.toThrow('Failed to fetch angels');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/series/${series_id}`);
    });

    test('getBySeries should handle empty results gracefully', async () => {
        const series_id = 99; // Assume no angels in this series
        mockedAxios.get.mockResolvedValue({ data: [] }); // Backend returns empty array
    
        const result = await angelService.getBySeries(series_id);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/series/${series_id}`);
        expect(result).toEqual([]); // Expecting an empty array
    });
    

    test('getBySeries should handle empty results gracefully', async () => {
        const series_id = 99; // Assume no angels in this series
        mockedAxios.get.mockResolvedValue({ data: [] }); // Backend returns empty array
    
        const result = await angelService.getBySeries(series_id);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/series/${series_id}`);
        expect(result).toEqual([]); // Expecting an empty array
    });
    
    test('search should return a list of angels matching the query', async () => {
        const query = 'C';
        const mockResponse = [
            { angel_id: 2, name: 'Cow', description: 'Cow Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cow_01-1.jpg', release_year: 2018, views: 11, user_id: 1/*created/updated at?*/, series_id: 7 },
            { angel_id: 3, name: 'Candy', description: 'Candy Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_candy_01.jpg', release_year: 2018, views: 7, user_id: 3/*created/updated at?*/, series_id: 7 },
        ];
    
        mockedAxios.get.mockResolvedValue({ data: mockResponse });
    
        const result = await angelService.search(query);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/search/${query}`);
        expect(result).toEqual(mockResponse);
    });
    
    test('search should throw an error on failure', async () => {
        const query = 'C';
    
        mockedAxios.get.mockRejectedValue(new Error('Search failed'));
    
        await expect(angelService.search(query)).rejects.toThrow('Search failed');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/search/${query}`);
    });
    
    test('search should handle invalid query gracefully', async () => {
        const query = '';
        mockedAxios.get.mockResolvedValueOnce({ data: [] });
    
        const result = await angelService.search(query);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/search/${query}`);
        expect(result).toEqual([]);
    });
    
    test('search should throw an error for a backend failure', async () => {
        const query = 'Test';
        mockedAxios.get.mockRejectedValueOnce(new Error('Search API failed'));
    
        await expect(angelService.search(query)).rejects.toThrow('Search API failed');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/search/${query}`);
    });
    

    test('search should handle errors gracefully', async () => {
        const query = 'Angel';
        const errorMessage = 'Search failed';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));
    
        await expect(angelService.search(query)).rejects.toThrow(errorMessage);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/search/${query}`);
    });
    
    
    test('search should handle invalid query gracefully', async () => {
        const query = '';
        mockedAxios.get.mockResolvedValueOnce({ data: [] });
    
        const result = await angelService.search(query);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/search/${query}`);
        expect(result).toEqual([]);
    });
    
    test('search should throw an error for a backend failure', async () => {
        const query = 'Test';
        mockedAxios.get.mockRejectedValueOnce(new Error('Search API failed'));
    
        await expect(angelService.search(query)).rejects.toThrow('Search API failed');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/search/${query}`);
    });
    

    test('search should handle errors gracefully', async () => {
        const query = 'Angel';
        const errorMessage = 'Search failed';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));
    
        await expect(angelService.search(query)).rejects.toThrow(errorMessage);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/search/${query}`);
    });
    
    
    test('getUsername should return the username for an angel', async () => {
        const angel_id = 1;
        const mockResponse = { username: 'testuser' };
    
        mockedAxios.get.mockResolvedValue({ data: mockResponse });
    
        const result = await angelService.getUsername(angel_id);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/username`);
        expect(result).toBe(mockResponse.username);
    });
    
    test('getUsername should throw an error on failure', async () => {
        const angel_id = 1;
    
        mockedAxios.get.mockRejectedValue(new Error('Failed to fetch username'));
    
        await expect(angelService.getUsername(angel_id)).rejects.toThrow('Failed to fetch username');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/username`);
    });

    test('getUsername should handle errors gracefully', async () => {
        const angel_id = 1;
        const errorMessage = 'Failed to fetch username';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));
    
        await expect(angelService.getUsername(angel_id)).rejects.toThrow(errorMessage);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/username`);
    });
    
    test('getUsername should handle errors gracefully', async () => {
        const angel_id = 1;
        const errorMessage = 'Failed to fetch username';
        mockedAxios.get.mockRejectedValue(new Error(errorMessage));
    
        await expect(angelService.getUsername(angel_id)).rejects.toThrow(errorMessage);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/username`);
    });
    

    test('getPopular should fetch and return a list of popular angels', async () => {
        const mockResponse = [
            { angel_id: 1, name: 'Banana', views: 100 },
            { angel_id: 2, name: 'Snail', views: 200 },
        ];
        
        mockedAxios.get.mockResolvedValue({ data: mockResponse });

        const result = await angelService.getPopular();

        expect(mockedAxios.get).toHaveBeenCalledWith('/popular');
        expect(result).toEqual(mockResponse);
    });

    test('getPopular should throw an error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Failed to fetch popular angels'));

        await expect(angelService.getPopular()).rejects.toThrow('Failed to fetch popular angels');
        expect(mockedAxios.get).toHaveBeenCalledWith('/popular');
    });

    test('getPopular should handle empty results gracefully', async () => {
        mockedAxios.get.mockResolvedValue({ data: [] }); 
    
        const result = await angelService.getPopular();
    
        expect(mockedAxios.get).toHaveBeenCalledWith('/popular');
        expect(result).toEqual([]); 
    });

    test('getAngelCount should return the correct count of angels for a series', async () => {
        const series_id = 7;
        const mockResponse = { count: 10 };
    
        mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });
    
        const result = await angelService.getAngelCount(series_id);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/series/${series_id}/count`);
        expect(result).toEqual(mockResponse.count);
    });
    
    test('getAngelCount should handle errors gracefully', async () => {
        const series_id = 7;
        mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch angel count'));
    
        await expect(angelService.getAngelCount(series_id)).rejects.toThrow('Failed to fetch angel count');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/series/${series_id}/count`);
    });
    
    test('getAngelHistory should return the history of an angel', async () => {
        const angel_id = 1;
        const mockHistory = [
            {
                angelhistory_id: 1,
                angel_id: 1,
                description: 'First update',
                user_id: '123',
                updated_at: '2024-01-01T12:00:00Z',
            },
            {
                angelhistory_id: 2,
                angel_id: 1,
                description: 'Second update',
                user_id: '456',
                updated_at: '2024-02-01T15:30:00Z',
            },
        ];
    
        mockedAxios.get.mockResolvedValueOnce({ data: mockHistory });
    
        const result = await angelService.getAngelHistory(angel_id);
    
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/history`);
        expect(result).toEqual(mockHistory);
    });
    
    test('getAngelHistory should handle errors gracefully', async () => {
        const angel_id = 1;
        mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch history'));
    
        await expect(angelService.getAngelHistory(angel_id)).rejects.toThrow('Failed to fetch history');
        expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/history`);
    });
    
});