const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
require('dotenv').config();
const recipes = require('./recipes');
const users = require('./users');

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
    audience: `${process.env.AUTH0_AUDIENCE}`,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,

    algorithms: ["RS256"],
});

app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, "
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.param("recipeId", (req, res, next, id) => {
    req.id = id;
    next();
});

app.param("userId", (req, res, next, id) => {
    req.userId = id;
    next();
});

app.get('/', (req, res) => { res.send("This is Damien's backend for software security web application") });

/*MIDDLEWARE*/
const getById = (req, res, next) => {
    if (req.user) {
        users.getById(req.user).then((user_id) => {
            req.caller_id = user_id;
            next();
        });
    } else {
        res.status(403).end();
    }
};

const isOwner = (req, res, next) => {
    if (req.userId && req.userId === req.caller_id) {
        next();
    } else if (req.id) {
        recipes
            .getCreator(req.id)
            .then((owner_id) => {
                if (owner_id === req.caller_id) {
                    next();
                } else {
                    res.status(403).end();
                }
            })
            .catch((err) => res.status(404).end());
    } else {
        res.status(403).end();
    }
};

const isOwnerOrAdmin = (req, res, next) => {
    users.isAdmin(req.caller_id).then((isAdmin) => {
        if (!isAdmin) {
            recipes
                .getCreator(req.id)
                .then((owner_id) => {
                    if (owner_id === req.caller_id) {
                        next();
                    } else {
                        res.status(403).end();
                    }
                })
                .catch(() => res.status(404).end());
        } else {
            next();
        }
    });

};

const isAdmin = (req, res, next) => {
    req.isAdmin = true;
    users.isAdmin(req.caller_id).then((isAdmin) => {
        req.isAdmin = isAdmin;
        next();
    });
};


/*RECIPES*/
app.get('/recipes', (req, res) => {
    recipes.get().then(result => res.send(result)).catch(err => res.status(404).end());
})

app.post("/recipes", checkJwt, getById, isAdmin, (req, res) => {
    if (!req.isAdmin) {
        recipes.create(req.body).then((recipeId) => res.status(201).location(`/recipes/${recipeId}`).send())
            .catch((err) => res.status(400).end())
    } else {
        res.status(403).end();
    }
})

app.all("/recipes", (req, res) => {
    res.set("Allow", "GET, POST, OPTIONS");
    res.status(405).end();
})

app.get('/recipes/:recipeId', (req, res) => {
    recipes.getById(req.id).then(result => res.send(result)).catch(err => res.status(404).end());
})

app.put("/recipes/:recipeId", checkJwt, getById, isOwner, (req, res) => {
    recipes.update(req.body, req.id).then((result) => res.status(200).end())
        .catch((err) => res.status(404).end())
})

app.delete("/recipes/:recipeId", checkJwt, getById, isOwnerOrAdmin, (req, res) => {
    recipes.destroy(req.id).then((result) => res.end()).catch((err) => res.status(400).end());
})

app.all("/recipes/:recipeId", (req, res) => {
    res.set("Allow", "GET, PUT, OPTIONS, DELETE");
    res.status(405).end();
})

/*USERS*/
app.get('/user', checkJwt, (req, res) => {
    users.getById(undefined, req.user).then(result => res.send(result)).catch(err => res.status(404).end());
})

app.all("/user", (req, res) => {
    res.set("Allow", "GET, OPTIONS");
    res.status(405).end();
})

app.post('/users', checkJwt, (req, res) => {
    users.create(req.user)
        .then(result => res.status(201).location(`/users/${res}`).send())
        .catch(err => res.status(400).end());
})

app.all("/users", (req, res) => {
    res.set("Allow", "POST, OPTIONS");
    res.status(405).end();
})

app.delete('/users/:userId', checkJwt, getById, isOwner, (req, res) => {
    users.destroy(req.caller_id)
        .then(result => res.send())
        .catch(err => res.status(400).end());
})

app.all("/users/:userId", (req, res) => {
    res.set("Allow", "DELETE, OPTIONS");
    res.status(405).end();
})


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));