import * as React from 'react';
import { Home, About, Navbar, SearchPage, Leftbar, Menu, Footer } from '../src/components/other-components';
import { Link, MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';

describe('Navbar component tests', () => {
  test('Navbar draws correctly', (done) => {
      const wrapper = shallow(
          <MemoryRouter>
              <Navbar />
          </MemoryRouter>
      );
      console.log(wrapper.debug());
      setTimeout(() => {
          expect(
              wrapper.containsAllMatchingElements([
                  <div className="navbar">
                      <div className="navbar_search">
                          <input type="text" placeholder="Search..." value="" />
                      </div>
                      <div className="navbar_logo-container">
                          <Link to="/">
                              <img src="https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SonnyAngel_logo.png" alt="Main Logo" className="navbar_logo" />
                          </Link>
                      </div>
                      <div className="navbar_profile">
                          <Link to="/login" className="login-link">
                              Log in
                          </Link>
                      </div>
                  </div>
              ])
          ).toEqual(true);
          done();
      });
  });
});

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
