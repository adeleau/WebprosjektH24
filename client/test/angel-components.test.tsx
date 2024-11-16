import * as React from 'react';
import { MasterList, AngelDetails, AngelNew, AngelEdit } from '../src/components/angel-components';
import { Link } from 'react-router-dom';
import angelService from '../src/services/angel-service';
import type { Angel, AngelHistory } from '../src/services/angel-service';
import { shallow } from 'enzyme';


jest.mock('../src/services/angel-service', () => {
    class AngelService {
        getAll() {
            return Promise.resolve([
                { angel_id: 1, name: 'Apple', description: 'Apple Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Apple.png', release_year: 2019, views: 6, user_id: 2/*created/updated at?*/, series_id: 4 },
                { angel_id: 2, name: 'Cow', description: 'Cow Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cow_01-1.jpg', release_year: 2018, views: 11, user_id: 1/*created/updated at?*/, series_id: 1 },
                { angel_id: 3, name: 'Candy', description: 'Candy Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_candy_01.jpg', release_year: 2018, views: 7, user_id: 3/*created/updated at?*/, series_id: 6 },
            ])
        }
    
        get(angel_id: number) {
            return Promise.resolve({
                angel_id: 1, name: 'Apple', description: 'Apple Sonny Angel', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2019/08/Apple.png', release_year: 2019, views: 6, user_id: 2/*created/updated at?*/, series_id: 4
            })
        } 
    
        createAngel() {
            return Promise.resolve(4)
        }
        
    
        updateAngel(angel_id: number, name: string, description: string, image: string, release_year: number, views: number, user_id: number/*created/updated at?*/, series_id: number) {
            return Promise.resolve(angel_id);
        }
    
        deleteAngel(angel_id: number) {
            return Promise.resolve(angel_id);
        }

        getBySeries(series_id: number) {
            
        }
    
        search(query: string) {
            
        }
    
        getUsername(angel_id: number) {
            
        }
    
        getCreatedAt(angel_id: number) {
            
          }
      
          getUpdatedAt(angel_id: number) {
            
          }
    }

    return new AngelService();
})

describe('Angel component tests', () => {
    test('MasterList draws correctly', (done) => {
        const wrapper = shallow(<MasterList />);
        setTimeout(() => {
            expect(
                wrapper.containsAllMatchingElements
            ).toEqual(true);
            done();
        })
    })

    test('')
})