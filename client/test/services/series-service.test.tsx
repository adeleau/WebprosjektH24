import axios from 'axios';
import seriesService, { Series } from '../../src/services/series-service';
//link til nettisde med forklaringer av bruk: https://medium.com/@swatikpl44/mastering-mocking-techniques-in-jest-for-react-testing-cbf4d7fde7ee
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SeriesService test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAll should fetch and return all series', async () => {
        const mockSeries: Series[] = [
            { series_id: 1, name: 'Engel-serie'},
            { series_id: 2, name: 'serie'},
        ];

        mockedAxios.get.mockResolvedValue({data: mockSeries});

        const series = await seriesService.getAll();

        expect(mockedAxios.get).toHaveBeenCalledWith('/series');
        expect(series).toEqual(mockSeries);
    });


    test('getName should return the correct series name by ID', async () => {
        const mockName = 'Engel-serie';
        mockedAxios.get.mockResolvedValue({ data: mockName });

        const name = await seriesService.getName(1);

        expect(mockedAxios.get).toHaveBeenCalledWith('/series/name/1');
        expect(name).toBe(mockName);
    });

    test('getName should throw an error on failure', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Failed to fetch'));

        await expect(seriesService.getName(1)).rejects.toThrow('Failed');
        expect(mockedAxios.get).toHaveBeenCalledWith('/series/name/1');
    });

    test('createSeries should successfully create a new series', async () => {
        const newSeries = { name: 'Ny-serie' };
        const mockResponse = { series_id: 3, name: 'Ny-serie' };
        mockedAxios.post.mockResolvedValue({ data: mockResponse });
    
        const series = await seriesService.createSeries(newSeries);
    
        expect(mockedAxios.post).toHaveBeenCalledWith('/series', newSeries);
        expect(series).toEqual(mockResponse);
      });

      test('createSeries should throw an error on failure', async () => {
        mockedAxios.post.mockRejectedValue(new Error('Failed to create series'));
    
        const newSeries = { name: 'Ny-serie' };
    
        await expect(seriesService.createSeries(newSeries)).rejects.toThrow('Failed to create series');
        expect(mockedAxios.post).toHaveBeenCalledWith('/series', newSeries);
      });
      test('deleteSeries should delete a series successfully', async () => {
        mockedAxios.delete.mockResolvedValue({});
    
        await seriesService.deleteSeries(1);
    
        expect(mockedAxios.delete).toHaveBeenCalledWith('/series/1');
      });
    
      test('deleteSeries should throw an error on failure', async () => {
        mockedAxios.delete.mockRejectedValue(new Error('Failed to delete series'));
    
        await expect(seriesService.deleteSeries(1)).rejects.toThrow('Failed to delete series');
        expect(mockedAxios.delete).toHaveBeenCalledWith('/series/1');
      });
});