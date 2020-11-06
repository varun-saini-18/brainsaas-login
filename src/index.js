//To import the express module related to server
const express = require('express')      

// To setup database
require('./db/mongoose')

// Importing various paths/routes/URL to the user
const userRouter = require('./routers/user')  
const cors = require('cors');



// Syntax to set port to localhost or given port(after deployment)
const app = express()    
app.use(cors());             
                 
const port = process.env.PORT || 3000               


// Method of express to recognise incoming request as JSON Object
app.use(express.json())                                

// Instructing to use other routes
app.use(userRouter)   
                            
                         

// To run server and to print the port in console
app.listen(port, () => {                               
    console.log('Server is up on port ' + port)         
})