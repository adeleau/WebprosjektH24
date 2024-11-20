import registerService, { Users } from '../../src/services/register-service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RegisterService tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getUserById should fetch a user by user_id', async() => {
    const mockUser: Users = {
      user_id: 1,
      username: 'testuser',
      email: 'testuser@test.com',
      password_hash: '123test',
      created_at: new Date(),
    };

    mockedAxios.get.mockResolvedValue({ data: mockUser });
    const user_id = await registerService.getUserById(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('/users/1');
    expect(user_id).toEqual(mockUser);
  });

  test('getAllUsers should fetch all users', async () => {
    const mockUsers: Users[] = [
    {
      user_id: 1,
      username: 'testuser1',
      email: 'test1@example.com',
      password_hash: 'hashedpassword1',
      created_at: new Date(),
    },
    {
      user_id: 2,
      username: 'testuser2',
      email: 'test2@example.com',
      password_hash: 'hashedpassword2',
      created_at: new Date(),
    },
    ];
    mockedAxios.get.mockResolvedValue({ data: mockUsers });

    const users = await registerService.getAllUsers();
    
    expect(mockedAxios.get).toHaveBeenCalledWith('/users');
    expect(users).toEqual(mockUsers);
  });

  test('registerUser should successfully register a new user', async () => {
    const mockResponse = {
      user_id: 3,
      username: 'newuser',
      email: 'new@example.com',
      password_hash: 'hashedpassword',
      created_at: new Date(),
    };
    
    const username = 'newuser';
    const email = 'new@example.com';
    const password_hash = 'hashedpassword';
    
    mockedAxios.post.mockResolvedValue({ data: mockResponse });
    
    const user_id = await registerService.registerUser(username, email, password_hash);
    
    expect(mockedAxios.post).toHaveBeenCalledWith('/register', {
      username,
      email,
      password_hash,
    });
    expect(user_id).toEqual(mockResponse);
  });
      
  test('checkUserExists should return false if user does not exist', async () => {
    mockedAxios.get.mockResolvedValue({ data: { exists: false } });
    
    const username = 'nonexistentuser';
    const email = 'nonexistent@example.com';
    
    const exists = await registerService.checkUserExists(username, email);
    
    expect(mockedAxios.get).toHaveBeenCalledWith('/check/users/', {
      params: {
      username,
      email,
      timestamp: expect.any(Number),
      },
    });
    expect(exists).toBe(false);
  });
    
  test('checkUserExists should return false on error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));
    
    const username = 'erroruser';
    const email = 'error@example.com';
    
    const exists = await registerService.checkUserExists(username, email);
    
    expect(mockedAxios.get).toHaveBeenCalledWith('/check/users/', {
      params: {
      username,
      email,
      timestamp: expect.any(Number),
      },
    });
    expect(exists).toBe(false);
  });

  test('registerUser should throw an error on registration failure', async () => {
    const username = 'faileduser';
    const email = 'faileduser@example.com';
    const password_hash = 'failedpassword';

    const mockError = {
        response: {
            data: 'Registration failed due to server error',
        },
    };

    mockedAxios.post.mockRejectedValue(new Error(mockError.response.data));

    await expect(registerService.registerUser(username, email, password_hash)).rejects.toThrow(
        'Registration failed due to server error'
    );

    expect(mockedAxios.post).toHaveBeenCalledWith('/register', {
        username,
        email,
        password_hash,
    });
});

})