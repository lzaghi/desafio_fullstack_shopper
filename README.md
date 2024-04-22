# Teste Fullstack Shopper: Aplicativo para reajuste de precificações

Esta é uma aplicação para manutenção de preços de produtos de um banco de dados, na qual é possível validar reajustes, recuperar e atualizar produtos.

É uma implementação Fullstack feita com React, Node + Typescript e MySQL.
s

## Funcionalidades

- Carregar arquivo .csv com os reajustes desejados
- Validar o arquivo a partir de uma série de regras pré-definidas
- Listar os dados dos produtos (código, nome, preço atual e novo preço)
- Exibir junto aos produtos qual foi o erro de validação, ou se o reajuste é valido
- Impossibilitar a atualização caso haja produtos com erros de validação
- Atualizar reajustes válidos, com persistência no banco de dados
- Ao atualizar com sucesso, tela já fica pronta para carregamento de um novo arquivo
- Alertas para o usuário em caso de sucesso e em caso de erro nas operações da API 


## Tecnologias utilizadas
- React 18
- Node 16
- MySQL 8
- Sequelize
- Docker


## Instalação e execução local

Para rodar esta aplicação é necessário ter o Docker e o Docker Compose instalados em sua máquina.

Certifique-se também de ter as portas 3306, 3001 e 4173 desocupadas


1. Clone o repositório e entre no diretório
```bash
  git clone git@github.com:lzaghi/desafio_fullstack_shopper.git
  cd desafio_fullstack_shopper
```

2. A partir da raiz do projeto, suba os containeres do banco de dados, back e front
```bash
  docker-compose up -d --build
```

A aplicação já estará rodando! :)</br>
Acesse ```http://localhost:4173``` para a experiência de usuário. O backend estará rodando em ```http://localhost:3001```.


Para parar a aplicação, basta executar o comando na raiz do projeto
```bash
  docker-compose down --remove-orphans
```


## Documentação

### Regras de negócio:

A alteração de preços de produtos só pode ser feita se o arquivo de precificação seguir as seguintes regras:

- Ambos os campos necessários existem (product_code e new_price)
- Os códigos de produtos informados existem no banco de dados
- Os preços preenchidos são valores numéricos válidos
- O preço de venda de um produto deve ser maior que seu preço de custo
- É impedido qualquer reajuste maior ou menor do que 10% do preço atual do produto
- Produtos e pacotes associados devem ser reajustados juntos e de forma correspondente


As mensagens de erro possíveis de serem retornadas são:

- 'Os campos de código de produto e de novo preço são obrigatórios'
- 'Produto a ser reajustado está duplicado no arquivo de entrada'
- 'Não existe produto com o código informado'
- 'O novo preço deve ser um número positivo com até duas casas decimais, separadas por ponto'
- 'Produtos/pacotes associados a esse também devem ser reajustados'
- 'O preço de venda não pode ser menor que o preço de custo'
- 'O reajuste não pode ser maior ou menor do que 10% do valor atual do produto'
- 'Produtos associados a esse pacote apresentam reajustes inválidos'
- 'O valor do reajuste de pacotes deve corresponder ao reajuste dos produtos associados'


Segue um resumo de como as requisições são recebidas e respondidas:
<details open>
<summary><strong>Especificações das requisições</strong></summary>

<strong>Validar arquivo</strong>

```http
POST /products/validate
```
<details><summary>Exemplo de Entrada:</summary></br>

```json
[
	{
		"product_code": 1,
		"new_price": 77
	},
	{
		"product_code": "",
		"new_price": 20
	},
	{
		"product_code": 16,
		"new_price": 22.54
	},
	{
		"product_code": 20,
		"new_price": 20
	},
	{
		"product_code": 18,
		"new_price": 5
	}
]
```
</details>

<details><summary>Exemplo de retorno:</summary></br>

```json
[
	{
		"product_code": "",
		"new_price": 20,
		"error": "Os campos de código de produto e de novo preço são obrigatórios"
	},
	{
		"product_code": 1,
		"new_price": 77,
		"error": "Não existe produto com o código informado"
	},
	{
		"product_code": 16,
		"name": "AZEITE  PORTUGUï¿½S  EXTRA VIRGEM GALLO 500ML",
		"current_price": "20.49",
		"new_price": "22.54",
		"error": null
	},
	{
		"product_code": 18,
		"name": "BEBIDA ENERGï¿½TICA VIBE 2L",
		"current_price": "8.99",
		"new_price": 5,
		"error": "Produtos/pacotes associados a esse também devem ser reajustados"
	},
	{
		"product_code": 20,
		"name": "ENERGï¿½TICO RED BULL ENERGY DRINK 355ML",
		"current_price": "10.79",
		"new_price": 20,
		"error": "O reajuste não pode ser maior ou menor do que 10% do valor atual do produto"
	}
]
```
</details>

----

<strong>Atualizar produtos</strong>

```http
POST /products/update
```
<details><summary>Exemplo de Entrada:</summary></br>

```json
[
	{
		"product_code": 24,
		"new_price": 4.39
	},
	{
		"product_code": 26,
		"new_price": 5.21
	},
	{
		"product_code": 1010,
		"new_price": 9.60
	}
]
```
</details>

<details><summary>Exemplo de retorno:</summary></br>

Em caso de sucesso: status 200 (no content)

Em caso de erro: status 400
```json
{
	"message": "Invalid input"
}
```
</details>

</details>

## Demonstração

<details open>
<summary style="font-weight: bold;">Exemplo de uso</summary>

<img src="./demo-shopper.gif" alt="GIF demonstrativo">

</details>
