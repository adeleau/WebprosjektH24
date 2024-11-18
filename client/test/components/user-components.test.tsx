import * as React from 'react';
import { UserProfile, UserSettings } from '../../src/components/user-components';
import { Link } from 'react-router-dom';
import userService from '../../src/services/user-service';
import type { User } from '../../src/services/user-service';
import { shallow } from 'enzyme';

import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserService Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('getAllUsers fetches and returns all users', async () => {
    const mockUsers: User[] = [
      { user_id: 1, username: 'user1', email: 'user1@example.com', password_hash: 'password1' },
      { user_id: 2, username: 'user2', email: 'user2@example.com', password_hash: 'password2' },
      { user_id: 3, username: 'user3', email: 'user3@example.com', password_hash: 'password3' },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockUsers });

    const users = await userService.getAllUsers();

    expect(mockedAxios.get).toHaveBeenCalledWith('/users');
    expect(users).toEqual(mockUsers);
  });

  test('getById fetches and returns a user by ID', async () => {
    const mockUser: User = {
      user_id: 1,
      username: 'user1',
      email: 'user1@example.com',
      password_hash: 'password1',
    };

    mockedAxios.get.mockResolvedValue({ data: mockUser });

    const user = await userService.getById(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('users/1');
    expect(user).toEqual(mockUser);
  });

  test('getById throws an error if the user is not found', async () => {
    mockedAxios.get.mockRejectedValue(new Error('User not found'));

    await expect(userService.getById(999)).rejects.toThrow('Could not fetch user');
    expect(mockedAxios.get).toHaveBeenCalledWith('users/999');
  });

  test('getByUsername fetches and returns a user by username', async () => {
    const mockUser: User = {
      user_id: 2,
      username: 'user2',
      email: 'user2@example.com',
      password_hash: 'password2',
    };

    mockedAxios.get.mockResolvedValue({ data: mockUser });

    const user = await userService.getByUsername('user2');

    expect(mockedAxios.get).toHaveBeenCalledWith('/users/uname/user2');
    expect(user).toEqual(mockUser);
  });

  test('update updates user details successfully', async () => {
    mockedAxios.put.mockResolvedValue({});

    const userData = { username: 'updateduser', email: 'updated@example.com' };
    await userService.update(1, userData);

    expect(mockedAxios.put).toHaveBeenCalledWith('users/1', userData);
  });

  test('update throws an error if update fails', async () => {
    mockedAxios.put.mockRejectedValue(new Error('Update failed'));

    const userData = { username: 'updateduser', email: 'updated@example.com' };

    await expect(userService.update(1, userData)).rejects.toThrow('Could not update user');
    expect(mockedAxios.put).toHaveBeenCalledWith('users/1', userData);
  });

  test('login returns true for valid credentials', async () => {
    mockedAxios.post.mockResolvedValue({ data: true });

    const isAuthenticated = await userService.login('testuser', 'testpassword');

    expect(mockedAxios.post).toHaveBeenCalledWith('/users/login', { username: 'testuser', password: 'testpassword' });
    expect(isAuthenticated).toBe(true);
  });

  test('login returns false for invalid credentials', async () => {
    mockedAxios.post.mockResolvedValue({ data: false });

    const isAuthenticated = await userService.login('invaliduser', 'invalidpassword');

    expect(mockedAxios.post).toHaveBeenCalledWith('/users/login', { username: 'invaliduser', password: 'invalidpassword' });
    expect(isAuthenticated).toBe(false);
  });
});
