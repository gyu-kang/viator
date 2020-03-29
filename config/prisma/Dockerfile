FROM prismagraphql/prisma:1.34

COPY ./wait-for /app/wait-for
RUN chmod +x /app/wait-for

ENTRYPOINT ["/bin/sh", "-c", "/app/wait-for mariadb:3306 -t 60 -- /app/start.sh"]
