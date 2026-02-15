
# Plano: Atualizar Hero, Sidebar colapsavel e "Ver tudo" com modal

## 1. Atualizar textos do Hero Section

**Arquivo:** `src/pages/Index.tsx`

Substituir o hero atual por:
- Titulo: "Deixe o seu video livre de direitos autorais com musicas atuais."
- Subtitulo: "Acesse agora a maior colecao de musicas e efeitos sonoros autenticos e emocionalmente impactantes para qualquer ocasiao."
- Adicionar 3 badges de destaque abaixo do subtitulo:
  - "+ de 1000 musicas"
  - "+ de 5000 efeitos sonoros"
  - "Atualizacoes todo mes"
- Manter o botao "Criar conta gratis"

---

## 2. Sidebar colapsavel com botao toggle

**Arquivos:** `src/components/layout/Sidebar.tsx`, `src/components/layout/MainLayout.tsx`

### Sidebar:
- Adicionar estado `collapsed` (boolean) controlado pelo `MainLayout`
- Quando colapsada: mostrar apenas icones (largura ~64px) em vez dos labels completos (largura 256px)
- Adicionar botao de toggle (icone de seta ou hamburger) no topo da sidebar para alternar entre aberta/fechada
- Animar a transicao com `transition-all duration-300`
- O logo mostra apenas o icone quando colapsada

### MainLayout:
- Gerenciar o estado `collapsed` e passar como prop para `Sidebar`
- Ajustar o `padding-left` do conteudo principal dinamicamente (`pl-64` vs `pl-16`)

---

## 3. "Ver tudo" abre modal/drawer com todas as opcoes

**Arquivos:** `src/components/audio/HorizontalScroll.tsx`, `src/pages/Index.tsx`

### HorizontalScrollSection:
- Transformar o link "Ver todos" em um botao que abre um Dialog/Sheet (drawer lateral ou modal)
- O modal mostra todas as categorias em grid (nao apenas scroll horizontal)
- Cada item continua sendo um `CategoryCard` clicavel que navega para a pagina filtrada

### Implementacao:
- Usar `Sheet` (drawer) do Radix UI que ja esta instalado
- O conteudo do drawer recebe os mesmos `children` mas renderizados em grid
- Adicionar prop `allItems` ao `HorizontalScrollSection` para passar os itens completos ao drawer

---

## Detalhes Tecnicos

| Arquivo | Mudanca |
|---------|---------|
| `src/pages/Index.tsx` | Novos textos do hero + badges de stats + passar items ao HorizontalScroll |
| `src/components/layout/Sidebar.tsx` | Aceitar prop `collapsed`, renderizar modo icone, botao toggle |
| `src/components/layout/MainLayout.tsx` | Estado `collapsed`, passar prop, ajustar padding |
| `src/components/audio/HorizontalScroll.tsx` | Botao "Ver tudo" abre Sheet com grid de todas as opcoes |
