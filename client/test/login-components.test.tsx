import * as React from 'react';
import { Login } from '../src/components/login-components';
import UserService from '../src/services/user-service';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

//Mocker User-service
jest.mock('../src/components/login-components', () => {
    return class UserService{
        login(username: string, password:string){
            if (username ==='Guro' && password ==='Passord123?'){
                return Promise.resolve(true);
            }else{
                return Promise.resolve(false);
            }
        }
        getByUsername(username:string){
            if (username === 'Guro'){
                return Promise.resolve({
                    user_id: 1,
                    username: 'Guro',
                    email: 'Guro@Oniichan.com',
                });
            }
            return Promise.reject('User not found');
        }
    };   
});

//mocker jest-cookie
jest.mock('js-cookie', () =>({
    get: jest.fn(),
    get: jest.fn(),
  }));

  //Må lage en mocking for history også..når den eksisterer
  //jest.mock('react-router-dom', () => ({
    //...jest.requireActual('react-router-dom'),
    //useHistory: () => ({
        //push: jest.fn(),
    //}),
  //}));

let wrapper: any; 

describe('Login components Test', () => {
    const mockSetCookie = Cookies.set as jest.MockedFunction<typeof Cookies.set>;
    //const mockHistoryPush = useHistory().push as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        wrapper = shallow(<Login />);
    });

    test('Renders correctly', () => {
        const wrapper = shallow(<Login/>);
        expect(wrapper.find('.login')).toHaveLength(1);
        expect(wrapper.find('input[type="text"]')).toHaveLength(1);
        expect(wrapper.find('input[type="password"]')).toHaveLength(1);
        expect(wrapper.find('button.login-btn')).toHaveLength(1);
    });

    test('Handles successfull login', async () => {
        const wrapper = shallow(<Login/>);
        const instance = wrapper.instance() as any;

        jest.spyOn(instance, 'handleLogin').mockImplementation(() => {
            return Promise.resolve(true);
        });

        wrapper.find('input[type="text"]').simulate('change', { target: {value: 'Guro'}});
        wrapper.find('input [type = "password]').simulate('change', { target: {value: 'Passord123?'}});
        wrapper.find('button.login-btn').simulate('click');

        setTimeout(() => {
            expect(mockSetCookie).toHaveBeenCalledWith('user', 'Guro');
            //expect(mockHistoryPush).toHaveBeenCalledWith('/home');
            done();
        }, 0);  
    });

    test('handles failed login', async (done) => {
        const wrapper = shallow(<Login />);
        const instance = wrapper.instance() as any;

        jest.spyOn(instance, 'handleLogin').mockImplementation(() => {
            return Promise.resolve(false);
        });

        wrapper.find('input[type="text"]').simulate('change', { target: { value: 'WrongUser' } });
        wrapper.find('input[type="password"]').simulate('change', { target: { value: 'WrongPass' } });
        wrapper.find('button.login-btn').simulate('click');

        setTimeout(() => {
            expect(wrapper.find('.error-message').text()).toEqual('Invalid Username or password');
            //expect(mockHistoryPush).not.toHaveBeenCalled();
            done();
        }, 0);
    });
});