/*import * as React from 'react';
import { PostList, PostNew, PostEdit, PostDetails } from '../../src/components/post-components';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
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
        {
          post_id: 1,
          user_id: 1,
          username: 'user1',
          title: 'First Post',
          content: 'Hello World!',
          created_at: new Date().toISOString(),
        },
      ]);

      render(
        <MemoryRouter>
          <PostList />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('First Post')).toBeInTheDocument();
        expect(screen.getByText('New post as testuser')).toBeInTheDocument();
      });
    });

    test('shows error message when posts cannot be fetched', async () => {
      (PostService.getAll as jest.Mock).mockRejectedValue(new Error('Failed to fetch posts'));

      render(
        <MemoryRouter>
          <PostList />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Error getting posts: Failed to fetch posts')).toBeInTheDocument();
      });
    });
  });

  describe('PostNew Component', () => {
    test('renders and allows creating a new post', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
      (PostService.createPost as jest.Mock).mockResolvedValue(1);

      render(
        <MemoryRouter>
          <PostNew />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Post' } });
      fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: 'This is a new post.' } });
      fireEvent.change(screen.getByLabelText(/Image/i), { target: { value: 'https://example.com/image.jpg' } });
      fireEvent.click(screen.getByText('Create Post'));

      await waitFor(() => {
        expect(PostService.createPost).toHaveBeenCalledWith(
          1,
          'testuser',
          'New Post',
          'This is a new post.',
          'https://example.com/image.jpg'
        );
      });
    });

    test('shows error message when post creation fails', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
      (PostService.createPost as jest.Mock).mockRejectedValue(new Error('Failed to create post'));

      render(
        <MemoryRouter>
          <PostNew />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Create Post'));

      await waitFor(() => {
        expect(screen.getByText('Error creating post: Failed to create post')).toBeInTheDocument();
      });
    });
  });

  describe('PostEdit Component', () => {
    test('renders and allows editing a post', async () => {
      const post = {
        post_id: 1,
        user_id: 1,
        username: 'testuser',
        title: 'Old Title',
        content: 'Old Content',
        image: '',
        created_at: '',
      };
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
      (PostService.get as jest.Mock).mockResolvedValue(post);
      (PostService.updatePost as jest.Mock).mockResolvedValue(null);

      render(
        <MemoryRouter initialEntries={['/posts/1/edit']}>
          <Route path="/posts/:postId/edit">
            <PostEdit />
          </Route>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('Old Title')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Title' } });
      fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: 'New Content' } });
      fireEvent.click(screen.getByText('Save Changes'));

      await waitFor(() => {
        expect(PostService.updatePost).toHaveBeenCalledWith(1, 'New Title', 'New Content', '');
      });
    });

    test('shows error when failing to fetch post', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
      (PostService.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch post'));

      render(
        <MemoryRouter initialEntries={['/posts/1/edit']}>
          <Route path="/posts/:postId/edit">
            <PostEdit />
          </Route>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Error getting post: Failed to fetch post')).toBeInTheDocument();
      });
    });
  });

  describe('PostDetails Component', () => {
    test('renders post details and allows deletion by admin', async () => {
      const post = {
        post_id: 1,
        user_id: 1,
        username: 'testuser',
        title: 'Post Title',
        content: 'Post Content',
        image: '',
        created_at: '',
      };
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, role: 'admin' }));
      (PostService.get as jest.Mock).mockResolvedValue(post);
      (PostService.deletePost as jest.Mock).mockResolvedValue(null);

      render(
        <MemoryRouter initialEntries={['/posts/1']}>
          <Route path="/posts/:postId">
            <PostDetails />
          </Route>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Post Title')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Delete'));

      await waitFor(() => {
        expect(PostService.deletePost).toHaveBeenCalledWith(1);
      });
    });

    test('shows error when failing to fetch post', async () => {
      (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1 }));
      (PostService.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch post'));

      render(
        <MemoryRouter initialEntries={['/posts/1']}>
          <Route path="/posts/:postId">
            <PostDetails />
          </Route>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Error getting post: Failed to fetch post')).toBeInTheDocument();
      });
    });
  });
});*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// import * as React from 'react';
// import { PostList, PostNew, PostEdit, PostDetails } from '../../src/components/post-components';
// import { mount } from 'enzyme';
// import { MemoryRouter as Router } from 'react-router-dom';
// import PostService from '../../src/services/post-service';
// import Cookies from 'js-cookie';
// import { act } from '@testing-library/react';

// jest.mock('../../src/services/post-service');
// jest.mock('js-cookie');

// describe('Post Components Tests', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('PostList Component', () => {
//     test('renders posts and allows creating new post', async () => {
//       (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ username: 'testuser' }));
//       (PostService.getAll as jest.Mock).mockResolvedValue([
//         { post_id: 1, user_id: 1, username: 'user1', title: 'First Post', content: 'Hello World!', created_at: new Date().toISOString() },
//       ]);

//       const wrapper = mount(
//         <Router>
//           <PostList />
//         </Router>
//       );

//       await act(async () => {
//         await new Promise((resolve) => setTimeout(resolve, 0)); // Simulates async state update
//         wrapper.update();
//       });

//       expect(wrapper.find('.post-preview-card').length).toBe(1);
//       expect(wrapper.find('.post-title').text()).toBe('First Post');
//       expect(wrapper.find('.btn-new').text()).toContain('New post as testuser');
//     });

//     test('shows error message when posts cannot be fetched', async () => {
//       (PostService.getAll as jest.Mock).mockRejectedValue(new Error('Failed to fetch posts'));

//       const wrapper = mount(
//         <Router>
//           <PostList />
//         </Router>
//       );

//       await act(async () => {
//         await new Promise((resolve) => setTimeout(resolve, 0)); // Simulates async state update
//         wrapper.update();
//       });

//       expect(wrapper.find('.error-message').text()).toBe('Error getting posts: Failed to fetch posts');
//     });
//   });

//   describe('PostNew Component', () => {
//     test('renders and allows creating a new post', async () => {
//       (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
//       (PostService.createPost as jest.Mock).mockResolvedValue(1);

//       const wrapper = mount(
//         <Router>
//           <PostNew />
//         </Router>
//       );

//       wrapper.find('input#title').simulate('change', { target: { value: 'New Post' } });
//       wrapper.find('textarea#content').simulate('change', { target: { value: 'This is a new post.' } });
//       wrapper.find('textarea#image').simulate('change', { target: { value: 'https://example.com/image.jpg' } });
//       wrapper.find('.btn-create').simulate('click');

//       await act(async () => {
//         await new Promise((resolve) => setTimeout(resolve, 0));
//         wrapper.update();
//       });

//       expect(PostService.createPost).toHaveBeenCalledWith(1, 'testuser', 'New Post', 'This is a new post.', 'https://example.com/image.jpg');
//     });

//     test('shows error message when post creation fails', async () => {
//       (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
//       (PostService.createPost as jest.Mock).mockRejectedValue(new Error('Failed to create post'));

//       const wrapper = mount(
//         <Router>
//           <PostNew />
//         </Router>
//       );

//       wrapper.find('.btn-create').simulate('click');

//       await act(async () => {
//         await new Promise((resolve) => setTimeout(resolve, 0));
//         wrapper.update();
//       });

//       expect(wrapper.find('.error-message').text()).toBe('Error creating post: Failed to create post');
//     });
//   });

//   describe('PostEdit Component', () => {
//     test('renders and allows editing a post', async () => {
//       const post = { post_id: 1, user_id: 1, username: 'testuser', title: 'Old Title', content: 'Old Content', image: '', created_at: '' };
//       (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
//       (PostService.get as jest.Mock).mockResolvedValue(post);
//       (PostService.updatePost as jest.Mock).mockResolvedValue(null);

//       const wrapper = mount(
//         <Router initialEntries={['/posts/1/edit']}>
//           <PostEdit />
//         </Router>
//       );

//       await act(async () => {
//         await new Promise((resolve) => setTimeout(resolve, 0));
//         wrapper.update();
//       });

//       wrapper.find('input#title').simulate('change', { target: { value: 'New Title' } });
//       wrapper.find('textarea#content').simulate('change', { target: { value: 'New Content' } });
//       wrapper.find('.btn-success').simulate('click');

//       expect(PostService.updatePost).toHaveBeenCalledWith(1, 'New Title', 'New Content', '');
//     });

//     test('shows error when failing to fetch post', async () => {
//       (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, username: 'testuser' }));
//       (PostService.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch post'));

//       const wrapper = mount(
//         <Router initialEntries={['/posts/1/edit']}>
//           <PostEdit />
//         </Router>
//       );

//       await act(async () => {
//         await new Promise((resolve) => setTimeout(resolve, 0));
//         wrapper.update();
//       });

//       expect(wrapper.find('.error-message').text()).toBe('Error getting post: Failed to fetch post');
//     });
//   });

//   describe('PostDetails Component', () => {
//     test('renders post details and allows deletion by admin', async () => {
//       const post = { post_id: 1, user_id: 1, username: 'testuser', title: 'Post Title', content: 'Post Content', image: '', created_at: '' };
//       (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1, role: 'admin' }));
//       (PostService.get as jest.Mock).mockResolvedValue(post);
//       (PostService.deletePost as jest.Mock).mockResolvedValue(null);

//       const wrapper = mount(
//         <Router initialEntries={['/posts/1']}>
//           <PostDetails />
//         </Router>
//       );

//       await act(async () => {
//         await new Promise((resolve) => setTimeout(resolve, 0));
//         wrapper.update();
//       });

//       expect(wrapper.find('.post-title').text()).toBe('Post Title');
//       wrapper.find('.delete-button').simulate('click');

//       expect(PostService.deletePost).toHaveBeenCalledWith(1);
//     });

//     test('shows error when failing to fetch post', async () => {
//       (Cookies.get as jest.Mock).mockReturnValue(JSON.stringify({ user_id: 1 }));
//       (PostService.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch post'));

//       const wrapper = mount(
//         <Router initialEntries={['/posts/1']}>
//           <PostDetails />
//         </Router>
//       );

//       await act(async () => {
//         await new Promise((resolve) => setTimeout(resolve, 0));
//         wrapper.update();
//       });

//       expect(wrapper.find('.error-message').text()).toBe('Error getting post: Failed to fetch post');
//     });
//   });
// });
/////////////////////////////////////////////////////////////////////////////////////////////////////7

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
