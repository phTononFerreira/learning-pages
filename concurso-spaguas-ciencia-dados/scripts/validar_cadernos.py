#!/usr/bin/env python3
"""Validador dos cadernos específicos do concurso SP Águas 2026.

Uso:
    python scripts/validar_cadernos.py
    python scripts/validar_cadernos.py dados/caderno_grh.json

Sem argumentos, valida todos os arquivos dados/caderno_*.json.
Compara enunciados e cards entre cadernos e exige um único gabarito válido.
Retorna 1 se houver erro; 0 se houver apenas avisos ou tudo estiver OK.
"""

from __future__ import annotations

import json
import re
import sys
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

BASE = Path(__file__).resolve().parents[1]
DADOS = BASE / "dados"
CARGOS = DADOS / "cargos.json"

LETRAS = ("A", "B", "C", "D", "E")
CAMPOS_TEXTO_CADERNO = (
    "versao",
    "data",
    "cargo_id",
    "slug",
    "titulo",
    "subtitulo",
    "aviso",
)


@dataclass
class Resultado:
    caminho: Path
    erros: list[str] = field(default_factory=list)
    avisos: list[str] = field(default_factory=list)
    modulos: int = 0
    licoes: int = 0
    questoes: int = 0
    cards: int = 0
    fontes: int = 0
    gabaritos: dict[str, int] = field(
        default_factory=lambda: {letra: 0 for letra in LETRAS}
    )
    contagens_disponiveis: bool = False
    metadados_ok: bool | None = None
    metadados_detalhe: str = ""

    @property
    def status(self) -> str:
        if self.erros:
            return "ERRO"
        if self.avisos:
            return "AVISO"
        return "OK"


@dataclass
class RegistroCompartilhado:
    """Índices normalizados para comparar cadernos entre si."""

    enunciados: dict[str, str] = field(default_factory=dict)
    cards: dict[str, str] = field(default_factory=dict)


def configurar_saida() -> None:
    """Força UTF-8 no terminal, com fallback silencioso."""
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError, OSError):
            pass


def exibir_caminho(caminho: Path) -> str:
    try:
        return caminho.resolve().relative_to(BASE).as_posix()
    except (OSError, ValueError):
        return str(caminho)


def texto_ou_traco(valor: Any) -> str:
    if isinstance(valor, str) and valor.strip():
        return valor.strip()
    return "—"


def exigir_texto(
    obj: dict[str, Any], campo: str, contexto: str, erros: list[str]
) -> str:
    if campo not in obj:
        erros.append(f"{contexto}: campo obrigatório '{campo}' ausente")
        return ""
    valor = obj[campo]
    if not isinstance(valor, str):
        erros.append(f"{contexto}: campo '{campo}' deve ser texto")
        return ""
    valor = valor.strip()
    if not valor:
        erros.append(f"{contexto}: campo '{campo}' não pode ser vazio")
    return valor


def exigir_escalar(
    obj: dict[str, Any], campo: str, contexto: str, erros: list[str]
) -> str:
    """Valida campos que podem ser texto ou número, como 'numero' e 'item'."""
    if campo not in obj:
        erros.append(f"{contexto}: campo obrigatório '{campo}' ausente")
        return ""
    valor = obj[campo]
    if isinstance(valor, bool) or valor is None:
        erros.append(f"{contexto}: campo '{campo}' deve ser texto ou número")
        return ""
    if isinstance(valor, (int, float)):
        return str(valor)
    if isinstance(valor, str):
        valor = valor.strip()
        if valor:
            return valor
        erros.append(f"{contexto}: campo '{campo}' não pode ser vazio")
        return ""
    erros.append(f"{contexto}: campo '{campo}' deve ser texto ou número")
    return ""


def validar_horas(modulo: dict[str, Any], contexto: str, erros: list[str]) -> None:
    if "horas" not in modulo:
        erros.append(f"{contexto}: campo obrigatório 'horas' ausente")
        return
    valor = modulo["horas"]
    if isinstance(valor, bool):
        erros.append(f"{contexto}: campo 'horas' deve ser numérico")
        return
    if isinstance(valor, str):
        try:
            valor = float(valor.strip().replace(",", "."))
        except ValueError:
            erros.append(f"{contexto}: campo 'horas' deve ser numérico")
            return
    if not isinstance(valor, (int, float)):
        erros.append(f"{contexto}: campo 'horas' deve ser numérico")
    elif valor < 0:
        erros.append(f"{contexto}: campo 'horas' não pode ser negativo")


