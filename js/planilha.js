// ============================================================
//  Planilha: lê os produtos de uma Planilha Google publicada
//  como CSV (endereço em LOJA.planilhaCSV, no produtos.js).
//
//  Ordem de tentativa:
//   1. planilha online
//   2. última cópia da planilha guardada neste navegador
//   3. lista PRODUTOS do produtos.js
//  Assim o site nunca fica vazio se a internet ou o Google falharem.
// ============================================================
(function () {
  const S = window.Samara;
  const CHAVE_COPIA = "samara-planilha-v1";
  const TEMPO_LIMITE = 7000;

  // --- CSV (aceita aspas, vírgulas e quebras de linha dentro do texto) ---
  function lerCSV(texto) {
    const linhas = [];
    let linha = [], campo = "", aspas = false;
    texto = texto.replace(/^﻿/, "");
    for (let i = 0; i < texto.length; i++) {
      const c = texto[i];
      if (aspas) {
        if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
        else if (c === '"') aspas = false;
        else campo += c;
      } else if (c === '"') aspas = true;
      else if (c === ",") { linha.push(campo); campo = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && texto[i + 1] === "\n") i++;
        linha.push(campo); linhas.push(linha); linha = []; campo = "";
      } else campo += c;
    }
    if (campo !== "" || linha.length) { linha.push(campo); linhas.push(linha); }
    return linhas;
  }

  // --- conversões de cada coluna ---
  const chave = (s) => S.normalizar(s).replace(/[^a-z0-9]/g, "");

  function numero(v) {
    // aceita "R$ 1.234,56", "89,9", "89.90", "390"
    let s = String(v || "").replace(/[^\d,.-]/g, "");
    if (!s) return null;
    if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
    const n = parseFloat(s);
    return isFinite(n) && n > 0 ? n : null;
  }

  function simNao(v) {
    return ["sim", "s", "x", "true", "verdadeiro", "1", "yes"].includes(chave(v));
  }

  function porNomeOuId(lista, v) {
    const k = chave(v);
    if (!k) return null;
    const achado = lista.find((item) => chave(item.id) === k || chave(item.nome) === k);
    return achado ? achado.id : null;
  }

  // Link de compartilhamento do Google Drive -> imagem que o site consegue mostrar
  function foto(v) {
    const s = String(v || "").trim();
    if (!s) return "";
    const drive = s.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{10,})/);
    if (drive) return "https://drive.google.com/thumbnail?id=" + drive[1] + "&sz=w800";
    if (/^https?:\/\//.test(s) || /^img\//.test(s)) return s;
    return "";
  }

  // Cabeçalhos aceitos (em qualquer ordem, com ou sem acento/maiúscula)
  const COLUNAS = {
    nome: "nome", produto: "nome",
    categoria: "categoria",
    marca: "marca",
    cheiro: "familia", familia: "familia", familiaolfativa: "familia",
    ml: "ml", tamanho: "ml", tamanhoml: "ml",
    notas: "notas",
    detalhe: "detalhe", descricao: "detalhe",
    preco: "preco", precor: "preco", precoatual: "preco",
    precoantigo: "precoDe", precode: "precoDe", de: "precoDe",
    foto: "foto", linkdafoto: "foto", imagem: "foto",
    destaque: "destaque",
    esgotado: "esgotado",
    mostrarnosite: "mostrar", mostrar: "mostrar", nosite: "mostrar",
  };

  function converter(linhas) {
    if (!linhas.length) return [];
    const cab = linhas[0].map((h) => COLUNAS[chave(h)] || null);
    if (!cab.includes("nome")) throw new Error("A planilha não tem a coluna Nome.");

    const produtos = [];
    linhas.slice(1).forEach((cols) => {
      const r = {};
      cab.forEach((campo, i) => { if (campo) r[campo] = (cols[i] || "").trim(); });
      if (!r.nome) return;                                   // linha vazia
      if (r.mostrar !== undefined && r.mostrar !== "" && !simNao(r.mostrar)) return;

      const p = {
        nome: r.nome,
        categoria: porNomeOuId(S.categorias, r.categoria) || "outros",
        marca: r.marca || "",
        familia: porNomeOuId(S.familias, r.familia),
        ml: numero(r.ml),
        notas: r.notas || "",
        detalhe: r.detalhe || "",
        preco: numero(r.preco),
        precoDe: numero(r.precoDe),
        foto: foto(r.foto),
        destaque: simNao(r.destaque),
        esgotado: simNao(r.esgotado),
      };
      produtos.push(p);
    });
    return produtos;
  }

  function buscarComLimite(url) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TEMPO_LIMITE);
    return fetch(url, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
      .finally(() => clearTimeout(t));
  }

  // Devolve { produtos, origem } — nunca rejeita.
  S.carregarProdutos = function () {
    const url = (S.loja.planilhaCSV || "").trim();
    if (!url) return Promise.resolve({ produtos: null, origem: "arquivo" });

    return buscarComLimite(url)
      .then((texto) => {
        if (/^\s*</.test(texto)) throw new Error("O link não é o CSV publicado da planilha.");
        const produtos = converter(lerCSV(texto));
        if (!produtos.length) throw new Error("A planilha está sem produtos.");
        S.guardar(CHAVE_COPIA, produtos);
        return { produtos, origem: "planilha" };
      })
      .catch((erro) => {
        console.warn("[vitrine] Não deu para ler a planilha:", erro.message);
        const copia = S.ler(CHAVE_COPIA, null);
        if (copia && copia.length) return { produtos: copia, origem: "copia" };
        return { produtos: null, origem: "arquivo" };
      });
  };

  // exposto para testes
  S._planilha = { lerCSV, converter, foto, numero };
})();
