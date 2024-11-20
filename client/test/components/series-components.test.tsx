import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import Cookies from 'js-cookie';
import AngelService from '../../src/services/angel-service';
import SeriesService from '../../src/services/series-service';
import { SeriesList } from '../../src/components/series-components';

jest.mock('js-cookie');
jest.mock('../../src/services/angel-service');
jest.mock('../../src/services/series-service');

describe('SeriesList Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders series information and angels list successfully', async () => {
    // Mock API responses
    (AngelService.getBySeries as jest.Mock).mockResolvedValue([
      { angel_id: 1, name: 'Angel One', image: '/angel1.jpg' },
      { angel_id: 2, name: 'Angel Two', image: '/angel2.jpg' },
    ]);
    (SeriesService.getName as jest.Mock).mockResolvedValue('Test Series');
    (AngelService.getAngelCount as jest.Mock).mockResolvedValue(2);

    (Cookies.get as jest.Mock).mockReturnValue(
      JSON.stringify({ username: 'testuser', role: 'admin' })
    );

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    // Test assertions
    const title = wrapper.find('h1');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Test Series');

    const angelCards = wrapper.find('.angel-card');
    expect(angelCards.length).toBe(2);
    expect(angelCards.at(0).find('h3').text()).toBe('Angel One');
    expect(angelCards.at(1).find('h3').text()).toBe('Angel Two');
  });

  test('renders error messages on API failures', async () => {
    // Mock API failures
    (AngelService.getBySeries as jest.Mock).mockRejectedValue(
      new Error('Error fetching angels')
    );
    (SeriesService.getName as jest.Mock).mockRejectedValue(
      new Error('Error fetching series name')
    );
    (AngelService.getAngelCount as jest.Mock).mockRejectedValue(
      new Error('Error fetching angel count')
    );

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    // Match specific error messages based on actual output
    const errorMessage = wrapper.find('.error-message');
    expect(errorMessage.exists()).toBe(true);

    const fullErrorText = errorMessage.text();
    expect(fullErrorText).toContain('Error getting angels: Error fetching angels');
    expect(fullErrorText).toContain('Error getting series name: Error fetching series name');
    expect(fullErrorText).toContain('Error getting angel count: Error fetching angel count');
  });

  test('renders no angels when the series is empty', async () => {
    (AngelService.getBySeries as jest.Mock).mockResolvedValue([]);
    (SeriesService.getName as jest.Mock).mockResolvedValue('Empty Series');
    (AngelService.getAngelCount as jest.Mock).mockResolvedValue(0);

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    expect(wrapper.find('h1').text()).toBe('Empty Series');
    expect(wrapper.find('.angel-card').length).toBe(0);
    expect(wrapper.text()).toContain('No angels found in this series.');
    expect(wrapper.text()).toContain('Number of angels in Empty Series: 0');
  });

  test('handles missing series name gracefully', async () => {
    (AngelService.getBySeries as jest.Mock).mockResolvedValue([
      { angel_id: 1, name: 'Angel One', image: '/angel1.jpg' },
    ]);
    (SeriesService.getName as jest.Mock).mockResolvedValue(null);
    (AngelService.getAngelCount as jest.Mock).mockResolvedValue(1);

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    expect(wrapper.find('h1').exists()).toBe(false);
    expect(wrapper.text()).toContain('Loading series information...');
  });

  test('shows admin actions for admin users', async () => {
    (Cookies.get as jest.Mock).mockReturnValue(
      JSON.stringify({ username: 'admin', role: 'admin' })
    );
    (AngelService.getBySeries as jest.Mock).mockResolvedValue([
      { angel_id: 1, name: 'Angel One', image: '/angel1.jpg' },
    ]);
    (SeriesService.getName as jest.Mock).mockResolvedValue('Admin Series');
    (AngelService.getAngelCount as jest.Mock).mockResolvedValue(1);

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    expect(wrapper.find('button.btn-create-angel').exists()).toBe(true);
    expect(wrapper.find('button.btn-delete-series').exists()).toBe(true);
  });

  test('does not show admin actions for non-admin users', async () => {
    (Cookies.get as jest.Mock).mockReturnValue(
      JSON.stringify({ username: 'user', role: 'user' })
    );
    (AngelService.getBySeries as jest.Mock).mockResolvedValue([
      { angel_id: 1, name: 'Angel One', image: '/angel1.jpg' },
    ]);
    (SeriesService.getName as jest.Mock).mockResolvedValue('User Series');
    (AngelService.getAngelCount as jest.Mock).mockResolvedValue(1);

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    expect(wrapper.find('button.btn-create-angel').exists()).toBe(false);
    expect(wrapper.find('button.btn-delete-series').exists()).toBe(false);
  });
});

