// ============================================================
//  Núcleo: funções usadas por todas as partes do site.
//  Tudo fica em window.Samara para as outras partes acharem.
// ============================================================
(function () {
  const ouvintes = {};

  function slug(texto) {
    return String(texto)
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  // Cada produto ganha um id estável (usado pela sacola).
  // Nomes repetidos ganham sufixo (-2, -3...) para não se misturarem.
  function prepararProdutos(lista) {
    const usados = {};
    return lista.map((p) => {
      let id = p.id || slug(p.nome);
      usados[id] = (usados[id] || 0) + 1;
      if (usados[id] > 1) id += "-" + usados[id];
      return Object.assign({}, p, { id });
    });
  }

  const modulos = [];

  window.Samara = {
    loja: LOJA,
    produtos: prepararProdutos(PRODUTOS),
    origemProdutos: "arquivo",

    // As partes do site (sacola, vitrine) se registram aqui e só rodam
    // depois que os produtos forem carregados (da planilha ou do arquivo).
    registrar(fn) { modulos.push(fn); },
    iniciar(produtos, origem) {
      if (produtos) { this.produtos = prepararProdutos(produtos); this.origemProdutos = origem; }
      modulos.forEach((fn) => fn());
    },
    categorias: CATEGORIAS,
    familias: FAMILIAS,

    familia(id) { return FAMILIAS.find((f) => f.id === id) || null; },
    categoria(id) { return CATEGORIAS.find((c) => c.id === id) || null; },
    produto(id) { return this.produtos.find((p) => p.id === id) || null; },
    slug,

    brl(v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); },

    linkWhats(texto) {
      return "https://wa.me/" + LOJA.whatsapp + "?text=" + encodeURIComponent(texto);
    },

    listaCidades(cidades) {
      if (cidades.length <= 1) return cidades.join("");
      return cidades.slice(0, -1).join(", ") + " e " + cidades[cidades.length - 1];
    },

    normalizar(s) {
      return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    },

    escapar(s) {
      return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    },

    // Armazenamento local: pode falhar (aba anônima, bloqueio), então nunca quebra o site.
    ler(chave, padrao) {
      try { const v = localStorage.getItem(chave); return v ? JSON.parse(v) : padrao; }
      catch (e) { return padrao; }
    },
    guardar(chave, valor) {
      try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* sem armazenamento */ }
    },

    // Eventos simples entre as partes (ex.: "sacola" quando a sacola muda).
    ouvir(nome, fn) { (ouvintes[nome] = ouvintes[nome] || []).push(fn); },
    avisar(nome, dados) { (ouvintes[nome] || []).forEach((fn) => fn(dados)); },
  };
})();
