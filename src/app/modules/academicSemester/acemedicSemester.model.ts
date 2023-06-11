import { Schema, model } from 'mongoose';
import httpStatus from 'http-status';

import {
  AcademicSemesterModel,
  IAcademicSemester,
} from './academicSemester.interface';

import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from './academicSemester.constant';
import ApiError from '../../../erros/ApiError';

const academicSemesterSchema = new Schema<IAcademicSemester>({
  title: {
    type: String,
    required: true,
    enum: academicSemesterTitles,
  },
  year: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
    enum: academicSemesterCodes,
  },
  startMonth: {
    type: String,
    required: true,
    enum: academicSemesterMonths,
  },
  endMonth: {
    type: String,
    required: true,
    enum: academicSemesterMonths,
  },
});

academicSemesterSchema.pre('save', async function (next) {
  const isExits = await AcademicSemester.findOne({
    title: this.title,
    year: this.year,
  });
  if (isExits) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Academic semester is already exits'
    );
  }
  next();
});

export const AcademicSemester = model<IAcademicSemester, AcademicSemesterModel>(
  'AcademicSemester',
  academicSemesterSchema
);
