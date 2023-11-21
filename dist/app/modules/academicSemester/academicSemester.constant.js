"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_ACADEMIC_SEMESTER_DELETED = exports.EVENT_ACADEMIC_SEMESTER_UPDATED = exports.EVENT_ACADEMIC_SEMESTER_CREATED = exports.academicSemesterFilterableFields = exports.academicSemesterSearchableFields = exports.academicSemesterTitleCodeMapper = exports.academicSemesterMonths = exports.academicSemesterCodes = exports.academicSemesterTitles = void 0;
exports.academicSemesterTitles = [
    'Autumn',
    'Summer',
    'Fall',
];
exports.academicSemesterCodes = [
    '01',
    '02',
    '03',
];
exports.academicSemesterMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
exports.academicSemesterTitleCodeMapper = {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
};
exports.academicSemesterSearchableFields = ['title', 'code', 'year'];
exports.academicSemesterFilterableFields = [
    'searchTerm',
    'title',
    'code',
    'year',
    'syncId',
];
exports.EVENT_ACADEMIC_SEMESTER_CREATED = 'academic-semester.created';
exports.EVENT_ACADEMIC_SEMESTER_UPDATED = 'academic-semester.updated';
exports.EVENT_ACADEMIC_SEMESTER_DELETED = 'academic-semester.deleted';
