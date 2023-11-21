"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_FACULTY_UPDATED = exports.facultySearchableFields = exports.facultyFilterableFields = void 0;
exports.facultyFilterableFields = [
    'searchTerm',
    'id',
    'gender',
    'bloodGroup',
    'email',
    'contactNo',
    'emergencyContactNo',
    'academicFaculty',
    'academicDepartment',
    'designation',
];
exports.facultySearchableFields = [
    'email',
    'contactNo',
    'emergencyContactNo',
    'name.firstName',
    'name.lastName',
    'name.middleName',
];
exports.EVENT_FACULTY_UPDATED = 'faculty.updated';
