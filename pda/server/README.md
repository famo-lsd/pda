Instalação em Windows Server:
- Instalar Node.js/npm no utilizador DOMFAMOLSD\administrator;
- Instalar Redis para Windows (https://github.com/tporadowski/redis/releases) na porta 3035;
- Instalar pm2 (npm install -g pm2);
    - Credencias da conta pm2: servicedesk@famo.pt/servicedesk;
- Criar uma variável de sistema PM2_HOME com o valor C:\etc\.pm2;
- Executar a release "Server" do projeto GitHub.
- Criar uma tarefa para que sempre que o servidor inicie, o servidor Node também inicie.