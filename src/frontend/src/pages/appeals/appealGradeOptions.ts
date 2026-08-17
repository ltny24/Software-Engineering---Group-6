export interface AppealGradeOption {
  gradeId: number;
  courseCode: string;
  courseName: string;
  currentGrade: string;
  term: string;
  isFinalized?: boolean;
  isEligibleForAppeal?: boolean;
}

const DEFAULT_GRADE_OPTIONS: AppealGradeOption[] = [
  {
    gradeId: 1,
    courseCode: 'CSC10009',
    courseName: 'Computer Systems',
    currentGrade: '7.5',
    term: '2024-2025-HK2',
    isFinalized: true,
    isEligibleForAppeal: true,
  },
  {
    gradeId: 2,
    courseCode: 'CSC10004',
    courseName: 'Data Structures',
    currentGrade: '4.5',
    term: '2024-2025-HK2',
    isFinalized: true,
    isEligibleForAppeal: true,
  },
  {
    gradeId: 3,
    courseCode: 'CSC10006',
    courseName: 'Database Systems',
    currentGrade: '7.0',
    term: '2024-2025-HK2',
    isFinalized: true,
    isEligibleForAppeal: true,
  },
];

const GRADE_OPTIONS_BY_STUDENT: Record<string, AppealGradeOption[]> = {
  '1': DEFAULT_GRADE_OPTIONS,
  '24120001': DEFAULT_GRADE_OPTIONS,
  '2': [
    {
      gradeId: 7,
      courseCode: 'CSC10004',
      courseName: 'Data Structures',
      currentGrade: '6.0',
      term: '2024-2025-HK1',
    },
    {
      gradeId: 9,
      courseCode: 'CSC10006',
      courseName: 'Database Systems',
      currentGrade: '8.5',
      term: '2024-2025-HK3',
    },
  ],
  '24120002': [
    {
      gradeId: 7,
      courseCode: 'CSC10004',
      courseName: 'Data Structures',
      currentGrade: '6.0',
      term: '2024-2025-HK1',
    },
    {
      gradeId: 9,
      courseCode: 'CSC10006',
      courseName: 'Database Systems',
      currentGrade: '8.5',
      term: '2024-2025-HK3',
    },
  ],
};

export function getAppealGradeOptions(
  userIdentifier?: string | number | null
): AppealGradeOption[] {
  if (userIdentifier === null || userIdentifier === undefined || userIdentifier === '') {
    return DEFAULT_GRADE_OPTIONS;
  }

  const key = String(userIdentifier);
  return GRADE_OPTIONS_BY_STUDENT[key] ?? DEFAULT_GRADE_OPTIONS;
}
