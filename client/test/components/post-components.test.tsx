import * as React from 'react';
import { PostList, PostNew, PostEdit, PostDetails } from '../../src/components/post-components';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import PostService from '../../src/services/post-service';
import Cookies from 'js-cookie';

jest.mock('../../src/services/post-service');
jest.mock('js-cookie');

describe('Post Components Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PostList Component', () => {
    test('renders posts and allows creating new post', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'testuser' }));
      (PostService.getAll as jest.Mock).mockResolvedValue([
        { post_id: 1, user_id: 1, username: 'user1', title: 'First Post', content: 'Hello World!', created_at: new Date().toISOString() },
      ]);

      const wrapper = mount(
        <Router>
          <PostList />
        </Router>
      );

      await new Promise(setImmediate); // wait for async updates
      wrapper.update();

      expect(wrapper.find('.post-preview-card').length).toBe(1);
      expect(wrapper.find('.post-title').text()).toBe('First Post');
      expect(wrapper.find('.btn-new').text()).toContain('New post as testuser');
    });

    test('shows error message when posts cannot be fetched', async () => {
      (PostService.getAll as jest.Mock).mockRejectedValue(new Error('Failed to fetch posts'));

      const wrapper = mount(
        <Router>
          <PostList />
        </Router>
      );

      await new Promise(setImmediate); 
      wrapper.update();

      expect(wrapper.find('.error-message').text()).toBe('Error getting posts: Failed to fetch posts');
    });
  });

  describe('PostNew Component', () => {
    test('renders and allows creating a new post', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
      (PostService.createPost as jest.Mock).mockResolvedValue(1);

      const wrapper = mount(
        <Router>
          <PostNew />
        </Router>
      );

      wrapper.find('input#title').simulate('change', { target: { value: 'New Post' } });
      wrapper.find('textarea#content').simulate('change', { target: { value: 'This is a new post.' } });
      wrapper.find('textarea#image').simulate('change', { target: { value: 'https://example.com/image.jpg' } });
      wrapper.find('.btn-create').simulate('click');

      await new Promise(setImmediate); // wait for async updates

      expect(PostService.createPost).toHaveBeenCalledWith(1, 'testuser', 'New Post', 'This is a new post.', 'https://example.com/image.jpg');
    });

    test('shows error message when post creation fails', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
      (PostService.createPost as jest.Mock).mockRejectedValue(new Error('Failed to create post'));

      const wrapper = mount(
        <Router>
          <PostNew />
        </Router>
      );

      wrapper.find('.btn-create').simulate('click');
      await new Promise(setImmediate); // wait for async updates
      wrapper.update();

      expect(wrapper.find('.error-message').text()).toBe('Error creating post: Failed to create post');
    });
  });

  describe('PostEdit Component', () => {
    test('renders and allows editing a post', async () => {
      const post = { post_id: 1, user_id: 1, username: 'testuser', title: 'Old Title', content: 'Old Content', image: '', created_at: '' };
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
      (PostService.get as jest.Mock).mockResolvedValue(post);
      (PostService.updatePost as jest.Mock).mockResolvedValue(null);

      const wrapper = mount(
        <Router initialEntries={['/posts/1/edit']}>
          <PostEdit />
        </Router>
      );

      await new Promise(setImmediate); // wait for async updates
      wrapper.update();

      wrapper.find('input#title').simulate('change', { target: { value: 'New Title' } });
      wrapper.find('textarea#content').simulate('change', { target: { value: 'New Content' } });
      wrapper.find('.btn-success').simulate('click');

      expect(PostService.updatePost).toHaveBeenCalledWith(1, 'New Title', 'New Content', '');
    });

    test('shows error when failing to fetch post', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
      (PostService.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch post'));

      const wrapper = mount(
        <Router initialEntries={['/posts/1/edit']}>
          <PostEdit />
        </Router>
      );

      await new Promise(setImmediate); 
      wrapper.update();

      expect(wrapper.find('.error-message').text()).toBe('Error getting post: Failed to fetch post');
    });
  });

  describe('PostDetails Component', () => {
    test('renders post details and allows deletion by admin', async () => {
      const post = { post_id: 1, user_id: 1, username: 'testuser', title: 'Post Title', content: 'Post Content', image: '', created_at: '' };
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, role: 'admin' }));
      (PostService.get as jest.Mock).mockResolvedValue(post);
      (PostService.deletePost as jest.Mock).mockResolvedValue(null);

      const wrapper = mount(
        <Router initialEntries={['/posts/1']}>
          <PostDetails />
        </Router>
      );

      await new Promise(setImmediate); 
      wrapper.update();

      expect(wrapper.find('.post-title').text()).toBe('Post Title');
      wrapper.find('.delete-button').simulate('click');

      expect(PostService.deletePost).toHaveBeenCalledWith(1);
    });

    test('shows error when failing to fetch post', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1 }));
      (PostService.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch post'));

      const wrapper = mount(
        <Router initialEntries={['/posts/1']}>
          <PostDetails />
        </Router>
      );

      await new Promise(setImmediate); 
      wrapper.update();

      expect(wrapper.find('.error-message').text()).toBe('Error getting post: Failed to fetch post');
    });
  });
});