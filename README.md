# Processo Seletivo SEPLAG/MT - Edital nº 001/2026

**Cargo:** Analista de TI - Perfil Engenheiro da Computação (Sênior)  
**Candidato:** Davi da Cunha Aguiar  
**Repositório:** davi-cunha-aguiar-064019  

---

## 🏗️ Arquitetura e Decisões Técnicas

Este projeto é uma SPA (Single Page Application) em **React**, com foco em organização, manutenibilidade e boas práticas de engenharia para um contexto de avaliação de nível Sênior.

### 1) Padrão Facade (Arquitetura em Camadas)

A aplicação utiliza o **Padrão Facade** para reduzir acoplamento e gerenciar a complexidade das interações entre a UI e as camadas de dados.

- **UI Layer:** Componentes React focados na renderização e interação do usuário.
- **Facade Layer:** Ponto único de acesso que coordena chamadas aos serviços de API e atualização do estado global.
- **Service Layer:** Responsável pelas requisições HTTP (ex.: Axios) para os endpoints de **Pets** e **Tutores**.

### 2) Gestão de Estado com RxJS (BehaviorSubject)

O estado global da aplicação (ex.: lista de pets e autenticação) é gerenciado via **BehaviorSubject** do RxJS.

- Permite reatividade com múltiplos componentes assinando mudanças de estado.
- Ajuda a manter lógica assíncrona mais complexa fora do ciclo de vida dos componentes.

### 3) Containerização e Infraestrutura

A aplicação foi empacotada utilizando **Multi-stage Docker build**:

- **Build Stage:** Node.js 20 para compilar o TypeScript e gerar o bundle de produção.
- **Production Stage:** Nginx para servir os arquivos estáticos com baixo consumo de recursos.
- **Observabilidade:** Health checks (Liveness/Readiness) para monitoramento do container.

### 4) Performance e UX

- **Lazy Loading:** Rotas/módulos de "Pets" e "Tutores" carregados sob demanda para reduzir o tempo de carregamento inicial.
- **Tailwind CSS:** Layout responsivo e manutenção facilitada.
- **TypeScript:** Tipagem estrita para melhorar manutenibilidade e reduzir erros em runtime.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Docker instalado

## 🐳 Docker (Multi-stage) e Deploy

A aplicação é empacotada com **Docker multi-stage**:

- **Build Stage:** `node:20-alpine` instala dependências e executa `npm run build`.
- **Runtime Stage:** `nginx:stable-alpine` serve os arquivos estáticos gerados em `/app/dist`.

O build final é copiado para:
- `/usr/share/nginx/html` 

### Iniciar sem build

- **Build Stage:** `node:20-alpine` executar o comando `npm run dev`.

### Executar via Docker

```bash
docker build -t projeto-seplag .
docker run -p 80:80 projeto-seplag
