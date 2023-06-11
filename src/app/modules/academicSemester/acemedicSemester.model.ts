import {
  AcademicSemesterModel,
  IAcademicSemester,
} from './academicSemester.interface';

import { Schema, model } from 'mongoose';
import {
  academicSemesterMonths,
  academicSemesterTitles,
} from './academicSemester.constant';

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
    enum: ['01', '02', '03'],
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

export const AcademicSemester = model<IAcademicSemester, AcademicSemesterModel>(
  'AcademicSemester',
  academicSemesterSchema
);
