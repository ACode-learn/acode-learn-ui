import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog as PrimeConfirmDialog } from 'primeng/confirmdialog';

interface ConfirmOptions {
  readonly message: string;
  readonly header?: string;
  readonly accept?: () => void;
  readonly reject?: () => void;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [PrimeConfirmDialog],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  private readonly confirmationService = inject(ConfirmationService);

  confirm(options: ConfirmOptions): void {
    this.confirmationService.confirm({
      message: options.message,
      header: options.header ?? 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => options.accept?.(),
      reject: () => options.reject?.(),
    });
  }
}
