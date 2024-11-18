import * as React from 'react';
import { SeriesList } from '../../src/components/series-components';
import { Link } from 'react-router-dom';
import type { Series } from '../../src/services/series-service';
import { shallow } from 'enzyme';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  let wrapper: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ series_id: 1});
    Cookies.get.mockReturnValue('{ "role": "admin" }');
    wrapper = shallow(<SeriesList/>);
  });

  test('renders series name and angels correctly', () => {
    const mockSeriesName = 'Engel-series';
    const mockAngels = [
      { angel_id: 1, name: 'angel1', image: 'angel1.jpg'},
      { angel_id: 2, name: 'angel2', image: 'angel2.jpg'},
    ];

    wrapper.setState({ seriesName: mockSeriesName, angels: mockAngels});
    wrapper.update();

    expect(wrapper.find('h1').text()).toBe(mockSeriesName);
    expect(wrapper.find('.angel-card')).toHaveLength(mockAngels.length);
  });

  test('renders no angels message when no angels are available')
})












/*jest.mock('../../src/services/series-service', () => {
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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('Series Components tests', () => {
  let wrapper: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ series_id: '1' });
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

    expect(wrapper.find('series_id')).toHaveLength(mockSeries.length);
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

    expect(wrapper.find('.btn-create-angel')).toHaveLength(1);

    mockedCookiesGet.mockReturnValue('user');
    wrapper = shallow(<>SeriesList</>);
    await new Promise(resolve => setTimeout(resolve,0));
    wrapper.update();

    expect(wrapper.find('.btn-create-angel')).toHaveLength(0);
  });
});*/

