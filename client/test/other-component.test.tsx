import * as React from 'react';
import { Home, About, Navbar, SearchPage, Leftbar, Menu, Footer } from '../src/components/other-components';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';

describe('Navbar component tests', () => {
    test('Navbar draws correctly', (done) => {
        const wrapper = shallow(<Home />);
        setTimeout(() => {
            expect(
                wrapper.containsAllMatchingElements([
                    <div className="navbar">
                      <div className="navbar_search">
                        <input />
                        <div className="search-results"></div>
                      </div>
                      <div className="navbar_logo-container">
                        <Link to="/">
                          <img />
                        </Link>
                      </div>
                      <div className="navbar_profile">
                      </div>
                    </div>
                  ])                  
            ).toEqual(true);
            done();
        })
    });

    test('Search component test')
});

describe('Leftbar component tests', () => {
    test('Leftbar draws correctly', (done) => {
        const wrapper = shallow(<Home />);
        setTimeout(() => {
            expect(
                wrapper.containsAllMatchingElements([
                    
                ])
            ).toEqual(true);
            done();
        })
    })

    test('')
});
