docker build -t translator .
docker run -p '8096:8096' translator -d