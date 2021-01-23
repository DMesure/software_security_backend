# Origin

https://www.dmesure.xyz

# Github repo frontend

https://github.com/DMesure/software_security_web_application.git

# Access control & security

Info: Access control to the REST API is done via an accestoken
Some resources are only available when authenticated (view later), this ensures that some calls to the API are shielded from being requested by unvalidated sources.

Auth0 was used as the identity provider, it has a setting where it uses a built-in layer that checks the user's new password against a list of the 10.000 most common passwords.

# Users & permissions

- Generic user: when logged in, can create products and update or delete his/her products.
- Admin user: can delete ALL recipes but cannot create or modify them, the admin role is purely for management purposes, if an admin wants to post his own recipes he should create a separate normal user account.

# Resources (operation & origin) --> if authorization is needed, operation will be marked with "(A)"

## Root

### /

OPTIONS, GET

---

## User

### /user

OPTIONS, GET (A)

---

### /users

OPTIONS, POST (A)

---

### /getUserData (gets all the data from user from auth0 & database)

OPTIONS, GET (A)

---

### /users/{id}

OPTIONS, DELETE (A)

---

## Recipe

### /recipes

OPTIONS, GET, POST (A)

---

### /recipes/{recipeId}

OPTIONS, GET, PUT (A), DELETE (A)

---
