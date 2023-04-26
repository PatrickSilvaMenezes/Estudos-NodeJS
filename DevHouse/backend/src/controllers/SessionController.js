// metodos: index, show, update, store, destroy

/*
 * index: listagem de sessoes
 * store: criar uma sessao
 * show: quando queremos listar uma unica sessao
 * update: quando queremos alterar alguma sessao
 * destroy: quando queremos deletar uma sessao
 *
 * */

import * as Yup from 'yup';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    });

    const { email } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    // verificando se esse usuário ja existe
    let user = await User.findOne({ email });

    // se nao cria uma sessao
    if (!user) {
      user = await User.create({ email });
    }
    return res.json(user);
  }
}

export default new SessionController();
