
npm install -g tree-cli
https://www.npmjs.com/package/tree-cli

dir /o /b > tree.dir.txt
treee -l 10 -o tree.txt --ignore ".git,.github,.husky,.next,.vscode,node_modules,dist,*.log,*.tmp"


/s:参数,表示递归列出当前目录及其所有子目录中的内容(包括子文件夹中的文件).
/b:参数,表示以"裸格式"输出,仅显示文件的完整路径(不包含标题,摘要,文件大小等额外信息).每行只包含一个文件或文件夹的绝对路径.
/o 排序
    n - Alphabetically by name
    e - Alphabetically by extension
    g - Group directories first
    s - By size, smallest first
    d - By date/time, oldest first
    Use the - prefix to reverse the sort order
    dir /-o /b > DirTree.txt
