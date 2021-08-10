import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleReasonModelComponent } from './rule-reason-model.component';

describe('RuleReasonModelComponent', () => {
  let component: RuleReasonModelComponent;
  let fixture: ComponentFixture<RuleReasonModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuleReasonModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleReasonModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
