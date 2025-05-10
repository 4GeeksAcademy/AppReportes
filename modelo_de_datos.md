[Ir al diagrama](https://app.quickdatabasediagrams.com/#/d/PViAjQ)
```DBML
Users
-
id int pk 
username string
email string
password string
is_active boolean

Reporte
-
id int pk FK -< Comments.reporte_id
text string
author_id int FK >- Users.id

Media
-
id int pk
type enum
imagen string
reporte_id FK >- Reporte.id

Comments
-
id int pk
comment_text string
author_id string FK >- Users.id
reporte_id string

Favorites
-
id int pk 
user_id int FK >- Users.id
reporte_id int FK >- Reporte.id

Votes
-
id int pk 
user_id int FK >- Users.id
reporte_id int FK >- Reporte.id
is_upvote boolean

```

Usuario:
- Un usuario puede crear muchos reportes.
- Un usuario puede marcar muchos favoritos.
- Un usuario puede votar muchos reportes.
- Un usuario puede escribir muchos comentarios.

Reportes: 
- Cada reporte tiene un solo autor.
- Cada reporte puede tener muchas imágenes.
- Cada reporte puede tener muchos votos.
- Cada reporte puede tener muchos comentarios.
- Cada reporte puede estar en muchos favoritos.

Comentarios:
- Cada comentario lo escribe un usuario en un reporte.

Favoritos: 
- Un usuario puede tener muchos reportes favoritos.
- Un reporte puede ser favorito de muchos usuarios.
- Relación muchos a muchos con tabla intermedia.

Votos: 
- Un usuario puede votar muchos reportes.
- Cada usuario puede votar una sola vez cada reporte.
- Sirve para métricas de popularidad de un reporte.