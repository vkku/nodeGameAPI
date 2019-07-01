// Copyright 2018, Google LLC.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');

var cors = require('cors')

const app = express();
var users = []
var user = {};
var recordId = null;
var points = null;
var limReached = [];
var retmsg = 'I returned a trip from the Internet - Ralph ';
var securedPoint = false;
var dateLim = null;
var Airtable = require('airtable');


app.use(cors())

var base = new Airtable({
  apiKey: 'keykNnQmC4xKDtDd0'
}).base('appc2IoDG9qmF8sf6');
//var toBePoints;
// [START hello_world]
// Say hello!
app.get('/dzgame/:nick', (req, res) => {

  retrieveIdAndPoints(req.params.nick, updatePoints);

  //if(securedPoint){
  //  retmsg = "Ahoy ! I'm the captain for the day !";
  //}
  //res.status(200).send(retmsg + '\n' + req.params.nick);
  res.status(200).send(JSON.stringify(users));
  users.length = 0;
  console.log('End');

});
// [END hello_world]

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;

function retrieveIdAndPoints(nick, callback) {
  console.log('Start');
  base('dzPoints').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 3,
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
      //console.log('Retrieved', record.get('Name'));
      if (record.get('Name') == nick) {
        recordId = record.id;
        points = record.get('Points');
        if( null != record.get('date'))
        dateLim = record.get('date').toString();
        user.nick = nick;
        user.score = points;
        users.push(user);
        console.log('Name : ' + record.get('Name') + ' id  : ' + recordId + ' Points : ' + points + ' date  : ' + dateLim);
      }
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

  }, function done(err) {
    callback();
    if (err) {
      console.error(err);
      return;
    }
  });
}


function updatePoints() {
  var currDate = new Date();
  var currHour = currDate.getHours();
  var currMin = currDate.getMinutes();
  var dateStr = currDate.getDate().toString();
  if (!(currHour && currMin) && dateLim != dateStr) {
  var toBePoints = parseInt(points) + 1;
  var Points = toBePoints.toString();
  console.log('Updating Points : ' + Points);
    base('dzPoints').update(recordId, {
      Points,
      "date": dateStr
    }, function(err, record) {
      if (err) {
        console.error(err);
        return;
      }
    });
    securedPoint = true;
  }

  toBePoints = 0;
  points = 0;
  recordId = null;

}

function refreshRecords(nick){
  retrieveIdAndPoints(nck, null);
}