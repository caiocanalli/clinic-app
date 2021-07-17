import { ExamResponse } from './exam-response.model';

export class FilterResponse {
  exams: ExamResponse[] = [];
  currentPage = 0;
  pageCount = 0;
  pageSize = 0;
  totalSize = 0;
}
