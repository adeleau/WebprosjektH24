import * as React from 'react';
import { SeriesList } from '../src/components/series-components';
import { Link } from 'react-router-dom';
import seriesService from '../src/services/series-service';
import type { Series } from '../src/services/series-service';
import { shallow } from 'enzyme';
import Cookies from 'js-cookie';

//lager mock tester
jest.mock('../src/services/series-service', () => ({
    getAll: jest.fn(),
    getName: jest.fn(),
    createSeries: jest.fn(),
  }));

  jest.mock('js-cookie', () =>({
    get: jest.fn(),
  }));
  
  describe('Series tests', () => {
    const mockSeries = [
      { series_id: 1, name: 'engel-series' },
      { series_id: 2, name: 'serie' },
    ];
  
    const mockAngels = [
      { angel_id: 1, name: 'Angel One', image: 'image1.jpg' },
      { angel_id: 2, name: 'Angel Two', image: 'image2.jpg' },
    ];
    let wrapper: any; 
  
    beforeEach(() => {
      jest.clearAllMocks();
      wrapper = shallow(<SeriesList />);
      
    });

    const mockedCookiesGet = Cookies.get as jest.MockedFunction<typeof Cookies.get>;
  
    test('SeriesService.getAll returns list of series', async () => {
      (seriesService.getAll as jest.Mock).mockResolvedValue(mockSeries);
      
      const series = await seriesService.getAll();
      expect(series).toEqual(mockSeries);
      expect(seriesService.getAll).toHaveBeenCalledTimes(1);
    });
  
    test('SeriesService.getName returns series name by ID', async () => {
      (seriesService.getName as jest.Mock).mockResolvedValue('Adventure Series');
  
      const seriesName = await seriesService.getName(1);
      expect(seriesName).toBe('Adventure Series');
      expect(seriesService.getName).toHaveBeenCalledWith(1);
    });
  
    test('SeriesList component renders correctly', async () => {
      (seriesService.getName as jest.Mock).mockResolvedValue('engel Series');
      (seriesService.getAll as jest.Mock).mockResolvedValue(mockAngels);

    mockedCookiesGet.mockReturnValue({ role: 'admin'});
  
      let wrapper = shallow(<SeriesList />);
  
      await new Promise((resolve) => setTimeout(resolve, 0));
  
      expect(wrapper.contains(<h1>Adventure Series</h1>)).toEqual(true);
  
    
      expect(wrapper.find('.angel-card')).toHaveLength(mockAngels.length);
  
      
      expect(wrapper.contains(<h3>Angel One</h3>)).toEqual(true);
      expect(wrapper.contains(<h3>Angel Two</h3>)).toEqual(true);
      expect(wrapper.find('.btn-create-angel')).toHaveLength(1);
    });

    test('Display error message on service failure', async () => {
         (seriesService.getName as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

   
    await new Promise((resolve) => setTimeout(resolve, 0));

    
    expect(wrapper.contains
      (<div className="error-message">Error getting series name: Failed to fetch</div>))
      .toBe(true);
    (seriesService.getName as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(wrapper.contains(<div className="error-message">Error getting series name: Failed to fetch</div>)).toBe(true);
  });
    
  test('Shows loader text while fetching data', () => {
    const wrapper = shallow(<SeriesList />);
    expect(wrapper.contains(<p>Loading series information...</p>)).toBe(true);
  });

    test('Create Series functionality works', async () => {
      const newSeries = { name: 'New Series' };
      (seriesService.createSeries as jest.Mock).mockResolvedValue({ series_id: 3, ...newSeries });
  
      const createdSeries = await seriesService.createSeries(newSeries);
  
      expect(createdSeries.name).toBe('New Series');
      expect(seriesService.createSeries).toHaveBeenCalledWith(newSeries);
    });

    test('Does not show admin button for non-admin users', async () => {
        (seriesService.getName as jest.Mock).mockResolvedValue('Adventure Series');
        (seriesService.getAll as jest.Mock).mockResolvedValue(mockAngels);
    
        mockedCookiesGet.mockReturnValue({ role: 'user' });
    
        const wrapper = shallow(<SeriesList />);
        await new Promise((resolve) => setTimeout(resolve, 0));
    
        expect(wrapper.find('.btn-create-angel')).toHaveLength(0);
      });
  });