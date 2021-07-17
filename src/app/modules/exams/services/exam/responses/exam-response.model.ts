import { Lab } from './lab.model';

export class ExamResponse {
  id = 0;
  name = '';
  type = 0;
  status = 0;
  labs: Lab[] = [];
}
