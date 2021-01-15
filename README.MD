# Origin

https://www.dmesure.xyz

# Users & permissions

- Generic user: when logged in, can create products and update or delete his/her products.
- Admin user: can delete ALL recipes but cannot create or modify them.

# Resources (operation & origin) --> if authorization is needed, operation will be marked with "(A)"

## Root

### /

OPTIONS, GET

## User

### /user

OPTIONS, GET (A)

### /users

OPTIONS, POST (A)

### /users/{id}

OPTIONS, DELETE (A)

## Recipe

### /recipes

OPTIONS, GET, POST (A)

### /recipes/{recipeId}

OPTIONS, GET, PUT (A), DELETE (A)