def validar_lista_textos(
    obj: dict[str, Any], campo: str, contexto: str, erros: list[str]
) -> None:
    if campo not in obj:
        erros.append(f"{contexto}: campo obrigatório '{campo}' ausente")
        return
    valores = obj[campo]
    if not isinstance(valores, list):
        erros.append(f"{contexto}: campo '{campo}' deve ser uma lista")
        return
    if not valores:
        erros.append(f"{contexto}: campo '{campo}' não pode ser uma lista vazia")
        return
    for i, valor in enumerate(valores, 1):
        if not isinstance(valor, str):
            erros.append(f"{contexto}: {campo}[{i}] deve ser texto")
        elif not valor.strip():
            erros.append(f"{contexto}: {campo}[{i}] não pode ser vazio")


def normalizar_texto(texto: str) -> str:
    """Remove acentos, iguala maiúsculas/minúsculas e compacta espaços."""
    texto = unicodedata.normalize("NFKD", texto)
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", texto.casefold()).strip()


def url_permitida(url: str) -> tuple[bool, str]:
    """Aceita apenas http(s) com domínio ou caminho relativo."""
    if any(caractere.isspace() for caractere in url):
        return False, "contém espaços"
    if re.match(r"(?i)^https?://", url):
        try:
            partes = urlsplit(url)
        except ValueError:
            return False, "formato inválido"
        if not partes.netloc:
            return False, "sem domínio"
        return True, ""
    if re.match(r"^[A-Za-z][A-Za-z0-9+.-]*:", url):
        return False, "use http(s) ou caminho relativo"
    return True, ""


