# puf-api
Api do projeto puf (pay you first) proposto pelo curso 'Desenvolvendo Software de Verdade' da [@codarme](https://codar.me/)

### Para rodar o projeto na sua máquina
```bash
    git clone https://github.com/marcoskloss/puf-api.git
    cd puf-api
    yarn
    
    mv .env.example .env
    # preencha os dados do arquivo .env
    
    docker-compose up -d # precisa do docker-compose instalado
    
    yarn db:migrte
    
    yarn dev
```

### Para rodar os testes
```bash
    yarn test
```

#### 🛠️ Ferramentas
- Javascript
- NodeJS
- [Koa](https://koajs.com/)
- [Docker](https://www.docker.com/)
- [Prisma](https://www.prisma.io/)
- [Jest](https://jestjs.io/pt-BR/)

