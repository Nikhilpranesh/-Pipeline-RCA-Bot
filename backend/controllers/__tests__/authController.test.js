const request = require('supertest');
const User = require('../models/User');
const { registerUser, loginUser, getUserProfile } = require('../authController');

jest.mock('../models/User');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        role: 'User',
        save: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);

      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: 'User'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testuser',
          email: 'test@example.com',
          role: 'User'
        })
      );
    });

    it('should return error if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

  describe('loginUser', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'User'
      };

      User.findOne.mockResolvedValue(mockUser);

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalled();
    });

    it('should return error with invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });
  });
});
