import express from 'express'

const server = express()
server.listen(3000)

server.use(express.json())
//Query params = ?nome=NodeJS
//Route Params = /curso/2 
//Request Body = {nome: 'NodeJS', tipo: 'Backend'}



//CRUD CREATE READ UPDATE DELETE
const cursos = ['Node JS', 'JavaScript', 'React Native']

//MIDDLEWARE GLOBAL
server.use((req, res, next)=>{
  console.log(`URL CHAMADA: ${req.url}`)
  return next()
})

function checkCurso(req, res, next){
  if(!req.body.name){
    return res.status(400).json({error: "Nome do cursos é obrigatorio"})
  }
  return next()
}

function checkIndexCurso(req, res, next){
  const curso = cursos[req.params.index]
  if(!curso){
    return res.status(400).json({error: "O curso não existe"})
  }
  return next()
}

server.get('/cursos', (req, res) =>{
  return res.json(cursos)
})

// req representa os dados da aplicaçao do body da requisiçao
// res representa os dados para retornar para o front end
server.get('/cursos/:index', checkIndexCurso, (req, res) => {
  const { index } = req.params
  return res.json(cursos[index])
})


//criando um novo curso
server.post('/cursos', checkCurso, (req, res)=>{
  const {name} = req.body
  cursos.push(name)

  return res.json(cursos)
})


//atualizando um curso
server.put('/cursos/:index', checkIndexCurso, checkCurso, (req, res) =>{
  const {index} = req.params
  const {name} = req.body

  cursos[index] = name
  return res.json(cursos)
})

//excluindo algum curso
server.delete('/cursos/:index', checkIndexCurso, (req, res) =>{
  const {index} = req.params
  cursos.splice(index, 1)
  return res.json(cursos)
})