# Site vitrine da Samara Variedades

Página única para o link da bio do Instagram. A pessoa filtra por cheiro, categoria ou busca, junta produtos na **sacola** e envia **um pedido só** no WhatsApp, com a lista, o total, o nome e a forma de entrega.

São só arquivos estáticos: não precisa de servidor nem de banco de dados. **Os produtos vêm de uma Planilha Google**, que a funcionária edita pelo celular.

## De onde vêm os produtos

1. **Planilha Google** (o normal): o site lê a planilha toda vez que alguém abre a página.
2. **Última cópia da planilha** guardada no navegador do cliente, se a planilha não abrir na hora.
3. **Lista `PRODUTOS` do `js/produtos.js`**, como reserva final.

Assim a vitrine nunca fica vazia, mesmo se o Google ou a internet falharem.

## Configurar a planilha (uma vez só)

1. No Google Drive, crie uma pasta **Vitrine Samara** e, dentro dela, uma pasta **Fotos**.
2. Envie `planilha/modelo-vitrine-samara.xlsx` para a pasta e abra com o Google Planilhas (Arquivo > Salvar como Planilhas Google).
3. Compartilhe a planilha e a pasta Fotos com a conta da loja, como **Editor**.
4. Na pasta Fotos: Compartilhar > Acesso geral > **Qualquer pessoa com o link** (Leitor). Assim toda foto enviada já sai visível no site.
5. Na planilha: **Arquivo > Compartilhar > Publicar na Web**. Escolha a aba **Produtos** e o formato **Valores separados por vírgula (.csv)** > Publicar. Copie o link.
6. Cole o link em `planilhaCSV`, no `js/produtos.js`, aumente o `?v=` no `index.html` e dê push.

Depois disso, ninguém mais precisa mexer no código para mudar produtos. A aba **Como usar** da planilha explica o dia a dia para a funcionária.

**Atraso:** o Google atualiza o CSV publicado em alguns minutos (até ~5). Uma mudança na planilha não aparece no mesmo segundo.

### Colunas da aba Produtos

| Coluna | Obrigatória | Exemplo |
|---|---|---|
| Nome | sim | Malbec Black Legend |
| Categoria | sim | Nacionais (lista) |
| Marca | | O Boticário |
| Cheiro | | Amadeirado (lista: Doce, Floral, Amadeirado, Fresco) |
| Tamanho (ml) | | 100 |
| Preço | | 189,90 (vazio = "Consulte o valor") |
| Preço antigo | | 239,90 (mostra "de/por" e o selo Oferta) |
| Detalhe | | Hidratante 200 ml e perfume 75 ml |
| Notas | | Madeiras, couro e especiarias |
| Link da foto | | link de compartilhamento do Google Drive |
| Destaque | | Sim / Não |
| Esgotado | | Sim / Não |
| Mostrar no site | | Não = esconde sem apagar |

Os nomes das colunas podem estar em qualquer ordem, com ou sem acento. Categoria e cheiro que não batem com as listas não quebram nada: o produto aparece em "Tudo", sem família. Uma linha sem nome é ignorada.

**Para adicionar uma categoria ou um cheiro novo**, inclua na lista `CATEGORIAS` ou `FAMILIAS` do `js/produtos.js` **e** na aba Listas da planilha.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `js/produtos.js` | Dados da loja, link da planilha, categorias, famílias de cheiro e a lista reserva de produtos. |
| `js/nucleo.js` | Funções comuns e a ordem de inicialização (`registrar` / `iniciar`). |
| `js/planilha.js` | Lê o CSV da planilha, converte as colunas e cuida das reservas. |
| `js/sacola.js` | Sacola: itens, quantidades, total e mensagem do pedido. Fica salva no navegador do cliente. |
| `js/vitrine.js` | Seletor "Como você quer cheirar?", categorias, busca e os rótulos dos produtos. |
| `js/app.js` | Textos da loja, links gerais, rodapé e o carregamento dos produtos. |
| `css/style.css` | Visual. As cores e tamanhos ficam no topo, em `:root`. |
| `planilha/` | Modelo da planilha (`.xlsx`) para subir no Google Drive. |

Para incluir uma função nova, crie um arquivo em `js/` que comece com `Samara.registrar(function () { ... })` e adicione no `index.html` antes do `app.js`. Ele roda depois que os produtos carregarem.

## Depois de alterar CSS ou JS

No `index.html`, troque o número `?v=` (em todos os links de CSS e JS) por um número maior. Isso obriga o celular dos clientes a baixar a versão nova, em vez de usar a antiga guardada.

## Testar no computador

```bash
python -m http.server 5174
```

Depois abra http://localhost:5174. A pasta `testes/` (fora do Git) pode guardar um CSV de exemplo: aponte `planilhaCSV` para `testes/arquivo.csv` só enquanto testa.

## Publicação

O site está no GitHub Pages: https://franciedsonlls.github.io/samara-vitrine/

Cada `git push` na branch `main` atualiza o site em cerca de 1 minuto.

## Antes de divulgar

- [ ] Configurar a planilha (seção acima) e trocar os produtos de exemplo pelos reais, com preço, cheiro e foto
- [ ] Confirmar as cidades de entrega grátis
- [ ] Preencher endereço e horário

## Ideias para depois

Filtro por faixa de preço ("presentes até R$ 50"), página de detalhe do produto e cupom de desconto na sacola.
