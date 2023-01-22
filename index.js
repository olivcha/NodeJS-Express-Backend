const Joi = require('joi');
const express = require('express');
const app = express();

// middleware function
app.use(express.json());

const genres = [
    { id: 1, name: 'science finction' },
    { id: 2, name: 'comedy' },
    { id: 3, name: 'rom-com' },
    { id: 4, name: 'horror' },
    { id: 5, name: 'action' }
];

// middleware function - terminates the request by sending a response or forwarding to another middleware
app.get('/', (req, res) => {
    res.send('Home Page');
});

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.post('api/genres', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The page you are trying to reach was not found.');

    const {error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    res.send(genre);
});

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(genre);
}

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The page you are trying to reach was not found.');
    res.send(genre);
});

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.delete('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The page you are trying to reach was not found.');

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(genre);
});