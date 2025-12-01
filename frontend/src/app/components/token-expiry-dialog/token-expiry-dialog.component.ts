import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-token-expiry-dialog',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule],
    template: `
    <p-dialog [(visible)]="visible" [modal]="true" [closable]="false" [style]="{width: '450px'}" styleClass="p-fluid">
      <ng-template pTemplate="header">
        <div class="flex align-items-center gap-2">
            <i class="pi pi-clock text-orange-500 text-2xl"></i>
            <span class="font-bold text-xl">Session Expiring</span>
        </div>
      </ng-template>
      <div class="py-4">
        <p class="m-0 text-lg">Your session has expired due to inactivity.</p>
        <p class="mt-2 text-600">Would you like to extend your session or logout?</p>
      </div>
      <ng-template pTemplate="footer">
        <div class="flex justify-content-end gap-2">
            <button pButton label="Logout" icon="pi pi-sign-out" class="p-button-outlined p-button-secondary" (click)="onLogout()"></button>
            <button pButton label="Continue Session" icon="pi pi-refresh" class="p-button-primary" (click)="onContinue()"></button>
        </div>
      </ng-template>
    </p-dialog>
  `,
    styles: []
})
export class TokenExpiryDialogComponent {
    visible = false;
    private resolvePromise: ((value: boolean) => void) | null = null;

    show(): Promise<boolean> {
        this.visible = true;
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
        });
    }

    onContinue() {
        this.visible = false;
        if (this.resolvePromise) {
            this.resolvePromise(true);
            this.resolvePromise = null;
        }
    }

    onLogout() {
        this.visible = false;
        if (this.resolvePromise) {
            this.resolvePromise(false);
            this.resolvePromise = null;
        }
    }
}
