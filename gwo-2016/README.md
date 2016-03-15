# GWO Demo

## Operating System Demo

```
gcloud compute ssh machine0
```

```
top
```

```
df -h
```

```
docker run -d --name=nginx1 nginx:1.7.9
```

```
gcloud compute ssh machine1
```

```
docker run -d --name=nginx2 nginx:1.7.9
```

## Manging Resources

Review the spread sheet. Pick a new machine to add more instances too.

docker run -d --name=nginx3 nginx:1.7.9

## Upgrading Applications

```
docker stop nginx1
docker rm nginx1
docker run -d --name=nginx1 nginx:1.9.12
```

## Using a Distribute Operating System

```
kubectl get nodes
```

```
kubectl run nginx --image=nginx:1.7.9
```

```
kubectl expose rc nginx --type=LoadBalancer --port=80
```

```
kubectl scale rc nginx --replicas=3
```

### Upgrading Applications

```
kubectl rollingupdate nginx --image=nginx:1.9.12
```
