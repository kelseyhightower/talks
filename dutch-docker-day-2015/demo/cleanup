#!/bin/bash

kubectl delete rc mysql lobsters
kubectl delete svc mysql lobsters
kubectl delete jobs lobsters-db-schema-load lobsters-db-seed 

curl https://$(docker-machine ip swarm-master):3476/remove?name=nginx \
  --cacert ~/.docker/machine/certs/ca.pem \
  --cert ~/.docker/machine/certs/cert.pfx \
  --pass swarm

eval $(docker-machine env swarm-master --swarm)
docker rm -f $(docker ps -f label=swarm.cluster.state=nginx -q)
