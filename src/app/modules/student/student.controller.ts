import { Request, Response } from 'express';
import pick from '../../../shared/pick';
import { IStudent } from './student.interface';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import {
  studentFilterableFields,
  studentSearchableFields,
} from './student.constant';
import { StudentService } from './student.service';

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentFilterableFields);
  const paginationOptions = pick(req.query, studentSearchableFields);

  const result = await StudentService.getAllStudents(
    filters,
    paginationOptions
  );

  sendResponse<IStudent>(res, {
    statusCode: 200,
    success: true,
    message: 'Students fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.params.id;

  const result = await StudentService.getSingleStudent(studentId);
  sendResponse<IStudent>(res, {
    statusCode: 200,
    success: true,
    message: 'Student fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.params.id;
  const updatedData = req.body;

  const result = await StudentService.updateStudent(studentId, updatedData);

  sendResponse<IStudent>(res, {
    statusCode: 200,
    success: true,
    message: 'Student updated successfully',
    data: result.data,
  });
});

const deleteStudent = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.params.id;

  const result = await StudentService.deleteStudent(studentId);

  sendResponse<IStudent>(res, {
    statusCode: 200,
    success: true,
    message: 'Student deleted successfully',
    data: result.data,
  });
});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
