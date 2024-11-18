import * as React from 'react';
import { SeriesList } from '../src/components/series-components';
import { Link } from 'react-router-dom';
import seriesService from '../src/services/series-service';
import type { Series } from '../src/services/series-service';
import { shallow } from 'enzyme';
import Cookies from 'js-cookie';

jest.mock('../src/services/series-service', () => {
  class SeriesService {
    getAll() {
      return Promise.resolve([
        {series_id: 1, name: 'Engel-series'},
        {series_id: 2, name: 'serie'},
      ]);
    }

    getName(series_id: number){
      return Promise.resolve(series_id === 1 ? 'Engel-series' : 'Unknown series');
    }

    createSeries(name: string){
      return Promise.resolve({ series_id: 3, name});
    }
  }
  return new SeriesService();
});

jest.mock('js-cookie', () =>({
  get: jest.fn(),
}));

describe('Series Components tests', () => {
  let wrapper: any;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = shallow(<SeriesList/>);
  });

  test('Series List renders correctly', async() => {
    const mockSeries = [
      {series_id: 1, name: 'Engel-series'},
      {series_id: 2, name: 'serie'},
    ];

    (seriesService.getAll as jest.Mock).mockResolvedValue(mockSeries);
    await new Promise(resolve => setTimeout(resolve, 0));

    wrapper.update();

    expect(wrapper.find('series-item')).toHaveLength(mockSeries.length);
    expect(wrapper.contains(<h2>engel-series</h2>)).toEqual(true);
    expect(wrapper.contains(<h2>serie</h2>)).toEqual(true);
  });

  test('Displays correct series name based on ID', async() => {
    (seriesService.getName as jest.Mock).mockResolvedValue('Engel-series');
    const seriesName = await seriesService.getName(1);

    expect(seriesName).toBe('Engel-series');
    expect(seriesService.getName).toHaveBeenCalledWith(1);
  });

  test('Displays error message on service failure', async () => {
    (seriesService.getName as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    await new Promise(resolve => setTimeout(resolve, 0));

    wrapper.update();

    expect(
      wrapper.contains(
        <div className="error-message"> Error getting series name: failed to fetch</div>
      )
    ).toBe(true);
  });

  test('Create new series functionality work', async () => {
    const newSeries = { name: 'Ny-serie'};
    (seriesService.createSeries as jest.Mock).mockResolvedValue({ series_id:3, ...newSeries});

    const createdSeries = await seriesService.createSeries({name: newSeries.name});
    expect(createdSeries.name).toBe('Ny-serie');
    expect(seriesService.createSeries).toHaveBeenCalledWith(newSeries.name);
  });

  test('Admin visibility button on user role', async () => {
    const mockedCookiesGet = Cookies.get as jest.MockedFunction<typeof Cookies.get>;
    mockedCookiesGet.mockReturnValue('admin');

    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find('.btn-create-series')).toHaveLength(1);

    mockedCookiesGet.mockReturnValue('user');
    wrapper = shallow(<>SeriesList</>);
    await new Promise(resolve => setTimeout(resolve,0));
    wrapper.update();

    expect(wrapper.find('.btn-create-series')).toHaveLength(0);
  });
});

