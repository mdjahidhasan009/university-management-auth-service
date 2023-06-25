import { IStudent, IStudentFilters } from './student.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { studentFilterableFields } from './student.constant';
import { SortOrder } from 'mongoose';
import { Student } from './student.model';
import ApiError from '../../../erros/ApiError';

const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IStudent[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: studentFilterableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.keys(filtersData).map(([key, value]) => ({
        [key]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Student.find(whereConditions)
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Student.countDocuments(whereConditions);

  return {
    data: result,
    meta: {
      total,
      limit,
      page,
    },
  };
};

const getSingleStudent = async (id: string): Promise<IStudent | null> => {
  const result = await Student.findById(id)
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
    .lean();
  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<IStudent>
): Promise<IStudent | null> => {
  const isExits = await Student.findOne({ id });
  if (!isExits) {
    throw new ApiError(404, 'Student not found');
  }

  const { name, guardian, localGuardian, ...studentData } = payload;
  const updatedStudentData: Partial<IStudent> = {
    ...studentData,
  };
  /* const name = {
    firstName: payload.firstName,
    middleName: payload.middleName,
    lastName: payload.lastName,
  }
  * */

  //dynamically update name => not all firstName, middleName, lastName only those which are present in payload
  if (name && Object.keys(name).length) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}`; //name.firstName or name.middleName or name.middleName or name.lastName
      (updatedStudentData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  if (guardian && Object.keys(guardian).length) {
    Object.keys(guardian).forEach(key => {
      const guardianKey = `guardian.${key}`;
      (updatedStudentData as any)[guardianKey] =
        guardian[key as keyof typeof guardian]; //updatedStudentData.guardian['guardianFirstName'] = guardian.guardianFirstName
    });
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    Object.keys(localGuardian).forEach(key => {
      const localGuardianKey = `localGuardian.${key}`;
      (guardian as any)[localGuardianKey] =
        localGuardian[key as keyof typeof localGuardian]; //updatedStudentData.localGuardian['guardianFirstName'] = localGuardian.guardianFirstName
    });
  }

  const result = await Student.findOneAndUpdate({ id }, updatedStudentData, {
    new: true,
  })
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
    .lean();
  return result;
};

const deleteStudent = async (id: string): Promise<IStudent | null> => {
  const result = await Student.findByIdAndDelete(id)
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
    .lean();
  return result;
};

export const StudentService = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
