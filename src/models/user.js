const mongoose = require('mongoose')                       //Importing Mongoose
const validator = require('validator')                     //Importing Validator
const bcrypt = require('bcryptjs')                         //Importing bcryptjs for encription of password
const jwt = require('jsonwebtoken')  

//Defining model
const userSchema = new mongoose.Schema({                   
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isLowercase(value)) {
                throw new Error('Entered username must be in lowercases!')
            }
        }
    },
    isVerified: { 
        type: Boolean,
        default: true 
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})


userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.verificationCode
    delete userObject.isVerified

    return userObject
}

// Function to generate authorisation token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// Function used during logging in a user
userSchema.statics.findByCredentials = async (name, password) => {
    const username = name
    const userByUsername = await User.findOne({ username })

    if (!userByUsername) {
        const email = name
        const userByEmail = await User.findOne({ email })
        if(!userByEmail)
        {
            throw new Error('User not found!')  
        }   
        const isMatch = await bcrypt.compare(password, userByEmail.password)

        if (!isMatch) {
            throw new Error('Password does not match!')
        }

        return userByEmail 
    }

    const isMatch = await bcrypt.compare(password, userByUsername.password)

    if (!isMatch) {
        throw new Error('Password does not match')
    }

    return userByUsername
}
 
// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})



const User = mongoose.model('User', userSchema)

module.exports = User