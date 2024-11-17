import * as React from 'react';
import { Home, About, Navbar, SearchPage, Leftbar, Menu, Footer } from '../src/components/other-components';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';

describe('Other component tests', () => {
    test('Home draws correctly', (done) => {
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
})