import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGuests25Component } from './property-guests25.component';

describe('PropertyGuests25Component', () => {
  let component: PropertyGuests25Component;
  let fixture: ComponentFixture<PropertyGuests25Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyGuests25Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyGuests25Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
