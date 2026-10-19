// ============================================================
//  CONFIGURAÇÃO DA LOJA E VITRINE DE PRODUTOS
//  Para mudar o site no dia a dia, edite só este arquivo.
// ============================================================

const LOJA = {
  nome: "Samara Variedades",
  whatsapp: "5584999801229", // só números, com 55 + DDD
  instagram: "samaravariedadess",
  cidade: "Jardim de Piranhas/RN",
  endereco: "", // ex.: "Rua X, 123, Centro". Vazio = não mostra.
  horario: "",  // ex.: "Seg a sáb, 8h às 18h". Vazio = não mostra.
  // CONFIRMAR com a loja antes de publicar:
  entregaGratis: ["Jardim de Piranhas", "Caicó", "São Bento", "Brejo do Cruz"],
};

// Categorias dos filtros (na ordem). Só aparecem as que têm produto.
const CATEGORIAS = [
  { id: "arabes", nome: "Árabes" },
  { id: "importados", nome: "Importados" },
  { id: "nacionais", nome: "Nacionais" },
  { id: "body-splash", nome: "Body splash" },
  { id: "cabelos", nome: "Cabelos" },
  { id: "infantil", nome: "Infantil" },
  { id: "kits", nome: "Kits e presentes" },
];

// Famílias de cheiro do seletor "Como você quer cheirar?".
// A cor marca o produto na vitrine. Mude o texto de "dica" à vontade.
const FAMILIAS = [
  { id: "doce", nome: "Doce", dica: "Baunilha, caramelo, frutas", cor: "#d98ba0" },
  { id: "floral", nome: "Floral", dica: "Rosas, jasmim, flores brancas", cor: "#b79ad6" },
  { id: "amadeirado", nome: "Amadeirado", dica: "Madeiras, oud, especiarias", cor: "#b98549" },
  { id: "fresco", nome: "Fresco", dica: "Cítricos, ervas, notas de água", cor: "#7fb7b0" },
];

// ------------------------------------------------------------
//  PRODUTOS
//  Obrigatório: nome, categoria.
//  Opcional:
//  - marca:     "O Boticário", "Natura"...
//  - familia:   "doce" | "floral" | "amadeirado" | "fresco" (só perfumes)
//  - ml:        número, ex.: 100
//  - detalhe:   texto curto (ex.: "Shampoo + condicionador + máscara")
//  - notas:     notas do perfume (ex.: "Baunilha, âmbar e almíscar")
//  - preco:     número (390 = R$ 390,00). Vazio = "Consulte o valor".
//  - precoDe:   preço antigo, para mostrar "de/por".
//  - foto:      "img/arquivo.jpg". FOTO REAL, nunca imagem feita por IA.
//  - destaque:  true = aparece grande, no topo da vitrine.
//  - esgotado:  true = mostra "Esgotado" e troca o botão por "Avise-me".
//
//  Os itens abaixo são EXEMPLOS tirados do Instagram. Troque preços,
//  tamanhos e fotos pelos reais antes de publicar.
// ------------------------------------------------------------
const PRODUTOS = [
  {
    nome: "Kit Wella Invigo Nutri-Enrich",
    categoria: "cabelos",
    marca: "Wella",
    detalhe: "Shampoo, condicionador e máscara",
    preco: 390,
    precoDe: 504,
    destaque: true,
  },
  {
    nome: "Malbec Black Legend",
    categoria: "nacionais",
    marca: "O Boticário",
    familia: "amadeirado",
    ml: 100,
    notas: "Madeiras, couro e especiarias",
  },
  {
    nome: "Hadiya",
    categoria: "arabes",
    familia: "doce",
    ml: 100,
    notas: "Baunilha, frutas e âmbar",
  },
  {
    nome: "Egeo Dolce Illusion",
    categoria: "nacionais",
    marca: "O Boticário",
    familia: "doce",
    ml: 90,
  },
  {
    nome: "Lily",
    categoria: "nacionais",
    marca: "O Boticário",
    familia: "floral",
    ml: 75,
  },
  {
    nome: "Kaiak",
    categoria: "nacionais",
    marca: "Natura",
    familia: "fresco",
    ml: 100,
  },
  {
    nome: "Kit O.U.I L'Amour-Esse 142",
    categoria: "kits",
    marca: "O.U.I",
    familia: "floral",
    detalhe: "Hidratante 200 ml e perfume 75 ml",
  },
  {
    nome: "Miniaturas Brand Collection",
    categoria: "importados",
    ml: 25,
    detalhe: "Vários aromas",
  },
  {
    nome: "Body splash",
    categoria: "body-splash",
    detalhe: "Vários aromas",
  },
  {
    nome: "Linha Ciclo Infantil",
    categoria: "infantil",
    detalhe: "Colônias e cuidados para crianças",
  },
];
