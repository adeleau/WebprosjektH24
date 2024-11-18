import * as React from 'react';
import { MasterList, AngelDetails, AngelNew, AngelEdit } from '../../src/components/angel-components';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme';


describe('Angel component tests', () => {
    test('MasterList draws correctly', (done) => {
        const wrapper = shallow(<MasterList />);
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