import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestRequirementModelComponent } from './guest-requirement-model.component';

describe('GuestRequirementModelComponent', () => {
  let component: GuestRequirementModelComponent;
  let fixture: ComponentFixture<GuestRequirementModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestRequirementModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestRequirementModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
