import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { ServiceResponse } from '@common/models/serviceResponse';
import { TypeUser } from '@modules/user/userModel';
import { User } from "@prisma/client";
import { app } from '@src/server';
import { PaginatedResult } from 'prisma-pagination';

describe('User API Endpoints', () => {
  describe('GET /v1/user/get', () => {
    it('should return a list of users', async () => {
      // Act
      const response = await request(app).get('/v1/user/get');
      const responseBody: ServiceResponse<TypeUser[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('Users found');
      // expect(responseBody.responseObject.length).toEqual(User.length);
      // responseBody.responseObject.forEach((user, index) => compareUsers(users[index] as TypeUser, user));
    });
  });

  describe('GET /v1/user/get/:UserID', () => {
    it('should return a user for a valid ID', async () => {
      // Arrange
      // const expectedUser = users.find((user) => user.id === testId);

      const responseUser = await request(app).get('/v1/user/get');
      const responseBodyUser: ServiceResponse<PaginatedResult<TypeUser>> = await responseUser.body;

      // Act
      const response = await request(app).get(`/v1/user/get/${responseBodyUser.responseObject.data[0].UserID}`);
      const responseBody: ServiceResponse<TypeUser> = await response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain('User found');
      // if (!expectedUser) fail('Expected user not found in test data');
      // compareUsers(expectedUser, responseBody.responseObject);
    });

    it('should return a not found error for non-existent ID', async () => {
      // Arrange
      const testId = "134470ae-d3df-4d29-80e1-679e30c73461";

      // Act
      const response = await request(app).get(`/v1/user/get/${testId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('User not found');
      expect(responseBody.responseObject).toEqual(null);
    });

    it('should return a bad request for invalid ID format', async () => {
      // Act
      const invalidInput = 'abc';
      const response = await request(app).get(`/v1/user/get/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain('Invalid input');
      expect(responseBody.responseObject).toEqual(null);
    });
  });
});

// function compareUsers(mockUser: TypeUser, responseUser: TypeUser) {
//   if (!mockUser || !responseUser) {
//     fail('Invalid test data: mockUser or responseUser is undefined');
//   }

//   expect(responseUser.UserID).toEqual(mockUser.id);
//   expect(responseUser.name).toEqual(mockUser.name);
//   expect(responseUser.email).toEqual(mockUser.email);
//   expect(responseUser.age).toEqual(mockUser.age);
//   expect(new Date(responseUser.createdAt)).toEqual(mockUser.createdAt);
//   expect(new Date(responseUser.updatedAt)).toEqual(mockUser.updatedAt);
// }
