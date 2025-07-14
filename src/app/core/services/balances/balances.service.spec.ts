import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BalancesService } from './balances.service';

describe('BalancesService', () => {
  let service: BalancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BalancesService]
    });
    service = TestBed.inject(BalancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
