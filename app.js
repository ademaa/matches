//requirs packages installed from npm
const express  = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// declare app to use express
const app = express();
//use public folder like css and javascript
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
//use ejs  from views folder
app.set("view engine",'ejs');
// connect mongoose and use  matchDB
mongoose.connect("mongodb://localhost:27017/matchDB",{useNewUrlParser: true, useUnifiedTopology: true});
//make schema for match collection
const matchSchema = {
  homeTeam:String,
  awayTeam:String,
  startTime:Date,
  endTime:Date,
  duration:Number,
  homeTeamScore:Number,
  awayTeamScore:Number,
  isActive:Boolean,
  league:String
}
// instialize buitin date to use it with startTime and endTime in schema
const d = new Date;
//create match collection
const Match = mongoose.model("Match",matchSchema);
// create documents in match collections
const matchOne = new Match({
  homeTeam:'ahly',
  awayTeam:'zamalek',
  startTime:d.setHours(8,[30]),
  endTime:d.setHours(10,[00]),
  duration:90,
  homeTeamScore:40,
  awayTeamScore:35,
  isActive:true,
  league:"egyption league"
});
const matchTwo = new Match({
  homeTeam:'bayrn',
  awayTeam:'barcelona',
  startTime:d.setHours(6,[30]),
  endTime:d.setHours(8,[00]),
  duration:90,
  homeTeamScore:50,
  awayTeamScore:51,
  isActive:true,
  league:"europ league"
});
const matchThree = new Match({
  homeTeam:'psg',
  awayTeam:'real madrid',
  startTime:d.setHours(4,[00]),
  endTime:d.setHours(5,[30]),
  duration:90,
  homeTeamScore:40,
  awayTeamScore:40,
  isActive:true,
  league:"europ league"
});
// store created documents in array
const defaultMatches = [matchOne,matchTwo,matchThree];

app.route('/')
.get((req,res)=>{
  //found if mtach is empty or not then insert defaultMatches array to it
  Match.find({},(err,foundMatches)=>{
    if(foundMatches.length === 0){
      Match.insertMany({defaultMatches},(err)=>{
        if(!err){
          console.log("inserted successfully");
        }else{
          console.log(err);
        }
      });
      res.redirect("/");
    } else {
      res.render("matches",{newMatchs:foundMatches});
    }
  });
});
app.post("/oneTeam",(req,res)=>{
  const theTeam = req.body.teamSearch;
  Match.findOne({homeTeam:theTeam},(err,foundTeam)=>{
    if(foundTeam){
      res.render("team",{match:foundTeam});
    } else{
      Match.findOne({awayTeam:theTeam},(err,anotherTeam)=>{
        if(!err){
          res.render("team",{match:anotherTeam});
        }else{
          console.log(err);
        }
      });
    }
  });
});

app.listen('3000',()=>{
  console.log('server starts successfully at port 3000!');
})
