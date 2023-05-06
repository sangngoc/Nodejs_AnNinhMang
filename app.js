const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require("mongoose");
var mongo = require('mongodb');




mongoose.connect('mongodb+srv://mthuan:Aa123456@clusterexchangedocument.q1tjwno.mongodb.net/AnNinhMang?retryWrites=true&w=majority',
  {
    useNewUrlParser: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const KeysSchema = new mongoose.Schema({
    key: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      default: "",
    },
    isCall: {
        type: Boolean,
        default: false,
    },
    timeCall: {
        type: String,
        default: "",
      }
  });
  
const Keys = mongoose.model("Keys", KeysSchema);

// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Hello, world!'}
];

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});

app.post('/save',async (req,res)=>{
   
    const newKey = {
        key:req.body.key,
        createdAt:Math.floor(new Date().getTime() / 1000),
        isCall:false,
        timeCall:''
    }

    const key = new Keys(newKey);
    try {
        const saveKey = await key.save();
        res.send(saveKey._id);
      } catch (error) {
        res.status(500).send(error);
    }

})

app.post('/valid',async (req,res)=>{
  console.log(req.body);
  const id = req.body.id;
  var o_id = new mongo.ObjectId(id);
  
  const keydb = await Keys.findById(o_id)
  .then((doc) => {
    const epochLocal = Math.floor(new Date().getTime() / 1000);
    const epochUser = Math.floor(doc.createdAt);
    const diff = (epochLocal - epochUser);
    console.table(diff)
    if(diff > 60){
      res.status(500).send()
    }
    else{
      res.status(200).send(doc.key)
    }

  })
  .catch((err) => {
    console.log(err)
  });
})

// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});
