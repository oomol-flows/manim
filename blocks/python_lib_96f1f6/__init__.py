import io
import base64
import math

from PIL import Image, ImageDraw
from vocana import VocanaSDK as Context

def main(inputs: dict, context: Context):
  width, height, pix_width, pix_height, pix_rate = view(inputs)
  image = Image.new("RGB", (pix_width, pix_height), (0, 0, 0))
  rows = inputs["rows"]
  half_width = width / 2.0
  half_height = height / 2.0
  draw = ImageDraw.Draw(image)

  max_mag = 0.0

  for row in rows:
    mag: float = row["mag"]
    if mag > max_mag:
      max_mag = mag

  for row in rows:
    x: float = row["x"]
    y: float = row["y"]
    if abs(x) > half_width or abs(y) > half_height:
      continue
    
    cnn: str = row["cnn"]
    mag: float = row["mag"]
    if mag <= 0.0:
      continue

    x += half_width
    y += half_height
    draw_star(draw, x, y, mag, max_mag, pix_rate)

  image_io = io.BytesIO()
  image.save(image_io, format="PNG")
  image_bytes = image_io.getvalue()
  image_base64 = base64.b64encode(image_bytes).decode("utf-8")

  context.output(image_base64, "image", True)

def view(inputs: dict):
  width_degrees = inputs["视野宽度（度）"]
  height_degrees = inputs["视野高度（度）"]
  pixel = inputs["宽度像素（长轴）"]

  if inputs["isDegree"]:
    width = width_degrees
    height = height_degrees
  else:
    width = 2.0 * math.tan(0.5 * math.radians(width_degrees))
    height = 2.0 * math.tan(0.5 * math.radians(height_degrees))

  if width > height:
    pix_width = pixel
    pix_height = int(height * float(pixel) / width)
    pix_rate = float(pixel) / width
  else:
    pix_height = pixel
    pix_width = int(width * float(pixel) / height)
    pix_rate = float(pixel) / height

  return width, height, pix_width, pix_height, pix_rate

def draw_star(
  draw, 
  x: float, 
  y: float,
  mag: float, 
  max_mag: float,
  rate: float,
):
  radius = mag * 0.35
  color = (255, 255, 255)
  print(color)
  x1 = int(x * rate - radius)
  x2 = int(x * rate + radius)
  y1 = int(y * rate - radius)
  y2 = int(y * rate + radius)

  draw.ellipse(
    [(x1, y1), (x2, y2)], 
    fill=color, 
  )