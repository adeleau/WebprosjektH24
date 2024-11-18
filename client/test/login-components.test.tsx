import * as React from 'react';
import { Login } from '../src/components/login-components';
import UserService from '../src/services/user-service';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';


jest.mock('../src/components/login-components', () => {
    return class UserService{
        login(username: string, password:string){
            if (username ==='Guro' && password ==='Passord123?'){
                return Promise.resolve(true);
            }else{
                return Promise.resolve
            }
        }
    }
       
        
})