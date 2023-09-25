from aws_sqs_consumer import Consumer, Message
import os
import torch
from diffusers import StableDiffusionPipeline
import random
import string
from s3_upload import upload_file_to_s3

# Init framework and Load model files
pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4", revision="fp16", torch_dtype=torch.float16)
pipe.to("cuda")

class SimpleConsumer(Consumer):
   def handle_message(self, message: Message):
      print("Received message: ", message.Body)
      # prompt = "a photograph of an astronaut riding a horse"

      # Generate Image
      image = pipe(message.Body).images[0]
      image_name = ''.join(random.sample(string.ascii_lowercase, 8)) + '.jpg'
      file_location = '../output/' + image_name
      image.save(file_location)

      print("Image Generated: " + image_name)

      # Upload to S3
      upload_file_to_s3(file_location, os.getenv('S3_BUCKET_NAME'), image_name)
      print("Image Uploaded: " + os.getenv('CLOUDFRONT_DOMAIN') + "/" + image_name)



# Listen to SQS Queue
consumer = SimpleConsumer(
   queue_url=os.getenv('SQS_QUEUE_URL'),
   region="ap-northeast-2",
   polling_wait_time_ms=5
)

print("sqs consumer started: " + os.getenv('SQS_QUEUE_URL'))
consumer.start()

