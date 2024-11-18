import axios from 'axios';
import angelService, { Angel, AngelHistory } from '../../src/services/angel-service';
//link til nettisde med forklaringer av bruk: https://medium.com/@swatikpl44/mastering-mocking-techniques-in-jest-for-react-testing-cbf4d7fde7ee
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

    test('createAngel should throw an error on failure', async () => {
        const newAngel = { name: 'Ant', description: 'Ant Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2022/04/ant.png', release_year: 2022, views: 3, user_id: 2/*created/updated at?*/, series_id: 10 }
                
        mockedAxios.post.mockRejectedValue(new Error('Failed to create angel'));
        
        await expect(angelService.createAngel(newAngel)).rejects.toThrow('Failed to create angel');
        expect(mockedAxios.post).toHaveBeenCalledWith('/angels', newAngel);
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

    // test('getCreatedAt should fetch and return the created_at timestamp', async () => {
    //     const angel_id = 1;
    //     const mockResponse = { created_at: '2023-11-18T00:00:00Z' };
        
    //     mockedAxios.get.mockResolvedValue({ data: mockResponse });

    //     const result = await angelService.getCreatedAt(angel_id);

    //     expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/created_at`);
    //     expect(result).toBe(mockResponse.created_at);
    // });

    // test('getCreatedAt should throw an error on failure', async () => {
    //     const angel_id = 1;

    //     mockedAxios.get.mockRejectedValue(new Error('Failed to fetch created_at'));

    //     await expect(angelService.getCreatedAt(angel_id)).rejects.toThrow('Failed to fetch created_at');
    //     expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/created_at`);
    // });

    // test('getUpdatedAt should fetch and return the updated_at timestamp', async () => {
    //     const angel_id = 1;
    //     const mockResponse = { updated_at: '2024-01-01T00:00:00Z' };
        
    //     mockedAxios.get.mockResolvedValue({ data: mockResponse });

    //     const result = await angelService.getUpdatedAt(angel_id);

    //     expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/updated_at`);
    //     expect(result).toBe(mockResponse.updated_at);
    // });

    // test('getUpdatedAt should throw an error on failure', async () => {
    //     const angel_id = 1;

    //     mockedAxios.get.mockRejectedValue(new Error('Failed to fetch updated_at'));

    //     await expect(angelService.getUpdatedAt(angel_id)).rejects.toThrow('Failed to fetch updated_at');
    //     expect(mockedAxios.get).toHaveBeenCalledWith(`/angels/${angel_id}/updated_at`);
    // });

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
});




// import * as React from 'react';
// import angelService from '../../src/services/angel-service';
// import type { Angel, AngelHistory } from '../../src/services/angel-service';
// import { shallow } from 'enzyme';

// jest.mock('../src/services/angel-service', () => {
//     class AngelService {
//         getAll() {
//             return Promise.resolve([
//                 { angel_id: 1, name: 'Apple', description: 'Apple Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Apple.png', release_year: 2019, views: 6, user_id: 2/*created/updated at?*/, series_id: 4 },
//                 { angel_id: 2, name: 'Cow', description: 'Cow Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cow_01-1.jpg', release_year: 2018, views: 11, user_id: 1/*created/updated at?*/, series_id: 1 },
//                 { angel_id: 3, name: 'Candy', description: 'Candy Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_candy_01.jpg', release_year: 2018, views: 7, user_id: 3/*created/updated at?*/, series_id: 6 },
//             ])
//         }
    
//         get(angel_id: number) {
//             return Promise.resolve({
//                 angel_id: 1, name: 'Apple', description: 'Apple Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Apple.png', release_year: 2019, views: 6, user_id: 2/*created/updated at?*/, series_id: 4
//             })
//         } 
    
//         createAngel() {
//             return Promise.resolve(4)
//         }
        
    
//         updateAngel(angel: Partial<{ angel_id: number, name: string, description: string }>) {
//             return Promise.resolve(angel.angel_id);
//         }
    
