import React from 'react';
import { UserProfile, UserSettings, UserPage } from '../../src/components/user-components';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import userService from '../../src/services/user-service';
import LikesService from '../../src/services/likes-service';
import WishlistService from '../../src/services/wishlist-service';
import angelService from '../../src/services/angel-service';
import Cookies from 'js-cookie';

jest.mock('../../src/services/user-service');
jest.mock('../../src/services/likes-service');
jest.mock('../../src/services/wishlist-service');
jest.mock('../../src/services/angel-service');
jest.mock('js-cookie');

describe('User Components Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const waitForAsyncUpdates = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  describe('UserProfile Tests', () => {
    test('renders user profile with collection and wishlist', async () => {
      Cookies.get.mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));

      LikesService.getUserLikes.mockResolvedValue([{ angel_id: 1 }]);
      WishlistService.getUserWishlist.mockResolvedValue([{ angel_id: 2 }]);
      angelService.get
        .mockResolvedValueOnce({ angel_id: 1, name: 'Angel One', image: '/angel1.jpg' })
        .mockResolvedValueOnce({ angel_id: 2, name: 'Angel Two', image: '/angel2.jpg' });

      const wrapper = mount(
        <Router>
          <UserProfile />
        </Router>
      );

      await waitForAsyncUpdates();
      wrapper.update();

      expect(wrapper.find('.profile-header h2').text()).toBe('testuser');
      expect(wrapper.find('.angel-card').length).toBe(2);
      expect(wrapper.find('.angel-card h3').at(0).text()).toBe('Angel One');
      expect(wrapper.find('.angel-card h3').at(1).text()).toBe('Angel Two');
    });

    test('handles errors gracefully when fetching user data', async () => {
      Cookies.get.mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
      LikesService.getUserLikes.mockRejectedValue(new Error('Error fetching liked angels'));
      WishlistService.getUserWishlist.mockResolvedValue([]);

      const wrapper = mount(
        <Router>
          <UserProfile />
        </Router>
      );

      await waitForAsyncUpdates();
      wrapper.update();

      expect(wrapper.text()).toContain('Error fetching liked angels');
    });

    test('renders empty collection and wishlist messages', async () => {
      Cookies.get.mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
      LikesService.getUserLikes.mockResolvedValue([]);
      WishlistService.getUserWishlist.mockResolvedValue([]);

      const wrapper = mount(
        <Router>
          <UserProfile />
        </Router>
      );

      await waitForAsyncUpdates();
      wrapper.update();

      expect(wrapper.text()).toContain('Your collection is empty.');
      expect(wrapper.text()).toContain('Your wishlist is empty.');
    });
  });

  describe('UserSettings Tests', () => {
    test('renders user settings and updates user info', async () => {
      Cookies.get.mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser', role: 'user' }));

      userService.update.mockResolvedValue();

      const wrapper = mount(
        <Router>
          <UserSettings />
        </Router>
      );

      wrapper.find('input[name="username"]').simulate('change', { target: { name: 'username', value: 'updateduser' } });
      wrapper.find('form').simulate('submit');

      await waitForAsyncUpdates();

      expect(userService.update).toHaveBeenCalledWith(1, { username: 'updateduser' });
    });

    test('renders admin user settings with all users', async () => {
      Cookies.get.mockReturnValue(JSON.stringify({ user_id: 1, username: 'admin', role: 'admin' }));

      userService.getAllUsers.mockResolvedValue([
        { user_id: 2, username: 'user1', role: 'user' },
        { user_id: 3, username: 'user2', role: 'admin' },
      ]);

      const wrapper = mount(
        <Router>
          <UserSettings />
        </Router>
      );

      await waitForAsyncUpdates();
      wrapper.update();

      expect(wrapper.find('table tbody tr').length).toBe(2);
      expect(wrapper.find('table tbody tr').at(0).text()).toContain('user1');
      expect(wrapper.find('table tbody tr').at(1).text()).toContain('user2');
    });

    test('handles errors when updating user roles', async () => {
      Cookies.get.mockReturnValue(JSON.stringify({ user_id: 1, username: 'admin', role: 'admin' }));

      userService.getAllUsers.mockResolvedValue([{ user_id: 2, username: 'user1', role: 'user' }]);
      userService.update.mockRejectedValue(new Error('Error updating role'));

      const wrapper = mount(
        <Router>
          <UserSettings />
        </Router>
      );

      await waitForAsyncUpdates();
      wrapper.update();

      wrapper.find('button').at(1).simulate('click'); // Simulate role change button click

      await waitForAsyncUpdates();
      wrapper.update();

      expect(wrapper.text()).toContain('Error updating role');
    });
  });

  describe('UserPage Tests', () => {
    test('renders user details and tabs for collection and wishlist', async () => {
      userService.getById.mockResolvedValue({ user_id: 1, username: 'testuser' });
      LikesService.getUserLikes.mockResolvedValue([{ angel_id: 1 }]);
      WishlistService.getUserWishlist.mockResolvedValue([{ angel_id: 2 }]);
      angelService.get
        .mockResolvedValueOnce({ angel_id: 1, name: 'Angel One', image: '/angel1.jpg' })
        .mockResolvedValueOnce({ angel_id: 2, name: 'Angel Two', image: '/angel2.jpg' });

      const wrapper = mount(
        <Router initialEntries={['/users/1']}>
          <Route path="/users/:user_id">
            <UserPage />
          </Route>
        </Router>
      );

      await waitForAsyncUpdates();
      wrapper.update();

      expect(wrapper.find('.profile-header h2').text()).toBe('testuser');
      expect(wrapper.find('.angel-card').length).toBe(2);
      expect(wrapper.find('.angel-card h3').at(0).text()).toBe('Angel One');
      expect(wrapper.find('.angel-card h3').at(1).text()).toBe('Angel Two');
    });

    test('handles errors gracefully when fetching user data', async () => {
      userService.getById.mockRejectedValue(new Error('Error fetching user'));

      const wrapper = mount(
        <Router initialEntries={['/users/1']}>
          <Route path="/users/:user_id">
            <UserPage />
          </Route>
        </Router>
      );

      await waitForAsyncUpdates();
      wrapper.update();

      expect(wrapper.text()).toContain('Error fetching user');
    });
  });
});
