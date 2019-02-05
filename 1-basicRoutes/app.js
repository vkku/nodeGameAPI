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

const app = express();
{
var recordId = null;
var points = null;
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keykNnQmC4xKDtDd0'}).base('appc2IoDG9qmF8sf6');
//var toBePoints;
// [START hello_world]
// Say hello!
app.get('/dzgame/:nick', (req, res) => {

	console.log('Start'); 
  base('dzPoints').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        console.log('Retrieved', record.get('Name')); //TODO : Comment out
       if(record.get('Name') == req.params.nick) {
	recordId = record.id;
       points = record.get('Points');
	console.log('Name : ' + record.get('Name') + ' id  : ' + recordId + ' Points : ' + points);
	}
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return;}
}), function () {

console.log(' Name & ID after retrieval end : ' + recordId + ' Points : ' + points);

var toBePoints =  parseInt(points) + 1;
console.log('To be Points : ' + points);
//var Points = "5";
var Points = toBePoints.toString();
console.log('Updating Points : ' + Points);
base('dzPoints').update('rec6EJlqjjPm8W57v', {
//	"Points": "5"
	Points
}, function(err, record) {
    if (err) { console.error(err); return; }
});

	toBePoints = 0;
	points = 0;
	recordId = null;
};
  res.status(200).send('Hello, ' + req.params.nick);
	console.log('End');
  
});
}
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
