import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialsComponent } from './tutorials.component';

describe('TutorialsComponent', () => {
  let component: TutorialsComponent;
  let fixture: ComponentFixture<TutorialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TutorialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter tutorials by category', () => {
    component.filterCategory = 'Configuración';
    component.filterTutorials();
    
    const configTutorials = component.filteredTutorials.filter(t => t.category === 'Configuración');
    expect(component.filteredTutorials.length).toBe(configTutorials.length);
  });

  it('should filter tutorials by search term', () => {
    component.searchTerm = 'bot';
    component.filterTutorials();
    
    const tutorialsWithBot = component.filteredTutorials.filter(t => 
      t.title.toLowerCase().includes('bot') || 
      t.description.toLowerCase().includes('bot')
    );
    expect(component.filteredTutorials.length).toBe(tutorialsWithBot.length);
  });

  it('should mark tutorial as completed', () => {
    const tutorialId = 1;
    component.markAsCompleted(tutorialId);
    
    const tutorial = component.tutorials.find(t => t.id === tutorialId);
    expect(tutorial?.completed).toBeTruthy();
  });

  it('should open tutorial modal', () => {
    const tutorial = component.tutorials[0];
    component.openTutorial(tutorial);
    
    expect(component.selectedTutorial).toBe(tutorial);
    expect(component.showModal).toBeTruthy();
  });

  it('should close tutorial modal', () => {
    component.selectedTutorial = component.tutorials[0];
    component.showModal = true;
    
    component.closeTutorial();
    
    expect(component.selectedTutorial).toBeNull();
    expect(component.showModal).toBeFalsy();
  });
}); 