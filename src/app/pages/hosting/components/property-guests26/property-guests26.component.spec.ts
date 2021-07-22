import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGuests26Component } from './property-guests26.component';

describe('PropertyGuests26Component', () => {
  let component: PropertyGuests26Component;
  let fixture: ComponentFixture<PropertyGuests26Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyGuests26Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyGuests26Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
