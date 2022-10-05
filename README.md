# TFC

<img src="assets/tabela.png" />

# Contexto
Este projeto trata-se de um site informativo de partidas e classificações de futebol! :soccer:

## Técnologias usadas

Front-end:
> Desenvolvido pela Trybe!

Back-end:
> Desenvolvido usando: NodeJS, ExpressJS, MYSQL, TypeScript, Sequelize, sinon, mocha

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Mocha](https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)

## Para rodar a aplicação

- :warning: Necessário ter o [Docker](https://docs.docker.com/) instalado na máquina!!

```bash
git clone git@github.com:Vitosoaresp/trybe-futebol-club.git
cd trybe-futebol-club
npm run compose:up
``` 
- Front-end rodará em http://localhost:3000/

## Executando Testes

- Entre dentro do container 

  ```
    docker exec -it app_backend sh
  ```
  
- Para rodar os testes:
  ```
    npm run test
  ```
 