def validar_caderno(
    dados: dict[str, Any], res: Resultado, compartilhado: RegistroCompartilhado
) -> None:
    erros = res.erros
    avisos = res.avisos
    rotulo_arquivo = exibir_caminho(res.caminho)

    for campo in CAMPOS_TEXTO_CADERNO:
        exigir_texto(dados, campo, "caderno", erros)

    fonte = dados.get("fonte")
    if "fonte" not in dados:
        erros.append("caderno: campo obrigatório 'fonte' ausente")
    elif not isinstance(fonte, dict):
        erros.append("caderno: campo 'fonte' deve ser um objeto")
    else:
        exigir_texto(fonte, "edital", "fonte", erros)
        exigir_texto(fonte, "coleta", "fonte", erros)

    modulos = dados.get("modulos")
    if "modulos" not in dados:
        erros.append("caderno: campo obrigatório 'modulos' ausente")
        modulos = []
    elif not isinstance(modulos, list):
        erros.append("caderno: campo 'modulos' deve ser uma lista")
        modulos = []
    elif not modulos:
        erros.append("caderno: 'modulos' não pode ser uma lista vazia")
    res.modulos = len(modulos)

    ids_modulos: set[str] = set()
    ids_modulos_vistos: dict[str, int] = {}
    ids_licoes: dict[str, str] = {}
    ids_cards: dict[str, str] = {}

    for i, modulo in enumerate(modulos, 1):
        if not isinstance(modulo, dict):
            erros.append(f"módulo {i}: deve ser um objeto")
            continue

        mid = exigir_texto(modulo, "id", f"módulo {i}", erros)
        ctx = f"módulo {i}" + (f" ({mid})" if mid else "")
        if mid:
            if mid in ids_modulos_vistos:
                erros.append(
                    f"{ctx}: id de módulo duplicado "
                    f"(já usado no módulo {ids_modulos_vistos[mid]})"
                )
            else:
                ids_modulos_vistos[mid] = i
            ids_modulos.add(mid)

        exigir_escalar(modulo, "numero", ctx, erros)
        exigir_texto(modulo, "nome", ctx, erros)
        exigir_escalar(modulo, "edital", ctx, erros)
        validar_horas(modulo, ctx, erros)
        exigir_texto(modulo, "foco", ctx, erros)

        licoes = modulo.get("licoes")
        if "licoes" not in modulo:
            erros.append(f"{ctx}: campo obrigatório 'licoes' ausente")
            licoes = []
        elif not isinstance(licoes, list):
            erros.append(f"{ctx}: campo 'licoes' deve ser uma lista")
            licoes = []
        elif not licoes:
            avisos.append(f"{ctx}: sem lições cadastradas")
        res.licoes += len(licoes)

        for j, licao in enumerate(licoes, 1):
            if not isinstance(licao, dict):
                erros.append(f"{ctx}, lição {j}: deve ser um objeto")
                continue

            lid = exigir_texto(licao, "id", f"{ctx}, lição {j}", erros)
            lctx = f"{ctx}, lição {j}" + (f" ({lid})" if lid else "")
            if lid:
                if lid in ids_licoes:
                    erros.append(
                        f"{lctx}: id de lição duplicado "
                        f"(já usado em {ids_licoes[lid]})"
                    )
                else:
                    ids_licoes[lid] = lctx

            exigir_texto(licao, "titulo", lctx, erros)
            exigir_escalar(licao, "item", lctx, erros)
            validar_lista_textos(licao, "essencial", lctx, erros)
            exigir_texto(licao, "formula", lctx, erros)
            exigir_texto(licao, "exemplo", lctx, erros)
            exigir_texto(licao, "pegadinha", lctx, erros)

        cards = modulo.get("cards")
        if "cards" not in modulo:
            erros.append(f"{ctx}: campo obrigatório 'cards' ausente")
            cards = []
        elif not isinstance(cards, list):
            erros.append(f"{ctx}: campo 'cards' deve ser uma lista")
            cards = []
        elif not cards:
            erros.append(f"{ctx}: pelo menos 1 card é obrigatório")
        res.cards += len(cards)

        for j, card in enumerate(cards, 1):
            cctx = f"{ctx}, card {j}"
            if not isinstance(card, dict):
                erros.append(f"{cctx}: deve ser um objeto")
                continue

            cid = exigir_texto(card, "id", cctx, erros)
            if cid:
                if cid in ids_cards:
                    erros.append(
                        f"{cctx}: id de card duplicado "
                        f"(já usado em {ids_cards[cid]})"
                    )
                else:
                    ids_cards[cid] = cctx

            p = exigir_texto(card, "p", cctx, erros)
            r = exigir_texto(card, "r", cctx, erros)
            if p and r:
                chave = normalizar_texto(p) + " || " + normalizar_texto(r)
                rotulo = f"{rotulo_arquivo}:{cid or cctx}"
                anterior = compartilhado.cards.get(chave)
                if anterior:
                    if anterior.startswith(rotulo_arquivo + ":"):
                        erros.append(
                            f"{cctx}: card duplicado "
                            f"(mesmo p+r do card {anterior})"
                        )
                    else:
                        erros.append(
                            f"{cctx}: card duplicado entre cadernos "
                            f"(mesmo p+r de {anterior})"
                        )
                else:
                    compartilhado.cards[chave] = rotulo

    questoes = dados.get("questoes")
    if "questoes" not in dados:
        erros.append("caderno: campo obrigatório 'questoes' ausente")
        questoes = []
    elif not isinstance(questoes, list):
        erros.append("caderno: campo 'questoes' deve ser uma lista")
        questoes = []
    elif not questoes:
        avisos.append("caderno: nenhuma questão cadastrada")
    res.questoes = len(questoes)

    ids_questoes: dict[str, int] = {}
    enunciados: dict[str, str] = {}

    for i, questao in enumerate(questoes, 1):
        if not isinstance(questao, dict):
            erros.append(f"questão {i}: deve ser um objeto")
            continue

        qid = exigir_texto(questao, "id", f"questão {i}", erros)
        qctx = f"questão {i}" + (f" ({qid})" if qid else "")
        if qid:
            if qid in ids_questoes:
                erros.append(
                    f"{qctx}: id de questão duplicado "
                    f"(já usado na questão {ids_questoes[qid]})"
                )
            else:
                ids_questoes[qid] = i

        modulo_ref = exigir_texto(questao, "modulo", qctx, erros)
        if modulo_ref and modulo_ref not in ids_modulos:
            erros.append(f"{qctx}: módulo '{modulo_ref}' não existe em 'modulos'")

        exigir_texto(questao, "nivel", qctx, erros)

        enunciado = exigir_texto(questao, "enunciado", qctx, erros)
        if enunciado:
            chave = normalizar_texto(enunciado)
            if chave in enunciados:
                erros.append(
                    f"{qctx}: enunciado duplicado "
                    f"(mesmo texto da {enunciados[chave]})"
                )
            else:
                enunciados[chave] = qid or f"questão {i}"

            rotulo = f"{rotulo_arquivo}:{qid or f'questão {i}'}"
            anterior = compartilhado.enunciados.get(chave)
            if anterior and not anterior.startswith(rotulo_arquivo + ":"):
                erros.append(
                    f"{qctx}: enunciado duplicado entre cadernos "
                    f"(mesmo texto de {anterior})"
                )
            elif not anterior:
                compartilhado.enunciados[chave] = rotulo

        alternativas = questao.get("alternativas")
        if "alternativas" not in questao:
            erros.append(f"{qctx}: campo obrigatório 'alternativas' ausente")
        elif not isinstance(alternativas, dict):
            erros.append(
                f"{qctx}: campo 'alternativas' deve ser um objeto com as letras A-E"
            )
        else:
            faltantes = [letra for letra in LETRAS if letra not in alternativas]
            extras = [
                str(chave) for chave in alternativas if chave not in LETRAS
            ]
            if faltantes or extras:
                detalhes = []
                if faltantes:
                    detalhes.append("faltam " + ", ".join(faltantes))
                if extras:
                    detalhes.append("extras: " + ", ".join(sorted(extras)))
                erros.append(
                    f"{qctx}: alternativas devem ser exatamente A, B, C, D e E "
                    f"({'; '.join(detalhes)})"
                )

            for letra in LETRAS:
                if letra not in alternativas:
                    continue
                valor = alternativas[letra]
                if not isinstance(valor, str):
                    erros.append(f"{qctx}: alternativa {letra} deve ser texto")
                elif not valor.strip():
                    erros.append(f"{qctx}: alternativa {letra} está vazia")

        gabarito = exigir_texto(questao, "gabarito", qctx, erros)
        if gabarito:
            if len(gabarito) != 1:
                erros.append(
                    f"{qctx}: gabarito deve ter uma única letra de A a E "
                    f"(recebido '{gabarito}')"
                )
            elif gabarito not in LETRAS:
                erros.append(
                    f"{qctx}: gabarito '{gabarito}' deve ser uma letra de A a E"
                )
            else:
                res.gabaritos[gabarito] += 1
                if isinstance(alternativas, dict) and gabarito not in alternativas:
                    erros.append(
                        f"{qctx}: gabarito '{gabarito}' não existe nas alternativas"
                    )

        exigir_texto(questao, "comentario", qctx, erros)

    fontes = dados.get("fontes")
    if "fontes" not in dados:
        erros.append("caderno: campo obrigatório 'fontes' ausente")
        fontes = []
    elif not isinstance(fontes, list):
        erros.append("caderno: campo 'fontes' deve ser uma lista")
        fontes = []
    elif not fontes:
        avisos.append("caderno: nenhuma fonte cadastrada")
    res.fontes = len(fontes)

    urls: dict[str, str] = {}

    for i, item in enumerate(fontes, 1):
        if not isinstance(item, dict):
            erros.append(f"fonte {i}: deve ser um objeto")
            continue

        titulo = exigir_texto(item, "titulo", f"fonte {i}", erros)
        fctx = f"fonte {i}" + (f" ({titulo})" if titulo else "")
        url = exigir_texto(item, "url", fctx, erros)
        exigir_texto(item, "nota", fctx, erros)

        if url:
            valida, motivo = url_permitida(url)
            if not valida:
                erros.append(f"{fctx}: URL inválida ({motivo}): {url}")

            chave = url.strip()
            if chave in urls:
                erros.append(
                    f"{fctx}: URL duplicada (já usada na {urls[chave]}): {url}"
                )
            else:
                urls[chave] = fctx


