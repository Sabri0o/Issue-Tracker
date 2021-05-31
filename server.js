const express = require('express')
const app = express()

require('dotenv').config()


// to reconize the request object as json request
app.use(express.json())
// to reconize the request object as array or a string
app.use(express.urlencoded({extended:true}))
// serving static files
app.use('/public',express.static(__dirname + "/public"));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/views/index.html')
})

app.listen(process.env.PORT || 8000,()=>{
    console.log('server is listening...')
})