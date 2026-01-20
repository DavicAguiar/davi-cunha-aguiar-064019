# Processo Seletivo SEPLAG/MT - Edital nº 001/2026
[cite_start]**Cargo:** Analista de TI - Perfil Engenheiro da Computação (Sênior) [cite: 12]
**Candidato:** Davi da Cunha Aguiar
[cite_start]**Repositório:** davi-cunha-aguiar-064019 [cite: 158]

---

## 🏗️ Arquitetura e Decisões Técnicas

[cite_start]Para este projeto de SPA (Single Page Application) em React, foram adotadas práticas de engenharia de software voltadas para escalabilidade e alta disponibilidade, conforme exigido para o nível Sênior[cite: 435, 486].

### 1. Padrão Facade (Arquitetura em Camadas)
[cite_start]A aplicação utiliza o **Padrão Facade** para gerenciar a complexidade das interações entre a UI e as camadas de dados[cite: 489].
- **UI Layer:** Componentes React focados apenas na renderização e interação do usuário.
- **Facade Layer:** Ponto único de acesso que coordena as chamadas aos serviços de API e a atualização do estado global.
- [cite_start]**Service Layer:** Responsável pelas requisições HTTP (utilizando Axios) para os endpoints de Pets e Tutores[cite: 442, 463].

### 2. Gestão de Estado com RxJS (BehaviorSubject)
[cite_start]Diferente de abordagens mais simples, o estado global da aplicação (como a lista de pets e dados de autenticação) é gerenciado via **BehaviorSubject** do RxJS[cite: 489].
- Garante reatividade e permite que múltiplos componentes assinem as mudanças de estado de forma performática.
- Facilita a implementação de lógica assíncrona complexa fora do ciclo de vida dos componentes.

### 3. Containerização e Infraestrutura
[cite_start]A aplicação foi empacotada utilizando um **Multi-stage Docker build**[cite: 491, 612]:
- [cite_start]**Build Stage:** Utiliza Node.js 20 para compilar o código TypeScript e gerar o bundle de produção[cite: 452].
- **Production Stage:** Utiliza um servidor Nginx leve para servir os arquivos estáticos, otimizando o consumo de recursos.
- [cite_start]**Observabilidade:** Implementação de endpoints de **Health Checks** (Liveness e Readiness) para monitoramento do container[cite: 487].

### 4. Performance e UX
- [cite_start]**Lazy Loading:** As rotas para os módulos de "Pets" e "Tutores" são carregadas sob demanda, reduzindo o tempo de carregamento inicial (Initial Bundle Size)[cite: 450].
- [cite_start]**Tailwind CSS:** Utilizado para garantir um layout responsivo e de fácil manutenção[cite: 443, 449].
- [cite_start]**TypeScript:** Tipagem estrita em todo o projeto para garantir a manutenibilidade e prevenir erros em tempo de execução[cite: 452, 506].

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Docker e Docker Compose instalados.

### Via Docker (Recomendado)
Para rodar a aplicação exatamente como ela será avaliada pela banca:
1. No terminal, execute:
   ```bash
   docker build -t projeto-seplag .
   docker run -p 80:80 projeto-seplag