def para_inteiro(valor: Any) -> int | None:
    if isinstance(valor, bool):
        return None
    if isinstance(valor, int):
        return valor
    if isinstance(valor, float) and valor.is_integer():
        return int(valor)
    if isinstance(valor, str):
        try:
            return int(valor.strip())
        except ValueError:
            return None
    return None


def carregar_cargos(
    caminho: Path,
) -> tuple[dict[str, dict[str, Any]], str | None]:
    try:
        dados = json.loads(caminho.read_text(encoding="utf-8-sig"))
    except FileNotFoundError:
        return {}, f"arquivo não encontrado: {exibir_caminho(caminho)}"
    except json.JSONDecodeError as exc:
        return {}, f"JSON inválido em {exibir_caminho(caminho)}: {exc}"
    except (OSError, UnicodeError) as exc:
        return {}, f"não foi possível ler {exibir_caminho(caminho)}: {exc}"

    if isinstance(dados, dict):
        cargos = dados.get("cargos", [])
    elif isinstance(dados, list):
        cargos = dados
    else:
        return {}, "estrutura não reconhecida em cargos.json"

    mapa: dict[str, dict[str, Any]] = {}
    if isinstance(cargos, list):
        for cargo in cargos:
            if not isinstance(cargo, dict):
                continue
            cid = cargo.get("id")
            if isinstance(cid, str) and cid.strip():
                mapa[cid.strip()] = cargo
    elif isinstance(cargos, dict):
        for chave, cargo in cargos.items():
            if not isinstance(cargo, dict):
                continue
            cid = cargo.get("id") or chave
            if isinstance(cid, str) and cid.strip():
                mapa[cid.strip()] = cargo
    else:
        return {}, "campo 'cargos' inválido em cargos.json"

    if not mapa:
        return {}, "nenhum cargo com 'id' encontrado em cargos.json"
    return mapa, None


