/**
 * This file sets you up with with structure needed for an ESLint rule.
 *
 * It leverages utilities from @typescript-eslint to allow TypeScript to
 * provide autocompletions etc for the configuration.
 *
 * Your rule's custom logic will live within the create() method below
 * and you can learn more about writing ESLint rules on the official guide:
 *
 * https://eslint.org/docs/developer-guide/working-with-rules
 *
 * You can also view many examples of existing rules here:
 *
 * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/rules
 */

 import { ESLintUtils } from '@typescript-eslint/experimental-utils';
 import { ANGULAR_CLASS_DECORATOR_COMPONENT_DIRECTIVE } from '../utils/selectors';
 import { TSESTree } from '@typescript-eslint/experimental-utils';
 import * as utils from '../utils/utils';

 // NOTE: The rule will be available in ESLint configs as "@nrwl/nx/workspace/no-destroy-without-provider"
 export const RULE_NAME = 'no-destroy-without-provider';

 export const rule = ESLintUtils.RuleCreator(() => __filename)({
   name: RULE_NAME,
   meta: {
     type: 'problem',
     docs: {
       description: `use DestroyService without directly provided DestroyService inside component / directive / etc`,
       recommended: 'error',
     },
     schema: [],
     messages: {
       destroyServiceProviderRequired: 'The component / directive / etc providers section should contain DestroyService, when DestroyService injected in constructor.'
     },
   },
   defaultOptions: [],
   create(context) {
     return {
       [ANGULAR_CLASS_DECORATOR_COMPONENT_DIRECTIVE](node: TSESTree.Decorator) {
         const classDeclaration: TSESTree.ClassDeclaration = utils.getClassDeclarationFromDecorator(node);
         const constructor: TSESTree.MethodDefinition = utils.getConstructorFromClassDeclaration(classDeclaration);
         const providersExpressions: TSESTree.ArrayExpression = utils.getDecoratorPropertyValueArrayExpression(node, 'providers');

         if (!constructor) {
           return;
         }

         const parameters: Array<TSESTree.TSParameterProperty> = utils.getParameterPropertiesFromMethodDefinition(constructor);
         if (!Array.isArray(parameters) || parameters.length === 0) {
           return;
         }


         parameters.forEach(parameter => resolveParameter(parameter, context, providersExpressions));

       }
     };
   },
 });


 function resolveParameter(parameter: TSESTree.TSParameterProperty, context, providersExpressions: TSESTree.ArrayExpression): void {
   const typeReference = utils.getMethodParameterType(parameter);
   const typeReferenceName = utils.getMethodParameterTypeName(typeReference);


   if (typeReferenceName !== 'DestroyService') {
     return;
   }

   const providersWithDestroyService = providersExpressions && Array.isArray(providersExpressions.elements) && providersExpressions.elements.length > 0 ?
     utils.getIdentifierFromArrayExpression(providersExpressions, 'DestroyService')
     : null;

   if (providersWithDestroyService) {
       return;
   }

   context.report({
     messageId: 'destroyServiceProviderRequired',
     loc: parameter.loc,
     /*
     TODO: fixer
     */
   });

 }
