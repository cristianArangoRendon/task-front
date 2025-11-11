import Swal from 'sweetalert2';

export class NotificationsService {

  constructor() {}

  private openToastSwal(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info') {
    const iconColors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#64b5f6'
    };

    const iconGradients = {
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      info: 'linear-gradient(135deg, #64b5f6 0%, #3f51b5 100%)'
    };

    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      position: 'top-end',
      timer: 4000,
      toast: true,
      showConfirmButton: false,
      showCloseButton: true,
      timerProgressBar: true,
      customClass: {
        popup: 'tagus-toast-popup',
        title: 'tagus-toast-title',
        htmlContainer: 'tagus-toast-text',
        timerProgressBar: 'tagus-toast-progress',
        closeButton: 'tagus-toast-close',
        icon: 'tagus-toast-icon'
      },
      didOpen: (toast) => {
        // Animación de entrada
        toast.style.animation = 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Aplicar color del icono según el tipo
        const iconElement = toast.querySelector('.swal2-icon') as HTMLElement;
        if (iconElement) {
          iconElement.style.borderColor = iconColors[icon];
          iconElement.style.color = iconColors[icon];
        }

        // Efecto hover para pausar el timer
        toast.addEventListener('mouseenter', () => {
          Swal.stopTimer();
        });
        toast.addEventListener('mouseleave', () => {
          Swal.resumeTimer();
        });
      },
      willClose: (toast) => {
        // Animación de salida
        toast.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });
  }

  private openSwal(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info') {
    const iconColors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#64b5f6'
    };

    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      position: 'center',
      showConfirmButton: true,
      confirmButtonText: 'Entendido',
      showCloseButton: true,
      customClass: {
        popup: 'tagus-modal-popup',
        title: 'tagus-modal-title',
        htmlContainer: 'tagus-modal-text',
        confirmButton: 'tagus-modal-confirm',
        closeButton: 'tagus-modal-close',
        icon: 'tagus-modal-icon'
      },
      didOpen: (modal) => {
        // Animación de entrada
        modal.style.animation = 'zoomIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Aplicar color del icono según el tipo
        const iconElement = modal.querySelector('.swal2-icon') as HTMLElement;
        if (iconElement) {
          iconElement.style.borderColor = iconColors[icon];
          iconElement.style.color = iconColors[icon];
        }
      }
    });
  }

  showToastErrorMessage(message: string) {
    this.openToastSwal('Error', message, 'error');
  }

  showToastSuccessMessage(message: string) {
    this.openToastSwal('Éxito', message, 'success');
  }

  showToastInfoMessage(message: string) {
    this.openToastSwal('Información', message, 'info');
  }

  showToastWarningMessage(message: string) {
    this.openToastSwal('Advertencia', message, 'warning');
  }

  showErrorMessage(message: string) {
    this.openSwal('Error', message, 'error');
  }

  showSuccessMessage(message: string) {
    this.openSwal('Éxito', message, 'success');
  }

  showInfoMessage(message: string) {
    this.openSwal('Información', message, 'info');
  }

  showWarningMessage(message: string) {
    this.openSwal('Advertencia', message, 'warning');
  }

  // Método especial para confirmaciones
  async showConfirmation(
    title: string, 
    text: string, 
    confirmButtonText: string = 'Confirmar',
    cancelButtonText: string = 'Cancelar'
  ): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      position: 'center',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      reverseButtons: true,
      customClass: {
        popup: 'tagus-modal-popup tagus-confirm-popup',
        title: 'tagus-modal-title',
        htmlContainer: 'tagus-modal-text',
        confirmButton: 'tagus-modal-confirm tagus-confirm-btn',
        cancelButton: 'tagus-modal-cancel',
        closeButton: 'tagus-modal-close',
        icon: 'tagus-modal-icon'
      },
      didOpen: (modal) => {
        modal.style.animation = 'zoomIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });

    return result.isConfirmed;
  }

  // Método para notificaciones de carga
  showLoading(message: string = 'Procesando...') {
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      customClass: {
        popup: 'tagus-modal-popup tagus-loading-popup',
        title: 'tagus-modal-title'
      },
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  hideLoading() {
    Swal.close();
  }
}
