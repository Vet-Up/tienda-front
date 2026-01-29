import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CNotFound } from './c-not-found';

describe('CNotFound', () => {
  let component: CNotFound;
  let fixture: ComponentFixture<CNotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CNotFound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CNotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