//         deleteAngel(angel_id: number) {
//             return Promise.resolve(angel_id);
//         }

//         getBySeries(series_id: number) {
//             return Promise.resolve([
//                 { angel_id: 3, name: 'Candy', description: 'Candy Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_candy_01.jpg', release_year: 2018, views: 7, user_id: 3/*created/updated at?*/, series_id },
//             ])
//         }
    
//         search(query: string) {
//             return Promise.resolve([
//                 { angel_id: 5, name: query, description: `${query} Sonny Angel`, image: 'https://example.com/query.png', release_year: 2020, views: 5, user_id: 4, series_id: 5 },
//             ])
//         }

//         incrementViews(angel_id: number) {
//             return Promise.resolve({
//                 angel_id: angel_id,
//                 views: 12,
//             })
//         }
    
//         getUsername(angel_id: number) {
//             return Promise.resolve('Test_user');
//         }
    
//         // getCreatedAt(angel_id: number) {
            
//         // }
      
//         // getUpdatedAt(angel_id: number) {
            
//         // }

//         getPopular() {
//             return Promise.resolve([
//                 { angel_id: 2, name: 'Cow', description: 'Cow Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cow_01-1.jpg', release_year: 2018, views: 11, user_id: 1/*created/updated at?*/, series_id: 1 },
//             ])
//         }
//     }

//     return new AngelService();
// })

// describe('AngelService tests', () => {
//     test('getAll fetches all angels', (done) => {
//         angelService
//             .getAll()
//             .then((angels) => {
//                 expect(angels).toHaveLength(2);
//                 expect(angels[0].name).toBe('Apple');
//                 expect(angels[2].angel_id).toBe(3);
//                 done();
//             });
//     });

//     test('get fetches an angel by ID', (done) => {
//         angelService
//             .get(1)
//             .then((angel) => {
//                 expect(angel.angel_id).toBe(1);
//                 expect(angel.name).toBe('Apple');
//                 expect(angel.series_id).toBe(4);
//                 done();
//             });
//     });

//     test('get fails', (done) => {
//         angelService
//             .getAll()
//             .then((angels) => {
//                 expect(angels).toHaveLength(2);
//                 expect(angels[0].name).toBe('Apple');
//                 expect(angels[2].angel_id).toBe(3);
//                 done();
//             });
//     });

//     test('createAngel adds a new angel', (done) => {
//         const newAngel: Angel = {
//             name: 'Test',
//             description: 'Test Sonny Angel',
//             image: 'https://test.com/test.jpg',
//             release_year: 2024,
//             views: 0,
//             user_id: 1,
//             series_id: 2,
//         }
//         const createdAngel = {
//             ...newAngel,
//             angel_id: 4,
//         }
//         angelService
//             .createAngel(createdAngel)
//             .then((angel_id) => {
//                 expect(angel_id).toBe(4);
//                 done();
//         });
//     });

//     test('updateAngel updates an angel', (done) => {
//         const updatedAngel: Partial<Angel> = {
//             angel_id: 1,
//             name: 'Orange',
//             description: 'Orange Sonny Angel',
//             release_year: 2020,
//             user_id: 2,
//         }
//         angelService
//             .updateAngel(updatedAngel)
//             .then((angel) => {
//                 expect(angel.angel_id).toBe(1)
//                 expect(angel.name).toBe('Orange');
//                 done();
//             });
//     });

//     test('deleteAngel deletes an angel', (done) => {
//         angelService
//             .deleteAngel(2)
//             .then(() => {
//                 expect(true).toBe(true);
//                 done();
//             });
//     });
    
//     test('incrementViews increments angel views', (done) => {
//       angelService.incrementViews(2).then((angel) => {
//         expect(angel.angel_id).toBe(2);
//         expect(angel.views).toBe(12);
//         done();
//       });
//     });
// });