# Origin

https://www.dmesure.xyz

# Github repo naar frontend

https://github.com/DMesure/software_security_web_application.git

# Toegangscontrole

Ter info: toegangscontrole tot de REST API gebeurt adhv accestoken

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
