const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
require('dotenv').config();

const { PORT = 5000 } = process.env;

const checkJwt = jwt({
    //Signing key providen
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    //Audience & issuer validaten
    audience: `${process.env.AUTH0_AUDIENCE}:${PORT}`,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,

    algorithms: ["RS256"],
});

app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

app.get('/', (req, res) => { res.send("This is Damien's backend for software security web application") });

const recipes = [
    {
        id: 1,
        name: "Instant frozen berry yogurt",
        description: "Three ingredients and two minutes is all you need to whip up this low-fat, low-calorie yogurt, which is ideal for eating after exercise",
        preparationtime: "2min",
        src: 'frozenyoghurt.png'
    },
    {
        id: 2,
        name: "Quick prawn, coconut & tomato curry",
        description: "Make curry in a hurry with this speedy recipe - a fragrant spice pot ready in half an hour",
        preparationtime: "30min",
        src: 'prawn.png'
    },
    {
        id: 3,
        name: "Chorizo bean burgers",
        description: "Combine Spanish sausage with the traditional pork variety for a pulse-packed, spicy burger",
        preparationtime: "26min",
        src: 'chorizoburger.png'
    },
    {
        id: 4,
        name: "Easy teriyaki chicken",
        description: "Try this easy, sticky Asian-style teriyaki chicken for a speedy weeknight supper – it takes just 20 minutes to make! Serve it with sticky rice and steamed greens",
        preparationtime: "20min",
        src: 'teriyakichicken.png'
    },
    {
        id: 5,
        name: "Pasta salad with tuna, capers & balsamic dressing",
        description: "Update tuna pasta salad by skipping the mayo and adding balsamic vinegar, olive oil, colourful tomatoes and celery",
        preparationtime: "20min",
        src: 'pastatunasalad.png'
    },
]

app.get('/recipes', checkJwt, (req, res) => {
    console.log("Sent all recipes");
    res.send(recipes);
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//yeet