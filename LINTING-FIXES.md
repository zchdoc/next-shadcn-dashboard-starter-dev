# Linting Fixes Guide

This document provides guidance on how to fix the linting warnings in the project.

## Unused Variables

Most of the warnings are about unused variables. Here are the ways to fix them:

1. **Remove the variable if it's not needed**

   ```typescript
   // Before
   const unusedVar = 'something';

   // After
   // Just remove the variable declaration
   ```

2. **Prefix with underscore to indicate it's intentionally unused**

   ```typescript
   // Before
   function Component({ unused, used }) {
     return <div>{used}</div>;
   }

   // After
   function Component({ _unused, used }) {
     return <div>{used}</div>;
   }
   ```

3. **Use object destructuring with rest operator to extract only what you need**

   ```typescript
   // Before
   function process(data) {
     const { id, name, age, address } = data;
     return `${id}: ${name}`;
   }

   // After
   function process(data) {
     const { id, name, ...rest } = data;
     return `${id}: ${name}`;
   }
   ```

## React Hooks Dependencies

For React hooks dependency warnings:

```typescript
// Before
useEffect(() => {
  fetchData();
}, [otherDependency]);

// After - Option 1: Include the missing dependency
useEffect(() => {
  fetchData();
}, [fetchData, otherDependency]);

// After - Option 2: If fetchData is defined inside the component and doesn't need to be recreated
// on every render, move it inside useEffect or use useCallback
useEffect(() => {
  const fetchData = async () => {
    // implementation
  };

  fetchData();
}, [otherDependency]);
```

## Specific Files to Fix

Here are the specific files and issues to fix:

1. `src/app/dashboard/product/page.tsx` - Line 7: Remove or prefix `serialize` with underscore
2. `src/components/layout/app-sidebar.tsx` - Line 67: Remove or prefix `_tenantId` with underscore
3. `src/components/ui/chart.tsx` - Line 12: Remove or prefix `key` with underscore
4. `src/features/auth/components/github-auth-button.tsx` - Line 9: Remove or prefix `callbackUrl` with underscore
5. `src/features/auth/components/user-auth-form.tsx` - Lines 28, 38: Remove or prefix unused variables
6. `src/features/products/components/product-form.tsx` - Line 77: Remove or prefix `values` with underscore
7. `src/features/profile/components/profile-create-form.tsx` - Multiple unused variables
8. `src/features/tools/exchange-rate/components/exchange-rate-chart.tsx` - Fix useEffect dependency
9. `src/features/tools/exchange-rate/components/exchange-rate-form.tsx` - Fix useEffect dependency
10. `src/features/tools/exchange-rate/utils/api-providers/alltick-api-provider.ts` - Remove or prefix `generateTraceId`
11. `src/types/data-table.ts` - Remove or prefix unused type parameters

## Running the Fix Script

You can run the following command to automatically fix some of these issues:

```bash
pnpm fix-warnings
```

This will run ESLint with the `--fix` flag, which can automatically fix some simple issues like unused variables.

## Gradually Improving Code Quality

Once you've fixed these warnings, you can switch back to using the strict linting in the pre-deploy script:

```json
"pre-deploy": "pnpm type-check && pnpm lint:strict && pnpm format:check && pnpm build"
```

This will ensure that no new warnings are introduced into the codebase.
