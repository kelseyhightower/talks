# Kubernetes 1.2 Demo (Ghost)

## Prerequisites 

### Database

Create a [Cloud SQL database instance](https://cloud.google.com/sql/docs/create-instance).


```
mysql -u root -p -h <cloud-sql-host> --ssl -p
```

```
CREATE USER 'ghost'@'%' IDENTIFIED BY '<database-password>';
CREATE DATABASE ghost;
GRANT ALL ON ghost.* TO 'ghost'@'%';
FLUSH PRIVILEGES;
```

### TLS Certificates

```
ls -1 tls/
```
```
ca.crt
tls.crt
database-ca.pem
tls.key
```

## Deploying Ghost with Kubernetes

### Store Server Certificates

```
kubectl create secret generic ghost-tls --from-file=tls/
```
```
secret "ghost-tls" created
```


```
kubectl describe secrets ghost-tls
```

```
Name:        ghost-tls
Namespace:   default
Labels:      <none>
Annotations: <none>

Type:        Opaque

Data
====
tls.key:         1679 bytes
ca.crt:          1363 bytes
database-ca.pem: 1146 bytes
tls.crt:         1440 bytes
```

### Store the Ghost configuration file in a Secret

```
kubectl create secret generic ghost --from-file=configs/config.js 
```

### Store the Ghost Nginx config in configmap

```
kubectl create configmap nginx-ghost --from-file=configs/ghost.conf
```

### Create the Ghost deployment

```
kubectl create -f deployments/ghost.yaml
```

### Expose the Ghost deployment

```
kubectl create -f services/ghost.yaml
```

### Create the Ghost ingress controller

```
kubectl create -f ingress/ghost.yaml
```

### Scale the ghost deployment

```
kubectl scale deployment ghost --replicas=3
```

### Roll out a new version

```
gcloud compute firewall-rules create allow-130-211-0-0-22 \
  --source-ranges 130.211.0.0/22  --allow tcp:32028
```
