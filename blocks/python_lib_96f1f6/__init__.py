import io
import base64
import math

from PIL import Image, ImageDraw
from vocana import VocanaSDK as Context

def main(inputs: dict, context: Context):
  if inputs["isDegree"]:
    image = draw_sphere(inputs, context)
  else:
    image = draw_plant(inputs, context)

  image_io = io.BytesIO()
  image.save(image_io, format="PNG")
  image_bytes = image_io.getvalue()
  image_base64 = base64.b64encode(image_bytes).decode("utf-8")

  context.output(image_base64, "image", True)

def draw_sphere(inputs: dict, context: Context):
  width_degrees = inputs["视野宽度（度）"]
  height_degrees = inputs["视野高度（度）"]
  pixel = inputs["宽度像素（长轴）"]

  if width_degrees > height_degrees:
    pix_width = pixel
    pix_height = int(height_degrees * float(pixel) / width_degrees)
  else:
    pix_height = pixel
    pix_width = int(width_degrees * float(pixel) / height_degrees)

  image = Image.new("RGB", (pix_width, pix_height), (0, 0, 0))
  draw = ImageDraw.Draw(image)

  rows = inputs["rows"]
  max_degrees = max(width_degrees, height_degrees)
  max_mag = get_max_mag(rows)

  for row in rows:
    theta: float = row["x"]
    r: float = row["y"]
    distance = (r / max_degrees) * pixel

    x = distance * math.cos(theta * math.pi / 180.0)
    y = distance * math.sin(theta * math.pi / 180.0)

    cnn: str = row["cnn"]
    mag: float = row["mag"]
    if mag <= 0.0:
      continue

    x += float(pix_width / 2.0)
    y += float(pix_height / 2.0)

    draw_star(draw, x, y, mag, max_mag, 1.0)

  return image

def draw_plant(inputs: dict, context: Context):
  width, height, pix_width, pix_height, pix_rate = view(inputs)
  image = Image.new("RGB", (pix_width, pix_height), (0, 0, 0))
  draw = ImageDraw.Draw(image)

  rows = inputs["rows"]
  half_width = width / 2.0
  half_height = height / 2.0
  max_mag = get_max_mag(rows)

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

  return image

def view(inputs: dict):
  width_degrees = inputs["视野宽度（度）"]
  height_degrees = inputs["视野高度（度）"]
  pixel = inputs["宽度像素（长轴）"]
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

def get_max_mag(rows: list) -> float:
  max_mag = 0.0

  for row in rows:
    mag: float = row["mag"]
    if mag > max_mag:
      max_mag = mag

  return max_mag

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
  x1 = int(x * rate - radius)
  x2 = int(x * rate + radius)
  y1 = int(y * rate - radius)
  y2 = int(y * rate + radius)

  draw.ellipse(
    [(x1, y1), (x2, y2)], 
    fill=color, 
  )