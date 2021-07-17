import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLabComponent } from './search-lab.component';

describe('SearchLabComponent', () => {
  let component: SearchLabComponent;
  let fixture: ComponentFixture<SearchLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchLabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