def comparar_metadados(
    res: Resultado,
    dados: dict[str, Any],
    cargos: dict[str, dict[str, Any]],
    erro_cargos: str | None,
) -> None:
    if erro_cargos:
        res.avisos.append(f"metadados não comparados: {erro_cargos}")
        res.metadados_ok = False
        return

    cargo_id = dados.get("cargo_id")
    if not isinstance(cargo_id, str) or not cargo_id.strip():
        return
    cargo_id = cargo_id.strip()

    cargo = cargos.get(cargo_id)
    if not isinstance(cargo, dict):
        res.avisos.append(f"cargo_id '{cargo_id}' não encontrado em cargos.json")
        res.metadados_ok = False
        return

    meta = cargo.get("caderno")
    if not isinstance(meta, dict):
        res.avisos.append(
            f"cargo '{cargo_id}' não possui metadados em 'caderno' no cargos.json"
        )
        res.metadados_ok = False
        return

    esperado = {
        "modulos": res.modulos,
        "licoes": res.licoes,
        "questoes": res.questoes,
        "flashcards": res.cards,
    }
    rotulos = {
        "modulos": "módulos",
        "licoes": "lições",
        "questoes": "questões",
        "flashcards": "flashcards",
    }

    inicio = len(res.avisos)
    for chave, atual in esperado.items():
        valor = meta.get(chave)
        if valor is None:
            res.avisos.append(f"metadados de cargos.json sem o campo '{chave}'")
            continue

        declarado = para_inteiro(valor)
        if declarado is None:
            res.avisos.append(
                f"metadado '{chave}' inválido em cargos.json: {valor!r}"
            )
        elif declarado != atual:
            res.avisos.append(
                f"metadado '{chave}' diz {declarado}, mas o caderno tem {atual} "
                f"({rotulos[chave]})"
            )

    if len(res.avisos) == inicio:
        res.metadados_ok = True
        res.metadados_detalhe = (
            f"{res.modulos} módulos, {res.licoes} lições, "
            f"{res.questoes} questões, {res.cards} flashcards"
        )
    else:
        res.metadados_ok = False


def descobrir_arquivos(argumentos: list[str]) -> list[Path]:
    if not argumentos:
        return sorted(DADOS.glob("caderno_*.json"))

    caminhos = []
    for argumento in argumentos:
        caminho = Path(argumento)
        if not caminho.is_absolute() and not caminho.exists():
            alternativo = BASE / caminho
            if alternativo.exists():
                caminho = alternativo
        caminhos.append(caminho)
    return caminhos


