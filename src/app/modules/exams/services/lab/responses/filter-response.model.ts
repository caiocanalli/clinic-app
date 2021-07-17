import { Lab } from './lab.model';

export class FilterResponse {
    labs: Lab[] = [];
    currentPage = 0;
    pageCount = 0;
    pageSize = 0;
    totalSize = 0;
}
