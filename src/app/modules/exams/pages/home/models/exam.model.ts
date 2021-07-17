import { Lab } from './lab.model';

export class Exam {
  id = 0;
  name = '';
  type = 0;
  typeLabel = '';
  status = 0;
  statusLabel = '';
  labs: Lab[] = [];
  selected = false;
}
