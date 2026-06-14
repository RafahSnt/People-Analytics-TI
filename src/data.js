// Synthetic data generator for People Analytics Dashboard

const SUBSETORES = ["Infraestrutura", "Sistemas", "Redes", "Digital", "Projetos"];

const CARGOS = {
  Infraestrutura: ["Analista de Infra Jr","Analista de Infra Pl","Analista de Infra Sr","Especialista DevOps","Coordenador de Infra"],
  Sistemas:       ["Desenvolvedor Jr","Desenvolvedor Pl","Desenvolvedor Sr","Tech Lead","Arquiteto de Software"],
  Redes:          ["Analista de Redes Jr","Analista de Redes Pl","Analista de Redes Sr","Especialista em Segurança","Coordenador de Redes"],
  Digital:        ["UX Designer","Product Designer","Analista Digital","Especialista SEO/SEM","Head of Digital"],
  Projetos:       ["Analista de PMO Jr","Analista de PMO Pl","Gerente de Projetos","Scrum Master","PMO Sênior"],
};

const SALARIOS = {
  Infraestrutura: [4200,6800,9500,12000,14500],
  Sistemas:       [4800,7500,11000,14000,18000],
  Redes:          [4000,6500,9000,11500,13500],
  Digital:        [5200,8000,10500,12500,16000],
  Projetos:       [4500,7200,10000,11000,13000],
};

const NOMES_MASC = ["Carlos","Lucas","Rafael","Bruno","Thiago","Diego","Felipe","Gustavo","Pedro","Mateus","Eduardo","Rodrigo","Henrique","Leonardo","Marcelo"];
const NOMES_FEM  = ["Ana","Juliana","Fernanda","Mariana","Camila","Patricia","Renata","Alessandra","Tatiana","Gabriela","Luciana","Vanessa","Claudia","Beatriz","Sandra"];
const SOBRENOMES = ["Silva","Santos","Oliveira","Souza","Rodrigues","Ferreira","Alves","Pereira","Lima","Gomes","Costa","Ribeiro","Martins","Carvalho","Almeida"];
const CIDADES    = ["São Paulo","Campinas","São Bernardo","Santo André","Guarulhos"];
const HOMEOFFICE = ["Integral","Híbrido","Presencial"];
const NIVEL_PESOS = [0.20,0.30,0.25,0.15,0.10];
const NIVEL_MAP  = ["Jr","Pleno","Sênior","Especialista","Coord/Lead"];

// Seeded random
let seed = 42;
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function randInt(min, max) { return Math.floor(seededRandom() * (max - min + 1)) + min; }
function randChoice(arr) { return arr[Math.floor(seededRandom() * arr.length)]; }
function weightedChoice(weights) {
  const r = seededRandom();
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (r < acc) return i;
  }
  return weights.length - 1;
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function formatDate(d) {
  return d.toISOString().split("T")[0];
}

export function gerarDados() {
  seed = 42;
  const qtd = { Infraestrutura:22, Sistemas:35, Redes:18, Digital:20, Projetos:15 };
  const registros = [];
  let id = 1001;

  const base = new Date("2019-01-01");

  for (const setor of SUBSETORES) {
    for (let i = 0; i < qtd[setor]; i++) {
      const genero = seededRandom() > 0.5 ? "M" : "F";
      const nome = randChoice(genero === "M" ? NOMES_MASC : NOMES_FEM);
      const sobrenome = randChoice(SOBRENOMES);
      const nivelIdx = weightedChoice(NIVEL_PESOS);
      const salBase = SALARIOS[setor][nivelIdx];
      const salario = salBase + randInt(-500, 1200);
      const admissao = addDays(base, randInt(0, 1800));
      const ativo = seededRandom() > 0.12;
      const demissao = ativo ? null : addDays(admissao, randInt(180, 900));
      const antiguidade = Math.round((new Date() - admissao) / (1000 * 60 * 60 * 24 * 30));

      registros.push({
        id: `TI${id++}`,
        nome: `${nome} ${sobrenome}`,
        genero,
        setor,
        cargo: CARGOS[setor][nivelIdx],
        nivel: NIVEL_MAP[nivelIdx],
        nivelIdx,
        salario,
        admissao: formatDate(admissao),
        ativo,
        demissao: demissao ? formatDate(demissao) : null,
        avaliacao: Math.round(seededRandom() * 30 + 20) / 10,
        treinamentos: randInt(0, 8),
        homeOffice: randChoice(HOMEOFFICE),
        cidade: randChoice(CIDADES),
        antiguidade,
      });
    }

    // desligados extras
    for (let i = 0; i < randInt(4, 9); i++) {
      const genero = seededRandom() > 0.5 ? "M" : "F";
      const nome = randChoice(genero === "M" ? NOMES_MASC : NOMES_FEM);
      const sobrenome = randChoice(SOBRENOMES);
      const nivelIdx = weightedChoice([0.25,0.30,0.25,0.12,0.08]);
      const salario = SALARIOS[setor][nivelIdx] + randInt(-500, 800);
      const admissao = addDays(new Date("2021-01-01"), randInt(0, 900));
      const demissao = addDays(admissao, randInt(90, 720));

      registros.push({
        id: `TI${id++}`,
        nome: `${randChoice(genero === "M" ? NOMES_MASC : NOMES_FEM)} ${sobrenome}`,
        genero,
        setor,
        cargo: CARGOS[setor][nivelIdx],
        nivel: NIVEL_MAP[nivelIdx],
        nivelIdx,
        salario,
        admissao: formatDate(admissao),
        ativo: false,
        demissao: formatDate(demissao),
        avaliacao: Math.round(seededRandom() * 22 + 15) / 10,
        treinamentos: randInt(0, 4),
        homeOffice: randChoice(HOMEOFFICE),
        cidade: randChoice(CIDADES),
        antiguidade: Math.round((demissao - admissao) / (1000 * 60 * 60 * 24 * 30)),
      });
    }
  }

  return registros;
}

export const DADOS = gerarDados();
export { SUBSETORES, NIVEL_MAP };

export const CORES = {
  Infraestrutura: "#00E5FF",
  Sistemas:       "#7C4DFF",
  Redes:          "#00E676",
  Digital:        "#FF5252",
  Projetos:       "#FFB300",
};

export function fmtBRL(v) {
  return "R$ " + Math.round(v).toLocaleString("pt-BR");
}
export function fmtPct(v) {
  return v.toFixed(1) + "%";
}
