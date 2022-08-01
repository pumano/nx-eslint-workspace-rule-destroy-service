import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DestroyService } from '@nx-eslint-workspace-rule-destroy-service/utils';

  @Component({
     // eslint-disable-next-line @angular-eslint/component-selector
     selector: 'app-feature-lib',
     template: '<h1>Hello World</h1>',
     changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class ButtonComponent {

     constructor(private destroy$: DestroyService) {
     }

  }
