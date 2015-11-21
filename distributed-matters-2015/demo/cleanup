#!/bin/bash

kubectl delete rc mysql lobsters
kubectl delete svc mysql lobsters
kubectl delete jobs lobsters-db-schema-load lobsters-db-seed 
gcloud compute disks delete mysql-data
