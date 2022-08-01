import { TSESLint } from '@typescript-eslint/experimental-utils';
import { rule, RULE_NAME } from './no-destroy-without-provider';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

const messageId = 'destroyServiceProviderRequired';

const invalidStatements = [
  `
  import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

      @Component({
         selector: 'app-root',
         template: '<h1>Hello World</h1>',
         changeDetection: ChangeDetectionStrategy.OnPush,
      })
      export class ButtonComponent implements OnInit {

         constructor(private destroyService: DestroyService) {
         }

         ngOnInit() {

         }
      }
    `,
    `
    import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

        @Component({
           selector: 'app-root',
           template: '<h1>Hello World</h1>',
           changeDetection: ChangeDetectionStrategy.OnPush,
           providers: [SomeService],
        })
        export class ButtonComponent implements OnInit {

           constructor(private destroyService: DestroyService) {
           }

           ngOnInit() {

           }
        }
    `,
    `
    import { ChangeDetectionStrategy, Directive } from '@angular/core';

    @Directive({
       selector: 'app-root',
       providers: []
    })
    export class ButtonDirective {

       constructor(private destroy$: DestroyService) {
       }
    }`
]

ruleTester.run(RULE_NAME, rule, {
  valid: [`
  import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

  @Component({
     selector: 'app-root',
     template: '<h1>Hello World</h1>',
     changeDetection: ChangeDetectionStrategy.OnPush,
     providers: [DestroyService]
  })
  export class ButtonComponent implements OnInit {

     constructor(private destroy$: DestroyService) {
     }

     ngOnInit() {

     }
  }`,
  `
  import { ChangeDetectionStrategy, Directive } from '@angular/core';

  @Directive({
     selector: 'app-root',
     providers: [DestroyService]
  })
  export class ButtonDirective {

     constructor(private destroy$: DestroyService) {
     }
  }`],
  invalid: [
    { code: invalidStatements[0], errors: [{ messageId }] },
    { code: invalidStatements[1], errors: [{ messageId }] },
    { code: invalidStatements[2], errors: [{ messageId }] },
  ],
});
