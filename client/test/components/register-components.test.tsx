import * as React from 'react';
import { Register } from '../../src/components/register-components';
import { Link } from 'react-router-dom';
import registerService from '../../src/services/register-service';
import type { Users } from '../../src/services/register-service';
import { shallow } from 'enzyme';

jest.mock('../src/services/register-service',  () => ({
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    registerUser: jest.fn(),
    checkUserExists: jest.fn(),
}));

describe('RegisterService Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Resetter mocks før hver test
    });

    test('getAllUsers fetches and returns all users', async () => {
        const mockUsers: Users[] = [
        { user_id: 1, username: 'eminakun', email: 'emina@kun.com', password_hash: 'Angel123!', created_at: new Date()},
        { user_id: 2, username: 'adelesan', email: 'adele@san.com', password_hash: 'Angel123!', created_at: new Date()},
        { user_id: 3, username: 'gurochan', email: 'guro@chan', password_hash: 'Angel123!', created_at: new Date()},
        ];

    (registerService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
    const users = await registerService.getAllUsers();

    expect(registerService.getAllUsers).toHaveBeenCalled();
    expect(users).toEqual(mockUsers);
  });
  
  test('registerUser posts data and returns response', async () => {
    const newUser = { username: 'julia', email: 'julia@kun.com', password_hash: 'Angel123!' };
    const mockResponse = { message: 'User registered successfully', user_id: 4 };

    (registerService.registerUser as jest.Mock).mockResolvedValue(mockResponse);

    const response = await registerService.registerUser(newUser.username, newUser.email, newUser.password_hash);

    expect(registerService.registerUser).toHaveBeenCalledWith(newUser.username, newUser.email, newUser.password_hash);
    expect(response).toEqual(mockResponse);
  });

  test('checkUserExists confirms if a user exists', async () => {
    const mockResponse = true;

    (registerService.checkUserExists as jest.Mock).mockResolvedValue(mockResponse);

    const exists = await registerService.checkUserExists('ExistingUser', 'existing@example.com');

    expect(registerService.checkUserExists).toHaveBeenCalledWith('ExistingUser', 'existing@example.com');
    expect(exists).toBe(true);
  });

  test('checkUserExists handles errors gracefully', async () => {
    (registerService.checkUserExists as jest.Mock).mockRejectedValue(new Error('Network error'));

    const exists = await registerService.checkUserExists('NonexistentUser', 'nonexistent@example.com');

    expect(registerService.checkUserExists).toHaveBeenCalledWith('NonexistentUser', 'nonexistent@example.com');
    expect(exists).toBe(false);
  });
});

