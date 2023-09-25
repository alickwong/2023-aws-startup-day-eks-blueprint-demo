# EKS Blueprint Image Generation Demo

Please note that this repository is created for inspiration and demonstration purposes only. Please review it carefully before using it in a production environment.

# Setup
```angular2html
export ACCOUNT_ID=YOUR_ACCOUNT_ID
export AWS_REGION=ap-northeast-2

npm install
```

# Build
```bash
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.ap-northeast-2.amazonaws.com
docker build . -t ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:v0.0.1
docker push ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:v0.0.1
```

# Update
Update the following ENV Value in `genai-consumer-deployment.yaml`
- SQS_QUEUE_URL
- S3_BUCKET_NAME
- CLOUDFRONT_DOMAIN
- S3_REGION


# Deploy
```angular2html
cdk deploy

```

# Local Development / Debug
```angular2html
// Check GPU is available
sudo docker run --rm --gpus all pytorch/pytorch:latest python -c 'import torch as t; print(t.cuda.is_available()); print(t.backends.cudnn.enabled)'

// Start local server using compose
sudo docker compose up --build

// Start local server using run
sudo docker run -v /home/ubuntu/sd-gen-model-container/sd-gen-sdxl-infer/output:/app/output \
-v /home/ubuntu/sd-gen-model-container/sd-gen-sdxl-infer/hf_cache:/hf_cache \
--gpus all sdconsumer:v1
```