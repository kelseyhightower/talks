# GWO Demo

## Single System Demo

```
gcloud compute ssh core@machine0
```

```
top
```

```
ps -ax -o pid,psr,cmd
```

```
docker run -d -P nginx:1.7.9
```

```
gcloud compute ssh machine1
```

```
docker run -d -P nginx:1.7.9
```

### Manging Resources

```
gcloud compute ssh machine1
```

```
docker run -d -P nginx:1.7.9
```

### Upgrading Applications

```
docker stop <cid>
docker rm <cid>
docker run -d -P nginx:1.9.12
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
kubectl rollingupdate nginx --image=nginx:1.9.12 --update-period=5s
```
