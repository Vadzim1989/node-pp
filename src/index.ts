import express from 'express';

const app = express();
const port = 3003;

app.use(express.json());

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
}

const db = {
    courses: [
        { id: 1, title: 'Frontend' },
        { id: 2, title: 'Backend' },
        { id: 3, title: 'DevOps' },
        { id: 4, title: 'QA' },
    ]
}

app.get('/courses', (req, res) => {
    const { id, title } = req.query || {};
    if (id || title) {
        const course = id
            ? db.courses.find(c => c.id === Number(id))
            : db.courses.filter(c => c.title.toLocaleLowerCase().indexOf((title as string).toLocaleLowerCase()) > -1);
        
        if (course) {
            return res.json(course);
        } else {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND);
        }
    } else {
        res.json(db.courses);
    }
});

app.post('/courses', (req, res) => {
    if (!req.body.title) {
        return res.sendStatus(HTTP_STATUS.BAD_REQUEST);
    }
    const createCourse = {
        id: Math.max(...db.courses.map(c => c.id)) + 1,
        title: req.body.title
    };
    db.courses.push(createCourse);
    res.status(HTTP_STATUS.CREATED).json(createCourse);
});

app.delete('/courses/:id', (req, res) => {
    const course = db.courses.find(c => c.id === Number(req.params.id));
    if (course) {
        db.courses = db.courses.filter(c => c.id !== Number(req.params.id));
        return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } else {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
});

app.put('/courses/:id', (req, res) => {
    if (!req.body.title) {
        return res.sendStatus(HTTP_STATUS.BAD_REQUEST);
    }
    const course = db.courses.find(c => c.id === Number(req.params.id));
    if (course) {
        const index = db.courses.indexOf(course);
        db.courses[index] && (db.courses[index].title = req.body.title);
        return res.status(HTTP_STATUS.OK).json(db.courses[index]);
    } else {
        return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});