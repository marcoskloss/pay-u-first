# puf-api
Api do projeto puf (pay you first) proposto pelo curso 'Desenvolvendo Software de Verdade' da [@codarme](https://codar.me/)

### Para fazer o setup do projeto
```bash
    git clone https://github.com/marcoskloss/puf-api.git
    cd puf-api
    yarn
    
    cp .env.example .env
    # preencha os dados do arquivo .env
    
    sudo docker-compose up -d # precisa do docker-compose instalado
    
    # generate a new prisma client
    yarn prisma generate

    yarn db:migrate

    yarn dev
```

### Rodando localmente
```bash
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

