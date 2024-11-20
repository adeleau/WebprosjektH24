import axios from "axios";
import userService, { User } from '../../src/services/user-service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('userService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllUsers should fetch and return all users', async () => {
        const mockUsers: User[] = [
            {
                user_id: 1,
                username: 'user1',
                email: 'user1@test.com',
                password_hash: 'user123',
                created_at: '2023-01-01T12:00:00Z',
                role: 'admin',
                bio: 'bio for user1',
                profile_picture: 'user1.jpg',
            },
            {
                user_id: 2,
                username: 'user2',
                email: 'user2@test.com',
                password_hash:'user234',
                created_at: '2023-01-01T12:00:00Z',
                role: 'user',
                bio: 'bio for user 2',
                profile_picture: 'user2.jpg',
            },
        ];
        const userId=1;
        mockedAxios.get.mockResolvedValue({ data: mockUsers });
        const users = await userService.getAllUsers();

        expect(mockedAxios.get).toHaveBeenCalledWith('/users');
        expect(users).toEqual(mockUsers);
    });

    test('getById should fetch one user by Id', async () => {
        const mockUser: User[] = [
            {
                user_id: 1,
                username: 'user1',
                email: 'user1@test.com',
                password_hash: 'user123',
                created_at: '2023-01-01T12:00:00Z',
                role: 'admin',
                bio: 'bio for user1',
                profile_picture: 'user1.jpg',
            },
        ];

            const userId = 1;
            mockedAxios.get.mockResolvedValue({ data: mockUser });
            const user = await userService.getById(userId);

            expect(mockedAxios.get).toHaveBeenCalledWith(`users/${userId}`);
            expect(user).toEqual(mockUser);  
    });

    test('getbyId should throw an error on failure', async() => {
        const userId= 1;
        mockedAxios.get.mockRejectedValue(new Error('Network Error'));

        await expect(userService.getById(userId)).rejects.toThrow('Could not fetch user');
        expect(mockedAxios.get).toHaveBeenCalledWith(`users/${userId}`);

     
    });

    test('update should throw an error on failure', async () => {
        const userId = 1;
        const userData: Partial<User> = {
            bio: 'updated bio',
        };

        mockedAxios.put.mockRejectedValue(new Error('Network Error'));

        await expect(userService.update(userId, userData)).rejects.toThrow('Could not update user');
        expect (mockedAxios.put).toHaveBeenCalledWith(`users/${userId}`, userData);
     });

     test('Login should return true on successful login', async() => {
        const uname = 'user1';
        const passwd = 'user123';

        mockedAxios.post.mockResolvedValue({ data: true});

        const login = await userService.login(uname, passwd);
        expect(login).toBe(true);
     });

     test('Login should throw an error or failure', async () => {
        const uname = 'user1';
        const passwd = 'user123';

        mockedAxios.post.mockRejectedValue(new Error('invalid credentials'));
        await expect(userService.login(uname, passwd)).rejects.toThrow('invalid credentials');
        expect(mockedAxios.post).toHaveBeenCalledWith('/users/login', {username: uname, password: passwd});
     });

     test('getByUsername should fetch a user by username', async () => {
        const mockUser: User = {
          user_id: 1,
          username: 'user1',
          email: 'user1@test.com',
          password_hash: 'user123',
          created_at: '2023-01-01T12:00:00Z',
          role: 'admin',
          bio: 'bio for user1',
          profile_picture: 'user1.jpg',
        };
      
        const username = 'user1';
        mockedAxios.get.mockResolvedValue({ data: mockUser });
      
        const user = await userService.getByUsername(username);
      
        expect(mockedAxios.get).toHaveBeenCalledWith(`/users/uname/${username}`);
        expect(user).toEqual(mockUser);
      });
        
      test('getByUsername should fetch a user by username', async () => {
        const mockUser: User = {
          user_id: 1,
          username: 'user1',
          email: 'user1@test.com',
          password_hash: 'user123',
          created_at: '2023-01-01T12:00:00Z',
          role: 'admin',
          bio: 'bio for user1',
          profile_picture: 'user1.jpg',
        };
      
        const username = 'user1';
        mockedAxios.get.mockResolvedValue({ data: mockUser });
      
        const user = await userService.getByUsername(username);
      
        expect(mockedAxios.get).toHaveBeenCalledWith(`/users/uname/${username}`);
        expect(user).toEqual(mockUser);
      });
    
      test('Login should return true on successful login', async () => {
        const uname = 'user1';
        const passwd = 'user123';
      
        mockedAxios.post.mockResolvedValue({ data: true });
      
        const isLoggedIn = await userService.login(uname, passwd);
      
        expect(mockedAxios.post).toHaveBeenCalledWith('/users/login', { username: uname, password: passwd });
        expect(isLoggedIn).toBe(true);
      });
      
});