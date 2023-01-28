import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import JSON5 from 'json5'
import * as movieService from './movieService.js'
import dotenv from "dotenv"

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '300kb' }));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/search", async (req, res) => {
    console.log(req.query.name)
    const data = await movieService.search(`${req.query.name}`)
    res.status(200).send(data);
});

app.post("/recordings", (req, res) => {
    fs.readFile("./db.json", 'utf-8', (err, recordingsJSON) => {
        if (err) {
            res.status(400).send("Error while adding the recording to the database");
        }
        else {
            const recordings=JSON5.parse(recordingsJSON);
            if(recordings.length == 0) {
                fs.writeFile("./db.json", JSON.stringify(req.body), err => {
                    if (err) {
                        res.status(400).send("Error while adding the recordings to the database");
                    }
                    else {
                        res.status(201).send("Recordings added successfully.");
                    }
                })
            }
            else {
                res.status(201).send("File db.json is not empty.");
            }
        }
    })
});

app.get("/recordings", (req, res) => {
    console.log("get/recordings");
    fs.readFile("./db.json", 'utf-8', (err, recordingsJSON) => {
        if (err) {
            res.status(500).send("Error while getting the recordings from the database")
        }
        else {
            const recordings=JSON5.parse(recordingsJSON);

            res.status(200).send(recordings)
        }
    })
})

app.post("/recording", (req, res) => {
    fs.readFile("./db.json", 'utf-8', (err, recordingsJSON) => {
        if (err) {
            res.status(400).send("Error while adding the recording to the database");
        }
        else {
            const recordings=JSON5.parse(recordingsJSON);
            recordings.push(req.body);
            var newList = JSON.stringify(recordings);
            fs.writeFile('./db.json', newList, err => {
                if (err) {
                    console.log("Error writing file in POST /recording: "+ err);
                    res.status(500).send('Error writing file db.json');
                } else {
                    res.status(201).send(req.body);
                    console.log("Successfully wrote file db.json and added new recording with index = " + req.body.id);
                }
            });
        }
    })
});

app.put('/recording/:index', (req, res) => {
    fs.readFile('./db.json', 'utf8', (err, recordingsJson) => {
        if (err) {
            console.log("File read failed in PUT /recording/" + req.params.index+": "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var recordings = JSON.parse(recordingsJson);
        var recordingg = recordings.find(recordingtmp => recordingtmp.id == req.params.index);
        if (!recordingg) {
            recordings.push(req.body);
            var newList = JSON.stringify(recordings);
            fs.writeFile('./db.json', newList, err => {
                if (err) {
                    console.log("Error writing file in PUT /recording/" + req.params.index+": "+err);
                    res.status(500).send('Error writing file db.json');
                } else {
                    res.status(201).send(req.body);
                    console.log("Successfully wrote file db.json and added new recording with index = " + req.body.id);
                }
            });
        } else {
            for (var i = 0; i < recordings.length; i++) {
                if (recordings[i].id == recordingg.id) {
                    recordings[i] = req.body;
                }
            }
            var newList = JSON.stringify(recordings);
            fs.writeFile('./db.json', newList, err => {
                if (err) {
                    console.log("Error writing file in PUT /recording/" + req.params.index+": "+ err);
                    res.status(500).send('Error writing file db.json');
                } else {
                    res.status(200).send(req.body);
                    console.log("Successfully wrote file db.json and edit recording with old index = " + req.params.index);
                }
            });
        }
    });
});

app.delete('/recording/:index', (req, res) => {
    fs.readFile('./db.json', 'utf8', (err, recordingsJson) => {
        if (err) {
            console.log("File read failed in DELETE /recordings: "+ err);
            res.status(500).send('File read failed');
            return;
        }
        var recordings = JSON.parse(recordingsJson);
        var recordingIndex = recordings.findIndex(recordingtmp => recordingtmp.id == req.params.index);
        if (recordingIndex != -1) {
            recordings.splice(recordingIndex, 1);
            var newList = JSON.stringify(recordings);
            fs.writeFile('./db.json', newList, err => {
                if (err) {
                    console.log("Error writing file in DELETE /recordings/" + req.params.index+": "+ err);
                    res.status(500).send('Error writing file db.json');
                } else {
                    res.status(204).send();
                    console.log("Successfully deleted recording with index = " + req.params.index);
                }
            });
        } else {
            console.log("recording by index = " + req.params.index + " does not exists");
            res.status(500).send('recording by index = ' + req.params.index + ' does not exists');
            return;
        }
    });
});

app.listen(7777, () => console.log("Server address http://localhost:7777"));

//node -r esm server.js