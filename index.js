const express = require('express');
// Importa o módulo Express, que facilita a criação de um servidor web.

const mysql2 = require('mysql2');
// Importa o módulo mysql2, que permite a conexão com um banco de dados MySQL.

const PORT = 3000;
// Define a porta 3000 para o servidor escutar conexões.

const HOST = '0.0.0.0';
// Define o host como '0.0.0.0', o que permite que o servidor seja acessível de fora do contêiner Docker.

const connection = mysql2.createConnection({
    host: 'database-mysql',
    // Define o host do banco de dados MySQL. 'database-mysql' é o nome do host, útil quando executado em um ambiente Docker.
    
    user: 'root',
    // Define o nome do usuário do MySQL, neste caso, 'root'.
    
    password: '123',
    // Define a senha do usuário 'root'.
    
    database: 'fiap',
    // Define o nome do banco de dados a ser utilizado, neste caso, 'fiap'.
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        // Caso haja erro ao conectar com o MySQL, ele é impresso no console.
        return;
    }
    console.log('Connected to MySQL database');
    // Se a conexão for bem-sucedida, é exibida uma mensagem no console indicando a conexão.
});

const app = express();
// Inicializa a aplicação Express.

app.get('/', (req, res) => {
    // Define uma rota HTTP GET para a URL raiz ('/'). Quando essa rota é acessada, a função de callback é executada.

    const query = 'SELECT * FROM products';
    // Define a query SQL para selecionar todos os registros da tabela 'products'.

    connection.query(query, (err, results, fields) => {
        if (err) {
            console.error('Error executing SELECT query:', err);
            // Se ocorrer algum erro ao executar a query, o erro é impresso no console.
            return;
        }

        // res.send(results); // Envia o resultado da query diretamente como resposta (antes de ser formatado).

        res.send(results.map(item => ({ name: item.name, price: item.price })));
        // Mapeia os resultados, retornando apenas o nome e o preço de cada produto no formato JSON.
    });
});

app.listen(PORT, HOST);
// Faz com que o servidor Express comece a escutar requisições na porta e host definidos (3000 e '0.0.0.0').
