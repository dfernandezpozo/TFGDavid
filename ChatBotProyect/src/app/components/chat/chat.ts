import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messages: Message[] = [
    {
      id: '1',
      text: '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date()
    }
  ];
  
  userInput: string = '';
  isTyping: boolean = false;
  private shouldScrollToBottom = false;

  // Opciones de fondos disponibles
  backgrounds = [
    { value: 'gradient-corporate', label: 'Gradiente Corporativo' },
    { value: 'gradient-tech', label: 'Tech Moderno' },
    { value: 'geometric', label: 'Patrón Geométrico' },
    { value: 'mesh', label: 'Mesh Gradient' },
    { value: 'dark-premium', label: 'Oscuro Premium' },
    { value: 'glass', label: 'Glassmorphism' },
    { value: 'minimal', label: 'Minimal Clean' },
    { value: 'animated', label: 'Gradiente Animado' },
    { value: 'corporate-blue', label: 'Corporate Blue' },
    { value: 'dots', label: 'Dots Pattern' }
  ];

  selectedBackground: string = 'gradient-corporate';

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isTyping) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: this.generateId(),
      text: this.userInput.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.userInput = '';
    this.shouldScrollToBottom = true;

    // Simular respuesta del bot
    this.isTyping = true;
    setTimeout(() => {
      const botMessage: Message = {
        id: this.generateId(),
        text: this.getBotResponse(userMessage.text),
        sender: 'bot',
        timestamp: new Date()
      };
      this.messages.push(botMessage);
      this.isTyping = false;
      this.shouldScrollToBottom = true;
    }, 1500 + Math.random() * 1000);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  changeBackground(background: string): void {
    this.selectedBackground = background;
  }

  getBackgroundClass(): string {
    return `background-${this.selectedBackground}`;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  private getBotResponse(userMessage: string): string {
    const responses = [
      'Entiendo tu consulta. Déjame ayudarte con eso.',
      'Esa es una excelente pregunta. Te explico...',
      '¡Claro! Puedo ayudarte con eso.',
      'Déjame verificar esa información para ti.',
      'Perfecto, aquí está la información que necesitas.',
      'Gracias por tu mensaje. Te respondo enseguida.',
      'Interesante punto. Aquí está mi perspectiva...',
      'Con gusto te ayudo. Mira esto...',
      '¡Excelente! Déjame buscar esa información.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
