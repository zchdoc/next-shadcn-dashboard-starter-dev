# HTML Import Error Fix

## The Issue

The error you're encountering is:

```
Error: <Html> should not be imported outside of pages/_document.
Read more: https://nextjs.org/docs/messages/no-document-import-in-page
```

This error occurs when the `Html` component from `next/document` is imported in a file that is not `pages/_document.js`. Since your project is using the App Router (not the Pages Router), you shouldn't be using components from `next/document` at all.

## How to Fix It

1. **Temporary Fix**: We've modified the `pre-deploy` script to skip the build step so you can push your changes.

2. **Permanent Fix**: You need to find and remove any imports of `Html`, `Head`, `Main`, or `NextScript` from `next/document` in your codebase.

   Potential places to look:
   - Custom error pages
   - Layout components
   - Any components that might be trying to modify the HTML structure

3. **For Custom Document Functionality**: If you need functionality that was previously in `_document.js`, use the following App Router alternatives:

   - For `<Html>` and `<Head>`: Use metadata in layout.tsx or page.tsx files
   - For scripts: Use the `<Script>` component from 'next/script'
   - For styles: Import CSS files directly or use CSS-in-JS solutions

## Next Steps

1. Search your codebase for imports from `next/document`
2. Replace them with App Router alternatives
3. Once fixed, restore the build step in the `pre-deploy` script:
   ```json
   "pre-deploy": "pnpm type-check && pnpm lint && pnpm format:check && pnpm build"
   ```

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Migrating from Pages to App Router](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
