import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Lab } from '../../models/lab.model';

@Component({
  selector: 'app-manage-lab',
  templateUrl: './manage-lab.component.html',
  styleUrls: ['./manage-lab.component.css']
})
export class ManageLabComponent implements OnChanges {

  @Input() registeredLabs: Lab[] = [];
  @Output() labsSelected = new EventEmitter<Lab[]>();

  labs: Lab[] = [];
  selected = false;

  constructor() { }

  ngOnChanges(): void {
    this.labs = this.registeredLabs;
  }

  selectLab(index: number): void {
    this.labs[index].selected = !this.labs[index].selected;
    this.selected = this.labs.every(x => x.selected);
  }

  selectLabs(event: any): void {
    if (event.target.checked) {
      this.selected = true;
      this.labs.forEach(x => x.selected = true);
    } else {
      this.selected = false;
      this.labs.forEach(x => x.selected = false);
    }
  }

  removeClick(): void {
    this.selected = false;
    this.labs = this.labs.filter(x => !x.selected);
    this.labsSelected.emit(this.labs);
  }

  removeEnabled(): boolean {
    return this.labs.some(x => x.selected);
  }

  labsSelectedEmit(labs: Lab[]): void {
    for (const lab of labs) {
      if (this.labs.findIndex(x => x.id === lab.id) === -1) {
        lab.selected = false;
        this.labs.push(lab);
      }
    }
    this.selected = this.labs.every(x => x.selected);
    this.labsSelected.emit(this.labs);
  }

  reset(): void {
    this.labs = [];
  }
}
