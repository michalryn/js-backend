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
    try {
        const data = await movieService.search(req.query.type, req.query.searchText, req.query.page)
        res.status(200).send(data);
    } catch (error) {
    }
});

app.get("/trending", async (req, res) => {
    const data = await movieService.trending(req.query.page)
    //console.log(data)
    res.status(200).send(data);
});

app.get("/movies", async (req, res) => {
    const data = await movieService.movies(req.query.page, req.query.genres)
    //console.log(req.query.genres)
    res.status(200).send(data);
});

app.get("/genres", async (req, res) => {
    const data = await movieService.genres(req.query.genre)
    res.status(200).send(data)
})

app.get("/series", async (req, res) => {
    const data = await movieService.series(req.query.page, req.query.genres)
    res.status(200).send(data);
});

app.get("/details", async (req, res) => {
    const data = await movieService.details(req.query.mediaType, req.query.id)
    res.status(200).send(data);
})

app.get("/fetchVideo", async (req, res) => {
    const data = await movieService.fetchVideo(req.query.mediaType, req.query.id)
    res.status(200).send(data);
})

app.listen(7777, () => console.log("Server address http://localhost:7777"));
