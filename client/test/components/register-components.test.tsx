import * as React from 'react';
import { Register } from '../../src/components/register-components';
import { mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';
import RegisterService from '../../src/services/register-service';

jest.mock('../../src/services/register-service');

describe('Register Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the Register component with all inputs and a button', () => {
    const wrapper = mount(
      <Router>
        <Register />
      </Router>
    );

    expect(wrapper.find('h1').text()).toBe('Register');
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').length).toBe(2);
    expect(wrapper.find('button.btn-register').text()).toBe('Register');
  });

  test('shows error messages for invalid form input', async () => {
    const wrapper = mount(
      <Router>
        <Register />
      </Router>
    );

    // simulate user input with invalid data
    wrapper.find('input[type="text"]').simulate('change', { target: { value: 'ab' } });
    wrapper.find('input[type="email"]').simulate('change', { target: { value: 'invalidemail' } });
    wrapper.find('input[type="password"]').at(0).simulate('change', { target: { value: 'short' } });
    wrapper.find('input[type="password"]').at(1).simulate('change', { target: { value: 'mismatch' } });

    // simulate form submission
    wrapper.find('button.btn-register').simulate('click');

    // wait for state updates
    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find('.error-message').at(0).text()).toBe('Username must be between 3 and 20 characters.');
    expect(wrapper.find('.error-message').at(1).text()).toBe('Invalid email format.');
    expect(wrapper.find('.error-message').at(2).text()).toBe(
      'Password must have at least 6 characters, including uppercase, lowercase, number, and special character.'
    );
    expect(wrapper.find('.error-message').at(3).text()).toBe('Passwords do not match.');
  });

  test('calls the RegisterService and shows success message on valid input', async () => {
    (RegisterService.registerUser as jest.Mock).mockResolvedValueOnce(null);

    const wrapper = mount(
      <Router>
        <Register />
      </Router>
    );

    // simulate valid user input
    wrapper.find('input[type="text"]').simulate('change', { target: { value: 'validuser' } });
    wrapper.find('input[type="email"]').simulate('change', { target: { value: 'user@example.com' } });
    wrapper.find('input[type="password"]').at(0).simulate('change', { target: { value: 'Valid123!' } });
    wrapper.find('input[type="password"]').at(1).simulate('change', { target: { value: 'Valid123!' } });

    // simulate form submission
    wrapper.find('button.btn-register').simulate('click');

    // wait for state updates
    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(RegisterService.registerUser).toHaveBeenCalledWith('validuser', 'user@example.com', 'Valid123!');
    expect(wrapper.find('.success-message').text()).toBe('Registration successful!');
  });

  test('shows error message on registration failure', async () => {
    (RegisterService.registerUser as jest.Mock).mockRejectedValueOnce(new Error('Registration failed'));

    const wrapper = mount(
      <Router>
        <Register />
      </Router>
    );

    // simulate valid user input
    wrapper.find('input[type="text"]').simulate('change', { target: { value: 'validuser' } });
    wrapper.find('input[type="email"]').simulate('change', { target: { value: 'user@example.com' } });
    wrapper.find('input[type="password"]').at(0).simulate('change', { target: { value: 'Valid123!' } });
    wrapper.find('input[type="password"]').at(1).simulate('change', { target: { value: 'Valid123!' } });

    // simulate form submission
    wrapper.find('button.btn-register').simulate('click');

    // wait for state updates
    await new Promise((resolve) => setTimeout(resolve, 0));
    wrapper.update();

    expect(wrapper.find('.error-message').text()).toBe('Registration failed. Please try again.');
  });
});
