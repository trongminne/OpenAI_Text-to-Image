# Code này cũ nếu muốn chạy cài bản code cũ: pip install openai==0.28

from django.conf import settings
from django.shortcuts import render
import openai, os, requests
from dotenv import load_dotenv
from django.core.files.base import ContentFile
from images.models import Image as MyImage
from PIL import Image as PillowImage
import pygame
from gtts import gTTS
from io import BytesIO
import io
load_dotenv()

api_key = os.getenv("OPENAI_KEY", None)

from django.http import JsonResponse
import mediapipe as mp
import cv2

# Khởi tạo pygame
pygame.init()
pygame.mixer.init()

def translate_to_english(user_input):
    if api_key is not None:
        openai.api_key = api_key
          # Phát âm tiếng việt đầu vào
        speak_text("Đang tạo ảnh "+ user_input + ", hãy chờ một chút!")
        
        prompt = f"translate this text to english: {user_input}"
        
        response = openai.Completion.create(
            engine='text-davinci-003',
            prompt=prompt,
            max_tokens=256,
            temperature=0.5
        )
        translated_text = response['choices'][0]["text"].strip()

        return response['choices'][0]["text"].strip()
    else:
        return user_input

# Phát âm prompt
def speak_text(text):
    # Chuyển đổi văn bản thành MP3 trong bộ nhớ
    mp3_data = BytesIO()
    tts = gTTS(text=text, lang='vi') # 'vi' phát âm tiếng việt
    tts.write_to_fp(mp3_data)

    # Đặt vị trí về đầu của luồng trong bộ nhớ
    mp3_data.seek(0)

    # Tải và phát âm thanh từ tệp trong bộ nhớ sử dụng pygame
    pygame.mixer.music.load(mp3_data)
    pygame.mixer.music.play()

def generate_image_from_txt(request):
    obj = None 
    if api_key is not None and request.method == 'POST':
        user_input = request.POST.get('user_input')
        
        # Chuyển đổi tiếng việt sang tiếng anh
        user_input_english = translate_to_english(user_input)
        
        response = openai.Image.create(
            prompt=user_input_english,
            size='1024x1024'
        )
        img_url = response["data"][0]["url"]
        response = requests.get(img_url)
        img_file = ContentFile(response.content)
        
        count = MyImage.objects.count() + 1
        fname = f"image - {count}.jpg"
        
        obj = MyImage(phrase=user_input)
        obj.ai_image.save(fname, img_file)
        obj.save()
        
    return render(request, "main.html", {"object": obj})

def edit_image_from_txt(request):
    obj = None 
    if api_key is not None and request.method == 'POST':
        user_input = request.POST.get('user_input')
        image_input = request.FILES.get('image_input')
        image_mask_input = request.FILES.get('image_mask_input')

        # Translate the user input from Vietnamese to English
        user_input_english = translate_to_english(user_input)

        # Đường dẫn tệp ảnh gốc và mặt nạ
        image_path = os.path.join(settings.MEDIA_ROOT, 'images', 'image_edit_original.png')
        image_mask_path = os.path.join(settings.MEDIA_ROOT, 'images', 'image_edit_mask.png')

        response = openai.Image.create_edit(
            image=open(image_path, "rb"),
            mask=open(image_mask_path, "rb"),
            prompt=user_input_english,
            n=1,
            size="1024x1024"
        )

        img_url = response["data"][0]["url"]
        
        response = requests.get(img_url)
        img_file = ContentFile(response.content)
        
        count = MyImage.objects.count() + 1
        fname = f"image - {count}.jpg"
        
        obj = MyImage(phrase=user_input)
        obj.ai_image.save(fname, img_file)
        obj.save()
        print(obj)
        
    return render(request, "edit.html", {"object": obj})







