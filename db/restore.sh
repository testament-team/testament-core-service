#! /bin/bash -e

echo "Restoring applications..."
mongoimport --host ${HOST} --db ${DB} --collection applications --type json --file applications.json --jsonArray

echo "Restoring blueprints..."
mongoimport --host ${HOST} --db ${DB} --collection blueprints --type json --file blueprints.json --jsonArray

echo "Restoring environments..."
mongoimport --host ${HOST} --db ${DB} --collection environments --type json --file environments.json --jsonArray

echo "Restoring namespaces..."
mongoimport --host ${HOST} --db ${DB} --collection namespaces --type json --file namespaces.json --jsonArray

echo "Restoring users..."
mongoimport --host ${HOST} --db ${DB} --collection users --type json --file users.json --jsonArray