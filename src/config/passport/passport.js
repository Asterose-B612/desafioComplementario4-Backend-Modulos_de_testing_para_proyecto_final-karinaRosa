//importo la estrategia local
import local from 'passport-local'

import passport from 'passport'

//cuando estoy trabajando con estrategia local importo userModel, consulto usuarios (user.js)
import { userModel } from '../../models/user.js'
//importo bcrypt (el hasheo y validacion)
import { createHash, validatePassword } from '../../utils/bcrypt.js'