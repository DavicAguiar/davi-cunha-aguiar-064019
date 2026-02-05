# Processo Seletivo SEPLAG/MT — Edital nº 001/2026

**Cargo:** Analista de TI — Perfil Engenheiro da Computação (Sênior)  
**Candidato:** Davi da Cunha Aguiar  
**Repositório:** `davi-cunha-aguiar-064019`

---

## Objetivo do projeto

Aplicação **Front-end** em **React + TypeScript** para consumo da API pública de **Pets** e **Tutores**, conforme o edital.

- Swagger: https://pet-manager-api.geia.vip/q/swagger-ui/
- API base usada no projeto:
  - `https://pet-manager-api.geia.vip/v1` (módulos de pets/tutores)
  - `https://pet-manager-api.geia.vip` (autenticação)

---

## Arquitetura e decisões técnicas

### Stack principal

- React + Vite + TypeScript (**obrigatório**)
- React Router com **lazy loading** (carregamento sob demanda de páginas)
- Axios para chamadas HTTP
- RxJS (`BehaviorSubject`) para gerenciamento de estado global (conforme nível Sênior)
- Tailwind CSS para layout responsivo

### Organização em camadas (Padrão Facade)

Organizei o projeto em camadas para reduzir acoplamento e manter responsabilidades claras:

- `src/pages` e `src/components`: **UI** (apresentação)
- `src/facades`: **orquestração** do fluxo entre UI ↔ serviços ↔ estado
- `src/services`: **integração HTTP** com a API
- `src/state`: **estado global reativo** com `BehaviorSubject`

---

## Mapeamento dos requisitos do edital (status atual)

### Requisitos gerais

- ✅ Requisições em tempo real via Axios
- ✅ Layout responsivo
- ✅ Uso de Tailwind CSS
- ✅ Lazy loading das rotas principais (`Login`, `Pets`, `Tutores`, etc.)
- ✅ Paginação (10 itens por página)
- ✅ TypeScript
- ✅ Organização e componentização
- ⚠️ **Testes unitários básicos não foram feitos** (pendente)

### 1) Tela inicial — listagem de pets

- ✅ GET `/v1/pets`
- ✅ Exibição em cards (foto, nome, raça, idade)
- ✅ Paginação
- ✅ Busca por nome

### 2) Tela de detalhamento do pet

- ✅ Navegação por clique no card para detalhamento
- ✅ GET `/v1/pets/{id}`
- ✅ Exibição de tutor vinculado (quando disponível no payload de pet)
- ✅ Destaque visual para o nome do pet

### 3) Cadastro/Edição de pet

- ✅ POST `/v1/pets`
- ✅ PUT `/v1/pets/{id}`
- ✅ Campos principais de cadastro/edição
- ✅ Upload de foto via POST `/v1/pets/{id}/fotos`
- ✅ Máscara/normalização para campos numéricos

### 4) Cadastro/Edição de tutor

- ✅ POST `/v1/tutores`
- ✅ PUT `/v1/tutores/{id}`
- ✅ Upload de foto via POST `/v1/tutores/{id}/fotos`
- ✅ Vincular pet: POST `/v1/tutores/{id}/pets/{petId}`
- ✅ Remover vínculo: DELETE `/v1/tutores/{id}/pets/{petId}`
- ✅ Listagem de pets vinculados na tela de tutor

### 5) Autenticação

- ✅ Login via POST `/autenticacao/login`
- ✅ Refresh de token via PUT `/autenticacao/refresh`
- ✅ Interceptor para renovação automática em respostas 401

### Requisitos apenas para Sênior

- ⚠️ **Health checks/Liveness/Readiness não estão implementados no container atual**
- ⚠️ **Testes unitários não foram encontrados**
- ✅ Uso de Facade e gerenciamento de estado com `BehaviorSubject`

---

## Como executar

### Pré-requisitos

- Node.js 20+
- npm 10+

### Execução local

```bash
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`.

### Build de produção

```bash
npm run build
npm run preview
```

### Execução com Docker

```bash
docker build -t projeto-seplag .
docker run --rm -p 80:80 projeto-seplag
```

Aplicação disponível em `http://localhost`.

---

## Scripts disponíveis

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build TypeScript + Vite
- `npm run lint`: análise estática ESLint
- `npm run preview`: servidor local para artefato de produção

---

## Pendências e priorização

Os próximos passos prioritários são:

1. Implementar suíte mínima de testes unitários (ex.: facades/services/componentes críticos).
2. Ajustar pipeline para lint sem erros.
3. Incluir health checks no container/runtime (liveness/readiness).
4. Documentar estratégia de deploy.

---

## Transparência sobre uso de IA

Utilizei ferramentas de IA como apoio para **verificação de erros**, **melhorias** e **revisão pontual** de trechos do projeto, incluindo:

- **ChatGPT Plus**
- **Gemini Pro**
- **Claude**

**Como garanti autoria e qualidade:**
- toda sugestão foi **avaliada e validada por mim**, com foco em tipagem, fluxo, consistência com a API e aderência ao edital;
- apliquei refatorações para manter responsabilidades claras (**UI vs Facade vs Services vs State**);
- o objetivo do uso de IA foi **aumentar produtividade e qualidade**, sem substituir autoria técnica.

---

## Observações finais para banca

Procurei entregar um código legível, bem tipado e fácil de evoluir, priorizando aderência ao edital e organização em camadas.
O fluxo: autenticação, consumo de API, CRUD, paginação/filtros e performance com lazy loading.

Sou uma pessoa dedicada, posso não saber tudo, mas tenho a plena convicção de que sei **achar a resposta, aprender rápido e chegar na melhor solução**, validando com critério técnico.

Fico à disposição para explicar decisões e trade-offs adotados (Facade, BehaviorSubject/RxJS, interceptors de autenticação e organização por camadas) e discutir possíveis melhorias.