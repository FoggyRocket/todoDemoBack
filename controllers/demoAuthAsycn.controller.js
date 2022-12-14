//importa el modelo que voy a utilizar v1
const User = require("../models/User.model");
const mongoose = require("mongoose");
//Para el password
const bcryptjs = require("bcryptjs");
const { clearRes, createJWT } = require("../utils/utils")


exports.signupProcess = async (req, res, next) => {
    const { role, email, password, confirmPassword, ...restUser } = req.body;

    try{
        if (!email.length || !password.length || !confirmPassword.length) return res.status(400).json({ errorMessage: "No debes mandar campos vacios!" });
        if (password != confirmPassword) return res.status(400).json({ errorMessage: "La contraseñas no son iguales!" });
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        if (!regex.test(password)) return res.status(400).json({errorMessage:"La contraseña neceista tener almenos una minuscula, una mayuscula y un numero"})

        const found = await User.findOne({ email })
        if(found) return res.status(400).json({ errorMessage: "Ese correo ya fue tomado!" });

        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password,salt);

        const user = await User.create({ email,password: hashedPassword,...restUser,});
        const [header, payload, signature] = createJWT(user);
        res.cookie("headload", `${header}.${payload}`, {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            sameSite: "strict",
            secure: false,
        });

        res.cookie("signature", signature, {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            sameSite: "strict",
            secure: false,
        });
        const newUser = clearRes(user.toObject());
        res.status(201).json({ user: newUser });
    }catch(error){

        if (error instanceof mongoose.Error.ValidationError) return res.status(400).json({ errorMessage: error.message });
        
        if (error.code === 11000) return res.status(400).json({ errorMessage: "El correo electronico ya esta en uso"});
        
        return res.status(500).json({ errorMessage: error.message });
    }
};


exports.loginProcess = async (req, res, next) => {
    const {email, password} = req.body
    try{
        if(!email || !password || !email.length || !password.length ) return res.status(400).json({ errorMessage: "No debes mandar campos vacios!" }); 

        const user = await User.findOne({email})
        if(!user)return res.status(400).json({ errorMessage: "Credenciales invalidas!" });

        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        if (!regex.test(password)) return res.status(400).json({errorMessage:"La contraseña neceista tener almenos una minuscula, una mayuscula y un numero"})
                
         //bcryptjs.compareSync(password,user.password) solo retorna 
        if(!bcryptjs.compareSync(password,user.password)) return res.status(400).json({ errorMessage: "Credenciales invalidas!" })

        const [header,payload,signature] = createJWT(user)
        res.cookie("headload", `${header}.${payload}`, {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            sameSite: "strict",
            secure: false,
        });

        res.cookie("signature", signature, {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            sameSite: "strict",
            secure: false,
        });
        //vamos  limpiar el responde del usuario
        const newUser = clearRes( user.toObject() );
        res.status(200).json({user:newUser})

    }catch(error){
        if (error instanceof mongoose.Error.ValidationError) return res.status(400).json({ errorMessage: error.message });
        if (error.code === 11000) return res.status(400).json({errorMessage: "El correo electronico ya esta en uso"});
        return res.status(500).json({ errorMessage: error.message });
    }
}; 


exports.logoutProcess = (req,res,next)=>{
    res.clearCookie('headload');
    res.clearCookie('signature')
    res.status(200).json({successMessage:"Saliste todo chido!!! regresa pronto :D "})
}