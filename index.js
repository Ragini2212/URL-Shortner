const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');

//create express app
const app = express();

//parse JSON request bodies
app.use(express.json());

//serve static files from the public directory
app.use(express.static('public'));
console.log("connecting")
//connect to Mongodb
mongoose.connect('mongodb://localhost:27017/url-shortener',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
});
console.log("connected")
//Define URL schema
const urlSchema = new mongoose.Schema({
    shortid: { type: String, default: shortid.generate },
    originalUrl: String,
});

//create url model
const Url = mongoose.model('Url', urlSchema);

//Redirect to the original url when a short url is visited
app.get('/:shortId', async (req, res) => {
    try{
        const url = await Url.findOne({ shortid: req.params.shortId });
        if(url){
            return res.redirect(url.originalUrl);
        }else{
            return res.status(404).json('URL not found');
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json('Server error');
    }
});

//create a new short URL
app.post('/shorten', async(req, res) => {
    try{
        const { originalUrl } = req.body;
        const url = new Url({ originalUrl});
        await url.save();
        return res.json(url);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Server error');
    }
});

//start the server
const port = 3000;
app.listen(port, () => {
    console.log('Server is running on the http://localhost:${port}');
});



