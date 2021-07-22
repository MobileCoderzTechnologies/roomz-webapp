import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliablityComponent } from './avaliablity.component';

describe('AvaliablityComponent', () => {
  let component: AvaliablityComponent;
  let fixture: ComponentFixture<AvaliablityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvaliablityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvaliablityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
