// import * as React from 'react';
// import { Home, About, Navbar, SearchPage, Leftbar, Menu, Footer } from '../../src/components/other-components';
// import { Link, MemoryRouter } from 'react-router-dom';
// import { shallow, mount } from 'enzyme';

// describe('Navbar component tests', () => {
  // test('Navbar draws correctly', (done) => {
  //     const wrapper = shallow(
  //         <MemoryRouter>
  //             <Navbar />
  //         </MemoryRouter>
  //     );
  //     console.log(wrapper.debug());
  //     setTimeout(() => {
  //         expect(
  //             wrapper.containsAllMatchingElements([
  //                 <div className="navbar">
  //                     <div className="navbar_search">
  //                         <input type="text" placeholder="Search..." value="" />
  //                     </div>
  //                     <div className="navbar_logo-container">
  //                         <Link to="/">
  //                             <img src="https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SonnyAngel_logo.png" alt="Main Logo" className="navbar_logo" />
  //                         </Link>
  //                     </div>
  //                     <div className="navbar_profile">
  //                         <Link to="/login" className="login-link">
  //                             Log in
  //                         </Link>
  //                     </div>
  //                 </div>
  //             ])
  //         ).toContain(true);
  //         done();
  //     });
  // });

//   test('Typing in the searchbar works', (done) => {
    
//   })
// });

// describe('Leftbar component tests', () => {
//     test('Leftbar draws correctly', (done) => {
//         const wrapper = shallow(<Home />);
//         setTimeout(() => {
//             expect(
//                 wrapper.containsAllMatchingElements([
                    
//                 ])
//             ).toEqual(true);
//             done();
//         })
//     })

//     test('')
// });

import * as React from 'react';
import { Home, About, Navbar, SearchPage, Leftbar, Footer, PopularPage, HowTo } from '../../src/components/other-components';
import { shallow, mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import AngelService from '../../src/services/angel-service';
import SeriesService from '../../src/services/series-service';
import Cookies from 'js-cookie';

jest.mock('../../src/services/angel-service');
jest.mock('../../src/services/series-service');
jest.mock('js-cookie');

describe('Other Components Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Home renders with correct content', () => {
    const wrapper = mount(
      <Router>
        <Home />
      </Router>
    );

    expect(wrapper.find('.home-content').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toContain('INFORMATION');
    expect(wrapper.find('.home-image img').at(0).prop('src')).toBe(
      'https://www.sonnyangel.com/renewal/wp-content/uploads/2021/10/sa_christmas2021_banner.jpg'
    );
  });

  test('About renders with correct sections and images', () => {
    const wrapper = mount(
      <Router>
        <About />
      </Router>
    );

    expect(wrapper.find('h2').at(0).text()).toBe('He may bring you happiness.');
    expect(wrapper.find('h2').at(1).text()).toBe('Try your luck.');
    expect(wrapper.find('h2').at(2).text()).toBe('All started from 18cm.');
    expect(wrapper.find('img').at(0).prop('src')).toContain('180907_0170_-2.jpg');
  });

  describe('Navbar Tests', () => {
    test('Navbar renders correctly with user profile if logged in', () => {
      Cookies.get.mockReturnValue(JSON.stringify({ username: 'testuser', profile_picture: '' }));

      const wrapper = mount(
        <Router>
          <Navbar />
        </Router>
      );

      expect(wrapper.find('.navbar_profile span').text()).toBe('testuser');
    });

    test('Navbar renders login link if user is not logged in', () => {
      Cookies.get.mockReturnValue(null);

      const wrapper = mount(
        <Router>
          <Navbar />
        </Router>
      );

      expect(wrapper.find('.login-link').text()).toBe('Log in');
    });

    test('Navbar handles search correctly', async () => {
      AngelService.search.mockResolvedValue([
        { angel_id: 1, name: 'Angel One', image: 'https://example.com/angel1.jpg' },
      ]);

      const wrapper = mount(
        <Router>
          <Navbar />
        </Router>
      );

      const searchInput = wrapper.find('input[placeholder="Search..."]');
      searchInput.simulate('change', { target: { value: 'Angel' } });
      searchInput.simulate('keyDown', { key: 'Enter' });

      await new Promise(setImmediate); // wait for async operations
      wrapper.update();

      expect(wrapper.find('.search-results').exists()).toBe(true);
      expect(wrapper.find('.result-item a').text()).toBe('Angel One');
    });
  });

  test('SearchPage renders search results', async () => {
    AngelService.search.mockResolvedValue([
      { angel_id: 1, name: 'Angel One', image: 'https://example.com/angel1.jpg' },
      { angel_id: 2, name: 'Angel Two', image: 'https://example.com/angel2.jpg' },
    ]);

    const wrapper = mount(
      <Router>
        <SearchPage />
      </Router>
    );

    await new Promise(setImmediate); // wait for async operations
    wrapper.update();

    expect(wrapper.find('.angel-card').length).toBe(2);
    expect(wrapper.find('.angel-card h3').at(0).text()).toBe('Angel One');
  });

  test('SearchPage handles errors when no results found', async () => {
    AngelService.search.mockRejectedValue(new Error('No results found'));

    const wrapper = mount(
      <Router>
        <SearchPage />
      </Router>
    );

    await new Promise(setImmediate); // wait for async operations
    wrapper.update();

    expect(wrapper.text()).toContain('No content found for this search.');
  });

  test('Leftbar renders with series list', async () => {
    SeriesService.getAll.mockResolvedValue([
      { series_id: 1, name: 'Series One' },
      { series_id: 2, name: 'Series Two' },
    ]);

    const wrapper = mount(
      <Router>
        <Leftbar />
      </Router>
    );

    await new Promise(setImmediate); // wait for async operations
    wrapper.update();

    wrapper.find('.nav-text.series span').simulate('click'); // open dropdown

    expect(wrapper.find('.dropdown-menu li').length).toBe(2);
    expect(wrapper.find('.dropdown-menu li a').at(0).text()).toBe('Series One');
  });

  test('PopularPage renders popular angels', async () => {
    AngelService.getPopular.mockResolvedValue([
      { angel_id: 1, name: 'Popular Angel 1', image: 'https://example.com/popular1.jpg' },
      { angel_id: 2, name: 'Popular Angel 2', image: 'https://example.com/popular2.jpg' },
    ]);

    const wrapper = mount(
      <Router>
        <PopularPage />
      </Router>
    );

    await new Promise(setImmediate); // wait for async operations
    wrapper.update();

    expect(wrapper.find('.angel-card').length).toBe(2);
    expect(wrapper.find('.angel-card h3').at(0).text()).toBe('Popular Angel 1');
  });

  test('PopularPage handles fetch error gracefully', async () => {
    AngelService.getPopular.mockRejectedValue(new Error('Error fetching popular angels'));

    const wrapper = mount(
      <Router>
        <PopularPage />
      </Router>
    );

    await new Promise(setImmediate); // wait for async operations
    wrapper.update();

    expect(wrapper.text()).toContain('Error fetching popular angels');
  });

  test('HowTo renders sections and links', () => {
    const wrapper = mount(
      <Router>
        <HowTo />
      </Router>
    );

    expect(wrapper.find('h2').at(0).text()).toBe('Log in to explore this Wiki.');
    expect(wrapper.find('h2').at(1).text()).toBe('How to Comment and Interact.');
    expect(wrapper.find('h2').at(2).text()).toBe('Manage Your Collection!');
    expect(wrapper.find('Link[to="/masterlist"]').exists()).toBe(true);
  });
});
