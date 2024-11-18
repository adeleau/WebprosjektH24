import * as React from 'react';
import { Register } from '../src/components/register-components';
import { Link } from 'react-router-dom';
import registerService from '../src/services/register-service';
import type { Users } from '../src/services/register-service';
import { shallow } from 'enzyme';

jest.mock('../src/services/register-service', () => {
    class RegisterService {
        getAll() {
            return Promise.resolve([
                { user_id: 1, username: 'eminakun', email: 'emina@kun.com', password_hash: 'Angel123!', created: "2021-11-18"},
                { user_id: 2, username: 'adelesan', email: 'adele@san.com', password_hash: 'Angel123!', created: "2021-11-18"},
                { user_id: 3, username: 'gurochan', email: 'guro@chan', password_hash: 'Angel123!', created: "2021-11-18"},
            ])
        }
    }
})
