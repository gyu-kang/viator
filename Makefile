migrate-db:
	docker exec -it $(shell docker-compose ps -q backend) sh -c "cd server && npx prisma deploy"

create-admin:
	docker exec -it $(shell docker-compose ps -q backend) sh -c "ADMIN_ID=$(ADMIN_ID) ADMIN_PASSWORD=$(ADMIN_PASSWORD) node server/init.js"
