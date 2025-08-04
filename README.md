# Sistema de Reservas - FC4 TDD

Este é um sistema de reservas de propriedades inspirado em plataformas como Airbnb, desenvolvido com arquitetura limpa (Clean Architecture) e TDD.

## 🚀 Como executar o projeto localmente

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar a aplicação


#### Modo desenvolvimento (recomendado)
```bash
npm run dev
```

#### Modo produção
```bash
npm run build
npm start
```

### 3. Executar testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch
```

## 📋 Endpoints da API

A API estará disponível em `http://localhost:3000`

### Reservas
- `POST /bookings` - Criar uma nova reserva
- `POST /bookings/:id/cancel` - Cancelar uma reserva

### Propriedades
- `POST /properties` - Criar uma nova propriedade
- `GET /properties` - Listar todas as propriedades

### Usuários
- `POST /users` - Criar um novo usuário
- `GET /users` - Listar todos os usuários

## 📝 Exemplos de uso

### Criar uma propriedade
```bash
curl -X POST http://localhost:3000/properties \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Casa na Praia",
    "description": "Linda casa com vista para o mar",
    "maxGuests": 6,
    "basePricePerNight": 200
  }'
```

### Criar um usuário
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva"
  }'
```

### Criar uma reserva
```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "1",
    "guestId": "1",
    "startDate": "2024-12-20",
    "endDate": "2024-12-25",
    "numberOfGuests": 4
  }'
```

### Cancelar uma reserva
```bash
curl -X POST http://localhost:3000/bookings/1/cancel
```

## 🏗️ Arquitetura do Projeto

O projeto segue os princípios da Clean Architecture com as seguintes camadas:

- **Domain**: Entidades, regras de negócio e interfaces
- **Application**: Casos de uso e serviços de aplicação
- **Infrastructure**: Implementações concretas (banco de dados, web, etc.)
- **Shared**: Utilitários e componentes compartilhados

## 🧪 Testes

O projeto utiliza Jest para testes e segue a metodologia TDD (Test-Driven Development). Os testes estão organizados em:

- Testes unitários para entidades e serviços
- Testes de integração para repositórios
- Testes end-to-end para controllers

## 🛠️ Tecnologias utilizadas

- **TypeScript**: Linguagem principal
- **Express**: Framework web
- **TypeORM**: ORM para banco de dados
- **SQLite**: Banco de dados (para desenvolvimento)
- **Jest**: Framework de testes
- **Biome**: Linter e formatter

## 📊 Funcionalidades

### Sistema de Reservas
- Reservar propriedades para períodos específicos
- Validação de disponibilidade
- Cálculo automático de preços com desconto para 7+ noites
- Validação de capacidade máxima de hóspedes

### Sistema de Cancelamento
- Políticas de reembolso baseadas no tempo:
  - Mais de 7 dias: Reembolso total
  - 1-7 dias: Reembolso parcial (50%)
  - Menos de 1 dia: Sem reembolso

### Validações
- Disponibilidade da propriedade
- Capacidade máxima de hóspedes
- Datas válidas
- Usuário e propriedade existentes 