# Devops Network Forum Demo

## Prerequisites

### Create Machines

```
gcloud compute instances create machine0 \
  --machine-type "n1-standard-2" \
  --can-ip-forward \
  --image coreos-alpha-983-0-0-v20160311 \
  --image-project coreos-cloud \
  --boot-disk-size "80" \
  --boot-disk-type "pd-ssd"
```

```
gcloud compute instances create machine1 \
  --machine-type "n1-standard-2" \
  --can-ip-forward \
  --image coreos-alpha-983-0-0-v20160311 \
  --image-project coreos-cloud \
  --boot-disk-size "80" \
  --boot-disk-type "pd-ssd"
```

```
gcloud compute instances create lb0 \
  --machine-type "n1-standard-2" \
  --can-ip-forward \
  --image coreos-alpha-983-0-0-v20160311 \
  --image-project coreos-cloud \
  --boot-disk-size "80" \
  --boot-disk-type "pd-ssd"
```

### Install runc

```
gcloud compute ssh core@machine0
```

```
sudo mkdir -p /opt/bin
sudo curl -o /opt/bin/runc https://storage.googleapis.com/hightowerlabs/runc
sudo chmod +x /opt/bin/runc
```

> Repeat for machine1


## Inspector Demo

### Inspector Binary

```
gcloud compute ssh core@machine0
```

```
sudo curl -o /opt/bin/inspector https://storage.googleapis.com/hightowerlabs/inspector
sudo chmod +x /opt/bin/inspector
```

```
sudo inspector
```

> Visit http://machine0

### Inspector Container - Host Networking

```
gcloud compute ssh core@machine0
```

Download OCI config

```
curl -O https://storage.googleapis.com/hightowerlabs/config.json
```

Create inspector container root directory:

```
mkdir -p inspector/rootfs/etc
```

Populate the inspector container root directory:

```
cp /etc/resolv.conf inspector/rootfs/etc/
cp /etc/hosts inspector/rootfs/etc/
cp /opt/bin/inspector inspector/rootfs/
cp config.json inspector/
```

Start the inspector container:

```
sudo runc start -b inspector inspector
```

> Repeat these steps for machine1


### Network Namespaces in Action

```
gcloud compute ssh core@machine0
```

Create the `containers` bridge:

```
sudo brctl addbr containers
sudo brctl stp containers off
sudo ip link set dev containers up
sudo ip addr add 10.10.0.1/24 dev containers
```

Create the inspector namespace:

```
sudo ip netns add inspector
```

Create a veth0 pair:

```
sudo ip link add veth0 type veth peer name br-veth0
```

Connect one end of the veth pair to the containers bridge:

```
sudo brctl addif containers br-veth0
```

Move one end of the veth0 pair into the inspector network namespace:

```
sudo ip link set veth0 netns inspector
```

Configure the inspector network namespace:

```
sudo ip netns exec inspector bash
```

```
ifconfig -a
ip addr add 10.10.0.2/24 dev veth0
ip addr add 127.0.0.1 dev lo
ip link set veth0 up
ip link set lo up
ip route add default via 10.10.0.1 dev veth0
```

```
exit
```


Repeat these steps on machine1

> Use 10.10.1.1/24 for the container bridge and 10.10.1.2/24 for veth0


### Cross host networking

#### Terminal 1

```
gcloud compute ssh core@machine0
```

```
sudo ip netns exec inspector bash
```

```
ping 10.10.1.2
```

#### Terminal 2

```
gcloud compute ssh core@machine1
```

```
sudo ip netns exec inspector bash
```

```
ping 10.10.0.2
```

#### Create Routes

```
gcloud compute routes create default-route-10-10-0-0-24 \
  --destination-range 10.10.0.0/24 \
  --next-hop-instance machine0
```
  
```
gcloud compute routes create default-route-10-10-1-0-24 \
  --destination-range 10.10.1.0/24 \
  --next-hop-instance machine1
```


### Inspector Container - Network Namespace

```
gcloud compute ssh core@machine0
```

Edit `container/config.json`

```
"linux":{
    "namespaces":[ 
        ...
        {
            "type":"network",
            "path": "/var/run/netns/inspector"
         }
    ],
    ...  
},
```

```
sudo runc start -b inspector inspector
```

> Repeat for machine1


## Load Balance with nginx

```
gcloud compute ssh core@lb0
```

```
cat <<EOF > inspector.conf
upstream inspector {
    least_conn;
    server 10.10.0.2;
    server 10.10.1.2;
}

server {
    listen 80;
    location / {
        proxy_pass http://inspector;
    }
}
EOF
```

```
sudo mkdir -p /etc/nginx/conf.d
```

```
sudo mv inspector.conf  /etc/nginx/conf.d/
```

```
sudo docker run -d --net=host \
  -v /etc/nginx/conf.d:/etc/nginx/conf.d \
  nginx
```


## Automate it all with Kubernetes

```
kubectl run inspector --image=gcr.io/kuar/inspector:2.0.0 --port=80
```

```
kubectl expose rc inspector --type=LoadBalancer
```

```
kubectl scale rc inspector --replicas=10
```
