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

## Inspector Demo

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

> Visit http://104.154.36.232

```
gcloud compute instances list
NAME     ZONE          MACHINE_TYPE  PREEMPTIBLE INTERNAL_IP EXTERNAL_IP     STATUS
lb0      us-central1-a n1-standard-2             10.240.0.4  104.197.238.18  RUNNING
machine0 us-central1-a n1-standard-2             10.240.0.3  104.154.36.232  RUNNING
machine1 us-central1-a n1-standard-2             10.240.0.5  104.154.27.180  RUNNING
```

### Inspector Container - Host Networking

```
gcloud compute ssh core@machine0
```

```
mkdir -p container/rootfs/etc
```
```
cp /etc/resolv.conf container/rootfs/etc/
cp /etc/hosts container/rootfs/etc/
cp /opt/bin/inspector container/rootfs/
curl -o container/config.json https://storage.googleapis.com/hightowerlabs/config.json
```

```
sudo runc start -b container container0
```

### Inspector Container - Network Namespace

```
gcloud compute ssh core@machine0
```

### Create container bridge

```
sudo brctl addbr containers
sudo brctl stp containers off
sudo ip link set dev containers up
sudo ip addr add 10.10.0.1/24 dev containers
```

### Create container interface

```
sudo ip netns add container0
sudo ip netns list
```

```
sudo ip link add veth0 type veth peer name br-veth0
sudo ip link set veth0 netns container0
```

```
brctl show containers
sudo brctl addif containers br-veth0
```

```
sudo ip netns exec container0 bash
ifconfig -a
ip addr add 10.10.0.2/24 dev veth0
ip addr add 127.0.0.1 dev lo
ip link veth0 set up
ip link lo set up
ip route add default via 10.10.0.1 dev veth0
```

## Create Routes


```
gcloud compute routes create default-route-10-10-0-0-24 \
  --destination-range 10.10.0.0/24 \
  --next-hop-instance machine0
  
gcloud compute routes create default-route-10-10-1-0-24 \
  --destination-range 10.10.1.0/24 \
  --next-hop-instance machine1
```


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
```
