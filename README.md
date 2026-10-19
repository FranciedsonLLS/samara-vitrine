# Site vitrine da Samara Variedades

Página única para o link da bio do Instagram. A pessoa filtra por cheiro, categoria ou busca, junta produtos na **sacola** e envia **um pedido só** no WhatsApp, com a lista, o total, o nome e a forma de entrega.

São só arquivos estáticos: não precisa de servidor nem de banco de dados.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `js/produtos.js` | **O único que a loja edita.** Dados da loja, categorias, famílias de cheiro e produtos. |
| `js/nucleo.js` | Funções comuns (preço em R$, link do WhatsApp, armazenamento, avisos entre as partes). |
| `js/sacola.js` | Sacola: itens, quantidades, total e mensagem do pedido. Fica salva no navegador do cliente. |
| `js/vitrine.js` | Seletor "Como você quer cheirar?", categorias, busca e os rótulos dos produtos. |
| `js/app.js` | Textos da loja, links gerais e rodapé. |
| `css/style.css` | Visual. As cores e tamanhos ficam no topo, em `:root`. |

## Como cadastrar um produto

Em `js/produtos.js`, copie um bloco da lista `PRODUTOS`. Só `nome` e `categoria` são obrigatórios:

```js
{
  nome: "Malbec Black Legend",
  categoria: "nacionais",
  marca: "O Boticário",
  familia: "amadeirado",   // doce | floral | amadeirado | fresco
  ml: 100,
  notas: "Madeiras, couro e especiarias",
  preco: 199.9,
  precoDe: 239.9,          // opcional: mostra "de/por" e o selo Oferta
  foto: "img/malbec.jpg",  // foto real, quadrada, até ~300 KB
  destaque: true,          // aparece grande, no topo
  esgotado: false,         // true troca o botão por "Avise-me"
},
```

As famílias de cheiro (nome, dica e cor) também ficam em `produtos.js`, na lista `FAMILIAS`. Uma família só aparece no seletor se algum produto usar ela.

## Depois de alterar CSS ou JS

No `index.html`, troque o número `?v=4` (em todos os links de CSS e JS) por um número maior. Isso obriga o celular dos clientes a baixar a versão nova, em vez de usar a antiga guardada.

## Publicação

O site está no GitHub Pages: https://franciedsonlls.github.io/samara-vitrine/

Cada `git push` na branch `main` atualiza o site em cerca de 1 minuto.

## Antes de publicar

- [ ] Trocar os produtos de exemplo pelos reais, com preço, família e foto
- [ ] Confirmar as cidades de entrega grátis
- [ ] Preencher endereço e horário

## Ideias para depois

A estrutura já comporta: filtro por faixa de preço ("presentes até R$ 50"), página de detalhe do produto, cupom de desconto na sacola e lista de produtos vinda de uma planilha.
