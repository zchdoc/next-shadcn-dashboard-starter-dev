# Contributing Guide

## Development Workflow

This project uses several tools to ensure code quality and consistency:

### Pre-commit Hooks

When you commit code, the following checks are automatically run:

- **ESLint**: Checks for code quality issues in JavaScript/TypeScript files
- **Prettier**: Formats code according to project style rules
- **TypeScript**: Verifies type correctness

These checks are enforced using Husky and lint-staged, which run on the files you're committing.

### Pre-push Hooks

When you push code to the repository, more comprehensive checks are run:

- **Type Checking**: Full TypeScript type checking across the entire project
- **Linting**: Strict linting with zero warnings allowed
- **Format Checking**: Verifies all files are properly formatted
- **Build**: Ensures the project builds successfully

### Running Checks Manually

You can also run these checks manually:

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:strict  # Zero warnings allowed
pnpm lint:fix     # Fix automatically fixable issues
pnpm fix-warnings # Fix ESLint warnings across the project

# Formatting
pnpm format       # Format all files
pnpm format:check # Check if files are formatted correctly

# Pre-deploy checks (runs all checks + build)
pnpm pre-deploy
```

## Common Issues and Solutions

### TypeScript Errors

If you encounter TypeScript errors like:

```
TS2746: This JSX tag's children prop expects a single child of type ReactElement<unknown, string | JSXElementConstructor<any>>, but multiple children were provided.
```

Make sure you're wrapping multiple children in a fragment or parent element:

```tsx
// Incorrect
return (
  <Component>
    <Child1 />
    <Child2 />
  </Component>
);

// Correct
return (
  <Component>
    <>
      <Child1 />
      <Child2 />
    </>
  </Component>
);
```

### ESLint Warnings

If you're getting ESLint warnings, you can run `pnpm fix-warnings` to automatically fix many common issues. For more detailed guidance on fixing specific warnings, see the `LINTING-FIXES.md` file.

### Prettier Formatting

To ensure your code is properly formatted, run `pnpm format` before committing.