def imprimir_resultado(
    res: Resultado, dados: dict[str, Any] | None = None
) -> None:
    print()
    print(f"[{res.status}] {exibir_caminho(res.caminho)}")

    if isinstance(dados, dict):
        print(
            f"  Cargo: {texto_ou_traco(dados.get('cargo_id'))} | "
            f"slug: {texto_ou_traco(dados.get('slug'))}"
        )
        print(f"  Título: {texto_ou_traco(dados.get('titulo'))}")

    if res.contagens_disponiveis:
        print(
            "  Contagens: "
            f"{res.modulos} módulos | {res.licoes} lições | "
            f"{res.questoes} questões | {res.cards} cards | "
            f"{res.fontes} fontes"
        )
        print(
            "  Gabaritos: "
            + " | ".join(f"{letra}={res.gabaritos[letra]}" for letra in LETRAS)
        )
        if res.metadados_ok is True:
            print(f"  Metadados cargos.json: OK ({res.metadados_detalhe})")
        elif res.metadados_ok is False:
            print("  Metadados cargos.json: AVISO (veja abaixo)")
        elif dados is not None:
            print("  Metadados cargos.json: não verificados")

    if res.erros:
        print("  Erros:")
        for erro in res.erros:
            print(f"    ERRO: {erro}")

    if res.avisos:
        print("  Avisos:")
        for aviso in res.avisos:
            print(f"    AVISO: {aviso}")

    if not res.erros and not res.avisos:
        print("  Situação: OK")


def imprimir_resumo(resultados: list[Resultado]) -> None:
    total_ok = sum(1 for res in resultados if res.status == "OK")
    total_aviso = sum(1 for res in resultados if res.status == "AVISO")
    total_erro = sum(1 for res in resultados if res.status == "ERRO")
    total_erros = sum(len(res.erros) for res in resultados)
    total_avisos = sum(len(res.avisos) for res in resultados)

    print()
    print("Resumo")
    print(
        f"  Arquivos: {len(resultados)} | OK: {total_ok} | "
        f"Com avisos: {total_aviso} | Com erros: {total_erro}"
    )
    print(f"  Ocorrências: {total_erros} erros | {total_avisos} avisos")

    if any(res.contagens_disponiveis for res in resultados):
        modulos = sum(res.modulos for res in resultados)
        licoes = sum(res.licoes for res in resultados)
        questoes = sum(res.questoes for res in resultados)
        cards = sum(res.cards for res in resultados)
        fontes = sum(res.fontes for res in resultados)
        gabaritos = {
            letra: sum(res.gabaritos[letra] for res in resultados)
            for letra in LETRAS
        }
        print(
            "  Totais: "
            f"{modulos} módulos | {licoes} lições | {questoes} questões | "
            f"{cards} cards | {fontes} fontes"
        )
        print(
            "  Gabaritos: "
            + " | ".join(f"{letra}={gabaritos[letra]}" for letra in LETRAS)
        )


def main() -> int:
    configurar_saida()

    print("=" * 74)
    print("Validador de cadernos específicos — SP Águas 2026")
    print("Uso: python scripts/validar_cadernos.py [arquivo ...]")
    print("=" * 74)

    arquivos = descobrir_arquivos(sys.argv[1:])
    if not arquivos:
        print("\nERRO: nenhum arquivo dados/caderno_*.json encontrado.")
        return 1

    cargos, erro_cargos = carregar_cargos(CARGOS)
    resultados: list[Resultado] = []
    compartilhado = RegistroCompartilhado()

    for caminho in arquivos:
        resultado = Resultado(caminho)
        resultados.append(resultado)

        try:
            texto = caminho.read_text(encoding="utf-8-sig")
        except (OSError, UnicodeError) as exc:
            resultado.erros.append(f"não foi possível ler o arquivo: {exc}")
            imprimir_resultado(resultado)
            continue

        try:
            dados = json.loads(texto)
        except json.JSONDecodeError as exc:
            resultado.erros.append(f"JSON inválido: {exc}")
            imprimir_resultado(resultado)
            continue

        if not isinstance(dados, dict):
            resultado.erros.append("a raiz do JSON deve ser um objeto")
            imprimir_resultado(resultado)
            continue

        resultado.contagens_disponiveis = True
        validar_caderno(dados, resultado, compartilhado)
        comparar_metadados(resultado, dados, cargos, erro_cargos)
        imprimir_resultado(resultado, dados)

    imprimir_resumo(resultados)
    return 1 if any(res.erros for res in resultados) else 0


if __name__ == "__main__":
    sys.exit(main())
