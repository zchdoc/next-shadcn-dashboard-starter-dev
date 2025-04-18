pnpm install
pnpm run dev

npm install -g tree-cli
npm install -g tree-cli
https://www.npmjs.com/package/tree-cli


注意 win需要使用 treee

treee -l 10 -o tree.txt --ignore "node_modules/,dist/,*.log,*.tmp,.git/,.github/,.husky/,.next/,,.vscode/"
treee -l 10 -o tree.txt --ignore "node_modules,dist,*.log,*.tmp,.git,.github,.husky,.next,,.vscode"
忽略文件
*.log
*.tmp
忽略文件夹
node_modules
dist
.git
.github
.husky
.next
.vscode