/*import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act } from '@testing-library/react';
import { mount } from 'enzyme';
import Cookies from 'js-cookie';
import AngelService from '../../src/services/angel-service';
import SeriesService from '../../src/services/series-service';
import { SeriesList } from '../../src/components/series-components';

jest.mock('js-cookie');
jest.mock('../../src/services/angel-service');
jest.mock('../../src/services/series-service');

describe('SeriesList Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders series information and angels list successfully', async () => {
    // Mock API responses
    (AngelService.getBySeries as jest.Mock).mockResolvedValue([
      { angel_id: 1, name: 'Angel One', image: '/angel1.jpg' },
      { angel_id: 2, name: 'Angel Two', image: '/angel2.jpg' },
    ]);
    (SeriesService.getName as jest.Mock).mockResolvedValue('Test Series');
    (AngelService.getAngelCount as jest.Mock).mockResolvedValue(2);

    (Cookies.get as jest.Mock).mockReturnValue(
      JSON.stringify({ username: 'testuser', role: 'admin' })
    );

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    // Test assertions
    const title = wrapper.find('h1');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Test Series');

    const angelCards = wrapper.find('.angel-card');
    expect(angelCards.length).toBe(2);
    expect(angelCards.at(0).find('h3').text()).toBe('Angel One');
    expect(angelCards.at(1).find('h3').text()).toBe('Angel Two');
  });

  test('renders error messages on API failures', async () => {
    // Mock API failures
    (AngelService.getBySeries as jest.Mock).mockRejectedValue(
      new Error('Error fetching angels')
    );
    (SeriesService.getName as jest.Mock).mockRejectedValue(
      new Error('Error fetching series name')
    );
    (AngelService.getAngelCount as jest.Mock).mockRejectedValue(
      new Error('Error fetching angel count')
    );

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    // Match specific error messages based on actual output
    const errorMessage = wrapper.find('.error-message');
    expect(errorMessage.exists()).toBe(true);

    const fullErrorText = errorMessage.text();
    expect(fullErrorText).toContain('Error getting angels: Error fetching angels');
    expect(fullErrorText).toContain('Error getting series name: Error fetching series name');
    expect(fullErrorText).toContain('Error getting angel count: Error fetching angel count');
  });

  test('renders no angels when the series is empty', async () => {
    (AngelService.getBySeries as jest.Mock).mockResolvedValue([]);
    (SeriesService.getName as jest.Mock).mockResolvedValue('Empty Series');
    (AngelService.getAngelCount as jest.Mock).mockResolvedValue(0);

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    expect(wrapper.find('h1').text()).toBe('Empty Series');
    expect(wrapper.find('.angel-card').length).toBe(0);
    expect(wrapper.text()).toContain('No angels found in this series.');
    expect(wrapper.text()).toContain('Number of angels in Empty Series: 0');
  });

  test('handles missing series name gracefully', async () => {
    (AngelService.getBySeries as jest.Mock).mockResolvedValue([
      { angel_id: 1, name: 'Angel One', image: '/angel1.jpg' },
    ]);
    (SeriesService.getName as jest.Mock).mockResolvedValue(null);
    (AngelService.getAngelCount as jest.Mock).mockResolvedValue(1);

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    expect(wrapper.find('h1').exists()).toBe(false);
    expect(wrapper.text()).toContain('Loading series information...');
  });

  test('shows admin actions for admin users', async () => {
    (Cookies.get as jest.Mock).mockReturnValue(
      JSON.stringify({ username: 'admin', role: 'admin' })
    );
    (AngelService.getBySeries as jest.Mock).mockResolvedValue([
      { angel_id: 1, name: 'Angel One', image: '/angel1.jpg' },
    ]);
    (SeriesService.getName as jest.Mock).mockResolvedValue('Admin Series');
    (AngelService.getAngelCount as jest.Mock).mockResolvedValue(1);

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    expect(wrapper.find('button.btn-create-angel').exists()).toBe(true);
    expect(wrapper.find('button.btn-delete-series').exists()).toBe(true);
  });

  test('does not show admin actions for non-admin users', async () => {
    (Cookies.get as jest.Mock).mockReturnValue(
      JSON.stringify({ username: 'user', role: 'user' })
    );
    (AngelService.getBySeries as jest.Mock).mockResolvedValue([
      { angel_id: 1, name: 'Angel One', image: '/angel1.jpg' },
    ]);
    (SeriesService.getName as jest.Mock).mockResolvedValue('User Series');
    (AngelService.getAngelCount as jest.Mock).mockResolvedValue(1);

    let wrapper: any;
    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={['/series/1']}>
          <Route path="/series/:series_id">
            <SeriesList />
          </Route>
        </MemoryRouter>
      );
    });

    wrapper.update();

    expect(wrapper.find('button.btn-create-angel').exists()).toBe(false);
    expect(wrapper.find('button.btn-delete-series').exists()).toBe(false);
  });

});*/
