import { Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';

interface HomeItem {
  img: string;
  title?: string;
  name?: string;
  caption?: string;
}

@Component({
  selector: 'app-lenskart-home-card',
  template: `
    <div class="mb-2 cursor-pointer bg-gray-100 p-4 w-full">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-11/12 mx-auto">
        <div *ngFor="let item of items" class="border border-white flex flex-col border-rounded bg-white p-1 pb-2.5">
          <div class="flex justify-center">
            <img [src]="item.img" [alt]="item.title || item.name" class="w-full" />
          </div>
          <div class="flex justify-center">
            <p class="text-gray-500 text-base font-medium p-1">{{ item.title }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA]
})
export class LenskartHomeCardComponent {
  @Input() items: HomeItem[] = [];
}
