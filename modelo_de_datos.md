[Ir al diagrama](https://app.quickdatabasediagrams.com/#/d/PViAjQ)
```DBML
Users
-
id int pk 
username varchar(50)
email varchar(120)
password varchar
is_active boolean

Reporte
-
id int pk FK -< Comments.post_id
text varchar(120)
author_id int FK >- Users.id

Media
-
id int pk
type enum(50)
imagen varchar(120)
post_id FK >- Reporte.id

Comments
-
id int pk
comment_text varchar(50)
votos boolean
author_id varchar(120) FK >- Users.id
post_id varchar

Favorites
-
id int pk 
user_id int FK >- Users.id
reporte_id int FK >- Reporte.id

```