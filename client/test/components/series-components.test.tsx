import * as React from 'react';
import { SeriesList } from '../../src/components/series-components';
import { MemoryRouter, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import Cookies from 'js-cookie';
import AngelService from '../../src/services/angel-service';
import SeriesService from '../../src/services/series-service';

jest.mock('js-cookie');
jest.mock('../../src/services/angel-service');
jest.mock('../../src/services/series-service');

describe('SeriesList Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders series information and angels list successfully', async () => {
    (AngelService.getBySeries as jest.Mock).mockResolvedValue([
      { angel_id: 1, name: 'Angel One', image: '/angel1.jpg' },
      { angel_id: 2, name: 'Angel Two', image: '/angel2.jpg' },
    ]);
    (SeriesService.getName as jest.Mock).mockResolvedValue('Test Series');
    (AngelService.getAngelCount as jest.Mock).mockResolvedValue(2);

    (Cookies.get as jest.Mock).mockReturnValue(
      JSON.stringify({ username: 'testuser', role: 'admin' })
    );

    const wrapper = mount(
      <MemoryRouter initialEntries={['/series/1']}>
        <Route path="/series/:series_id">
          <SeriesList />
        </Route>
      </MemoryRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find('h1').text()).toBe('Test Series');
    expect(wrapper.find('.angel-card').length).toBe(2);
    expect(wrapper.find('.angel-card').at(0).find('h3').text()).toBe('Angel One');
    expect(wrapper.find('.angel-card').at(1).find('h3').text()).toBe('Angel Two');
  });

  test('renders error messages on API failures', async () => {
    (AngelService.getBySeries as jest.Mock).mockRejectedValue(
      new Error('Error fetching angels')
    );
    (SeriesService.getName as jest.Mock).mockRejectedValue(
      new Error('Error fetching series name')
    );
    (AngelService.getAngelCount as jest.Mock).mockRejectedValue(
      new Error('Error fetching angel count')
    );

    const wrapper = mount(
      <MemoryRouter initialEntries={['/series/1']}>
        <Route path="/series/:series_id">
          <SeriesList />
        </Route>
      </MemoryRouter>
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.text()).toContain('Error getting angels: Error fetching angels');
    expect(wrapper.text()).toContain('Error getting series name: Error fetching series name');
    expect(wrapper.text()).toContain('Error getting angel count: Error fetching angel count');
  });
});
