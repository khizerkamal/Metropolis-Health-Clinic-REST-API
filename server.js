const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' })
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
mongoose.connect(DB,{
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log('DB Connected Successfully!'))

const port = process.env.PORT || 2000
app.listen(port, () => console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`))