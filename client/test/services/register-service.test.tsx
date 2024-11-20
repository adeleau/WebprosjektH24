import axios from 'axios';
import registerService, { Users } from '../../src/services/register-service';
//link to nettside explaining use : https://medium.com/@swatikpl44/mastering-mocking-techniques-in-jest-for-react-testing-cbf4d7fde7ee
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RegisterService Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllUsers should match the snapshot', async () => {
      const mockUsers: Users[] = [
        {
          user_id: 1,
          username: 'testuser1',
          email: 'test1@example.com',
          password_hash: 'password123',
          created_at: '2023-01-01T12:00:00Z',
        },
        {
          user_id: 2,
          username: 'testuser2',
          email: 'test2@example.com',
          password_hash: 'password456',
          created_at: '2023-02-01T12:00:00Z',
        },
      ];
  
      mockedAxios.get.mockResolvedValue({ data: mockUsers });
  
      const users = await registerService.getAllUsers();
  
      expect(mockedAxios.get).toHaveBeenCalledWith('/users');
      expect(users).toMatchSnapshot();
    });

    test('normalizeDate should correctly format date strings', () => {
        const mockService = new (registerService as any).constructor();
        const date = new Date('2023-01-01T12:00:00.123Z');
        const formattedDate = mockService.normalizeDate(date);

        expect(formattedDate).toBe('2023-01-01T12:00:00');
    });

    test('normalizeDate should correctly format ISO strings', () => {
        const mockService = new (registerService as any).constructor();
        const isoString = '2023-01-01T12:00:00.123Z';
        const formattedDate = mockService.normalizeDate(isoString);

        expect(formattedDate).toBe('2023-01-01T12:00:00');
    });

    test('getAllUsers should fetch and return all users', async () => {
        const mockUsers: Users[] = [
            {
                user_id: 1,
                username: 'testuser1',
                email: 'test1@example.com',
                password_hash: 'password123',
                created_at: '2023-01-01T12:00:00Z',
            },
            {
                user_id: 2,
                username: 'testuser2',
                email: 'test2@example.com',
                password_hash: 'password456',
                created_at: '2023-02-01T12:00:00Z',
            },
        ];

        mockedAxios.get.mockResolvedValue({ data: mockUsers });

        const users = await registerService.getAllUsers();

        expect(mockedAxios.get).toHaveBeenCalledWith('/users');
        expect(users).toEqual(
            mockUsers.map((user) => ({
                ...user,
                created_at: user.created_at.split('.')[0],
            }))
        );
    });

    test('getUserById should fetch and return a user by ID', async () => {
        const mockUser: Users = {
            user_id: 1,
            username: 'testuser1',
            email: 'test1@example.com',
            password_hash: 'password123',
            created_at: '2023-01-01T12:00:00Z',
        };

        mockedAxios.get.mockResolvedValue({ data: mockUser });

        const user = await registerService.getUserById(1);

        expect(mockedAxios.get).toHaveBeenCalledWith('/users/1');
        expect(user).toEqual({
            ...mockUser,
            created_at: mockUser.created_at.split('.')[0],
        });
    });

    test('registerUser should successfully register a new user', async () => {
      const newUser = { username: 'testuser3', email: 'test3@example.com', password_hash: 'password789' };
    
      mockedAxios.post.mockResolvedValue({ data: { success: true, user_id: 3 } });
    
      const response = await registerService.registerUser(newUser.username, newUser.email, newUser.password_hash);
    
      expect(mockedAxios.post).toHaveBeenCalledWith('/register', newUser);
      expect(response).toEqual({ success: true, user_id: 3 });
    });

    test('registerUser should throw an error if registration fails', async () => {
      const newUser = { username: 'testuser3', email: 'test3@example.com', password_hash: 'password789' };
    
      mockedAxios.post.mockRejectedValue({ response: { data: 'Email already exists' } });
    
      await expect(
        registerService.registerUser(newUser.username, newUser.email, newUser.password_hash)
      ).rejects.toThrow('Email already exists');
    
      expect(mockedAxios.post).toHaveBeenCalledWith('/register', newUser);
    });
    
    test('checkUserExists should return true if user exists', async () => {
      mockedAxios.get.mockResolvedValue({ data: { exists: true } });
    
      const exists = await registerService.checkUserExists('testuser1', 'test1@example.com');
    
      expect(mockedAxios.get).toHaveBeenCalledWith('/check/users/', {
        params: { username: 'testuser1', email: 'test1@example.com', timestamp: expect.any(Number) },
      });
      expect(exists).toBe(true);
    });

    test('checkUserExists should return false if user does not exist', async () => {
      mockedAxios.get.mockResolvedValue({ data: { exists: false } });
    
      const exists = await registerService.checkUserExists('nonexistentuser', 'nonexistent@example.com');
    
      expect(mockedAxios.get).toHaveBeenCalledWith('/check/users/', {
        params: { username: 'nonexistentuser', email: 'nonexistent@example.com', timestamp: expect.any(Number) },
      });
      expect(exists).toBe(false);
    });

    test('checkUserExists should return true if the user exists', async () => {
      mockedAxios.get.mockResolvedValue({ data: { exists: true } });
    
      const exists = await registerService.checkUserExists('testuser1', 'test1@example.com');
    
      expect(mockedAxios.get).toHaveBeenCalledWith('/check/users/', {
        params: { username: 'testuser1', email: 'test1@example.com', timestamp: expect.any(Number) },
      });
      expect(exists).toBe(true); 
    });
});
