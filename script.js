// Atividade 2 - Estados e cidades com a API do IBGE
// Aluno(a): Mateus Afonso da Cunha Leite

const selectEstado = document.getElementById('estado')
const selectCidade = document.getElementById('cidade')
const qtdCidades = document.getElementById('qtdCidades')
const filtroCidade = document.getElementById('filtroCidade')
const resumo = document.getElementById('resumo')

const URL_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'

// guarda a lista completa de cidades do estado escolhido (usada no filtro)
let listaCidades = []

// 1) Carregar os estados ao abrir a pagina
function carregarEstados() {
    fetch(URL_ESTADOS)
        .then(resposta => resposta.json())
        .then(estados => {
            console.log(estados)
            selectEstado.innerHTML = '<option value="">Selecione o estado</option>'

            estados.forEach(estado => {
                const option = document.createElement('option')
                option.value = estado.sigla
                option.textContent = estado.nome
                selectEstado.appendChild(option)
            })
        })
        .catch(() => {
            selectEstado.innerHTML = '<option value="">Erro ao carregar estados</option>'
        })
}

// preenche o select de cidades com a lista recebida
function preencherCidades(cidades) {
    selectCidade.innerHTML = '<option value="">Selecione a cidade</option>'

    cidades.forEach(cidade => {
        const option = document.createElement('option')
        option.value = cidade.nome
        option.textContent = cidade.nome
        selectCidade.appendChild(option)
    })
}

// 2) Carregar as cidades quando o estado mudar
selectEstado.addEventListener('change', () => {
    const uf = selectEstado.value
    resumo.textContent = ''
    filtroCidade.value = ''

    if (uf === '') {
        selectCidade.innerHTML = '<option value="">Escolha um estado primeiro</option>'
        selectCidade.disabled = true
        filtroCidade.disabled = true
        qtdCidades.textContent = ''
        return
    }

    selectCidade.innerHTML = '<option value="">Carregando...</option>'
    selectCidade.disabled = true
    filtroCidade.disabled = true
    qtdCidades.textContent = ''

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(resposta => resposta.json())
        .then(cidades => {
            // ignora a resposta se o usuario ja trocou de estado
            if (selectEstado.value !== uf) return

            listaCidades = cidades
            preencherCidades(cidades)
            selectCidade.disabled = false
            filtroCidade.disabled = false
            qtdCidades.textContent = `${selectEstado.options[selectEstado.selectedIndex].text} tem ${cidades.length} cidades.`
        })
        .catch(() => {
            selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>'
            qtdCidades.innerHTML = '<span class="erro">Não foi possível carregar as cidades.</span>'
        })
})

// Desafio extra: filtrar as cidades enquanto o usuario digita
filtroCidade.addEventListener('input', () => {
    const termo = filtroCidade.value.trim().toLowerCase()
    const filtradas = listaCidades.filter(cidade => cidade.nome.toLowerCase().includes(termo))

    preencherCidades(filtradas)
    if (filtradas.length === 1) selectCidade.value = filtradas[0].nome
})

// 3) Enviar o formulario
document.getElementById('formInscricao').addEventListener('submit', (evento) => {
    evento.preventDefault() // impede a pagina de recarregar

    const nome = document.getElementById('nome').value.trim()
    const cidade = selectCidade.value
    const uf = selectEstado.value

    resumo.textContent = `${nome}, de ${cidade}/${uf}, inscrito com sucesso`
})

carregarEstados()
