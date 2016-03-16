# GWO Demo

## Single System Demo

```
gcloud compute ssh core@machine0
```

```
top
```

```
df -h
```

```
docker run -d nginx:1.7.9
```

```
gcloud compute ssh machine1
```

```
docker run -d nginx:1.7.9
```

### Manging Resources

```
gcloud compute ssh machine1
```

```
docker run -d nginx:1.7.9
```

```
ps -ax -o pid,psr,cmd
```

### Upgrading Applications

```
docker stop nginx1
docker rm nginx1
docker run -d --name=nginx1 nginx:1.9.12
```

## Distribute Operating System Demo

```
kubectl get nodes
```

```
kubectl run nginx --image=nginx:1.7.9
```

```
kubectl expose rc nginx --type=LoadBalancer --port=80
```

### Managing Resources

```
kubectl scale rc nginx --replicas=3
```

### Upgrading Applications

```
kubectl rollingupdate nginx --image=nginx:1.9.12
```
