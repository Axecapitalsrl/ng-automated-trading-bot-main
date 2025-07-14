import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [CommonModule, AngularSvgIconModule],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.css',
})

export class TutorialsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tutorials = [
    {
      id: 1,
      title: 'Introducción Completa a la Plataforma',
      description: 'Aprende todos los aspectos básicos de la plataforma de trading automatizado.',
      duration: '15 min',
      difficulty: 'Básico',
      completed: false,
      category: 'Introducción',
      videoUrl: 'https://www.youtube.com/watch?v=uCN_6cR64Us',
      embedUrl: 'https://www.youtube.com/embed/uCN_6cR64Us'
    },
    {
      id: 2,
      title: 'Configuración API y Bot Orden Limit Bitget',
      description: 'Guía paso a paso para configurar las API keys y crear bots en Bitget.',
      duration: '12 min',
      difficulty: 'Básico',
      completed: false,
      category: 'Configuración',
      videoUrl: 'https://youtu.be/BVt5-1j-N5M',
      embedUrl: 'https://www.youtube.com/embed/BVt5-1j-N5M',
      specialMessage: {
        title: 'Crear cuenta en Bitget',
        content: 'Para crearse una cuenta en Bitget accede a través de este link https://partner.bitget.com/bg/AGS5SY (Recorda que para utilizar este exchange es un requisito primordial ya que nuestro bot está linkeado a este enlace)',
        link: 'https://partner.bitget.com/bg/AGS5SY',
        linkText: 'Crear cuenta en Bitget'
      }
    },
    {
      id: 3,
      title: 'Configuración API y Bot Orden Limit Binance',
      description: 'Tutorial completo para configurar Binance API y crear bots de orden límite.',
      duration: '10 min',
      difficulty: 'Básico',
      completed: false,
      category: 'Configuración',
      videoUrl: 'https://www.youtube.com/watch?v=UKOOveo73IQ',
      embedUrl: 'https://www.youtube.com/embed/UKOOveo73IQ'
    },
    {
      id: 4,
      title: 'Comisiones Spot-BNB',
      description: 'Entiende cómo funcionan las comisiones en Binance y cómo optimizarlas.',
      duration: '8 min',
      difficulty: 'Intermedio',
      completed: false,
      category: 'Gestión de Costos',
      videoUrl: 'https://www.youtube.com/watch?v=0V81Q_4yoMo',
      embedUrl: 'https://www.youtube.com/embed/0V81Q_4yoMo'
    },
    {
      id: 5,
      title: 'Cómo Transferir Cripto de Exchange a Exchange',
      description: 'Tutorial para transferir criptomonedas entre diferentes exchanges de forma segura.',
      duration: '7 min',
      difficulty: 'Intermedio',
      completed: false,
      category: 'Transferencias',
      videoUrl: 'https://www.youtube.com/watch?v=aX0V2CE8fCI',
      embedUrl: 'https://www.youtube.com/embed/aX0V2CE8fCI'
    },
    {
      id: 6,
      title: 'Remanentes Arbitraje OL',
      description: 'Aprende a gestionar los remanentes en operaciones de arbitraje triangular.',
      duration: '9 min',
      difficulty: 'Avanzado',
      completed: false,
      category: 'Arbitraje',
      videoUrl: 'https://www.youtube.com/watch?v=V54lv7nHsKE',
      embedUrl: 'https://www.youtube.com/embed/V54lv7nHsKE'
    },
    {
      id: 7,
      title: 'Nuevo Tutorial',
      description: 'Nuevo tutorial de trading automatizado.',
      duration: '10 min',
      difficulty: 'Básico',
      completed: false,
      category: 'Introducción',
      videoUrl: 'https://www.youtube.com/watch?v=paP8hSSY20k',
      embedUrl: 'https://www.youtube.com/embed/paP8hSSY20k'
    }
  ];

  selectedTutorial: any = null;
  showModal = false;
  filterCategory = '';
  searchTerm = '';

  filteredTutorials: any[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.filteredTutorials = this.tutorials;
  }

  filterTutorials() {
    this.filteredTutorials = this.tutorials.filter(tutorial => {
      const matchesCategory = !this.filterCategory || tutorial.category === this.filterCategory;
      const matchesSearch = !this.searchTerm || 
        tutorial.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }

  onCategoryChange(event: any) {
    this.filterCategory = event.target.value;
    this.filterTutorials();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.filterTutorials();
  }

  openTutorial(tutorial: any) {
    console.log('Opening tutorial:', tutorial);
    this.selectedTutorial = tutorial;
    this.showModal = true;
    console.log('Modal should be open now. showModal:', this.showModal);
  }

  closeTutorial() {
    console.log('Closing tutorial');
    this.showModal = false;
    this.selectedTutorial = null;
  }

  markAsCompleted(tutorialId: number) {
    console.log('Marking tutorial as completed:', tutorialId);
    const tutorial = this.tutorials.find(t => t.id === tutorialId);
    if (tutorial) {
      tutorial.completed = true;
      console.log('Tutorial marked as completed:', tutorial);
    }
  }

  onTutorialClick(event: Event, tutorial: any) {
    event.stopPropagation();
    console.log('Tutorial card clicked:', tutorial);
    this.openTutorial(tutorial);
  }

  onMarkCompletedClick(event: Event, tutorialId: number) {
    event.stopPropagation();
    console.log('Mark completed clicked:', tutorialId);
    this.markAsCompleted(tutorialId);
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Básico':
        return 'text-green-500';
      case 'Intermedio':
        return 'text-yellow-500';
      case 'Avanzado':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }

  getCategories(): string[] {
    return [...new Set(this.tutorials.map(t => t.category))];
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 