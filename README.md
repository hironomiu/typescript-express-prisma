# typescript-express-prisma

[
typescript-react-html-drag-and-drop](https://github.com/hironomiu/typescript-react-html-drag-and-drop) のサーバサイド

## Install Memo

### TypeScript

```
npm install -D typescript @types/node ts-node
```

### Packages

```
npm install express cors
```

```
npm install --save-dev @types/express @types/cors
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

```
npx prisma db pull
npx prisma generate
```

## Data Structure Memo

サーバサイド側を実装する際のデータ構造についてのメモ(users はユーザ単位で管理するためにとりあえず作成)

```
create database dnd;

drop table boards;
drop table todos;
drop table users;

create table users(
  id int unsigned not null auto_increment,
  nickname varchar(100) not null,
  email varchar(100) not null,
  primary key (id),
  unique key(email)
);

insert into users(nickname,email) values
('太郎','taro@example.com'),
('花子','hanako@example.com');

create table boards(
  id int unsigned not null auto_increment,
  user_id int unsigned not null,
  title varchar(100),
  primary key (id),
  constraint boards_fk_1 foreign key (user_id) references users (id)
);

insert into boards(user_id,title) values
(1,'todo'),
(1,'doing'),
(1,'done');

create table todos (
  id int unsigned not null auto_increment,
  user_id int unsigned not null,
  title varchar(100) not null,
  body text not null,
  board_id int unsigned not null,
  order_id int unsigned not null,
  primary key (id),
  unique key (board_id,order_id),
  constraint todos_fk_1 foreign key (board_id) references boards (id),
  constraint todos_fk_2 foreign key (user_id) references users (id)
);

insert into todos(user_id,title,body,board_id,order_id) values
(1,'title 1','body 1',1,1),
(1,'title 2','body 2',1,2),
(1,'title 3','body 3',1,3),
(1,'title 4','body 4',1,4);

```
