pnpm install
pnpm run dev

pnpm install && pnpm run dev

pnpm run format
pnpm run pre-commit
pnpm run pre-deploy

pnpm run format && pnpm run pre-deploy

rm

rm -f -r .next node_modules

rm -f -r .next node_modules && pnpm install && pnpm run dev