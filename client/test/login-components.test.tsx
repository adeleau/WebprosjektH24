import * as React from 'react';
import { Login } from '../src/components/login-components';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';

jest.mock('../src/components/login-components', () => {
    class UserService{
        getAll() {
            return Promise.resolve([
                {user_id:, username:, email:},
                {user_id:, username:, email:},
                {user_id:, username:, email:},
            ]);
        }
    }
})