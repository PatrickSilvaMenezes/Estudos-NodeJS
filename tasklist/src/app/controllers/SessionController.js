import jwt from 'jsonwebtoken'
import User from "../models/User";
import auth from '../../config/auth';
class SessionController{
  async store(req, res){
    const {email, password} = req.body

    //Verificando se esse email existe
    const user = await User.findOne({where: {email}})
    if(!user){
      return res.status(401).json({error: 'Usuário nao existe'})
    }

    //verificar se a senha nao bate
    if(!(await user.checkPassword(password))){
      return res.status(401).json({error: 'Senha incorreta'})
    }

    const {id, name} = user

    return res.json({
      user:{
        id,
        name, 
        email,
      },
      token: jwt.sign({id},auth.secret,{
        expiresIn: auth.expiresIn,
      })
    })  
  }
  
}


export default new SessionController()