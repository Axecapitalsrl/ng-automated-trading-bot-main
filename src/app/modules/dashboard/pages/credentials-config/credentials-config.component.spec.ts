import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialsConfigComponent } from './credentials-config.component';

describe('CredentialsConfigComponent', () => {
  let component: CredentialsConfigComponent;
  let fixture: ComponentFixture<CredentialsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialsConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredentialsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
