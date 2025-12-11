pnpm install
pnpm run dev

pnpm install && pnpm run dev

pnpm run format
pnpm run pre-commit
pnpm run pre-deploy

pnpm run format && pnpm run pre-deploy

pnpm run format && pnpm run pre-commit && pnpm run pre-deploy

pnpm install && pnpm run format && pnpm run pre-commit && pnpm run pre-deploy

rm -f -r .next node_modules
rm -f -r .next node_modules && pnpm install && pnpm run dev

请不要执行 run,build 等命令,可以执行 install 等命令,如果一定要执行请告诉我,执行哪个命令我来一步一步执行
本项目使用 pnpm
/dashboard/bookmark/zch
http://localhost:3000/dashboard/bookmark/zch
