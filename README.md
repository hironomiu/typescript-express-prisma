# typescript-express-prisma

## Install Memo

### TypeScript

```
npm install -D typescript @types/node ts-node
```

### Packages

```
npm install express
```

```
npm install --save-dev @types/express
```

### nodemon

```
npm install --save-dev nodemon
```

`nodemon.json`

```
{
    "watch": [
        "src"
    ],
    "ext": "ts",
    "exec": "ts-node ./src/index.ts"
}
```

### TypeScript Initialize

```
npx tsc --init
```

### Prisma

[公式:Relational databases(MySQL)](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-mysql)

[公式:Install Prisma Client](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/install-prisma-client-typescript-mysql)
