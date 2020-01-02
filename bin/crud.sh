curl -XGET "127.0.0.1:8080/books/init" -H 'Content-Type: application/json'

curl -XGET "127.0.0.1:8080/books/1" -H 'Content-Type: application/json'
curl -XGET "127.0.0.1:8080/books/10/10/author_id/asc" -H 'Content-Type: application/json'

curl -XPOST "127.0.0.1:8080/books" -d '{"author_id":3,"title":"newtitle","description":"newdescription","image":"image.png"}' -H 'Content-Type: application/json'

curl -XPUT "127.0.0.1:8080/books/5" -d '{"author_id":11}' -H 'Content-Type: application/json'
curl -XPUT "127.0.0.1:8080/books/5" -d '{"author_id":3,"title":"newtitle","description":"newdescription","image":"image.png"}' -H 'Content-Type: application/json'

curl -XDELETE "127.0.0.1:8080/books/3"
curl -XGET "127.0.0.1:8080/books/3" -H 'Content-Type: application/json'

