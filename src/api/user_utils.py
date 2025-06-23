import random
import smtplib
import os
from email.mime.text import MIMEText
from urllib.parse import urljoin

def get_random_color():
    return f'{random.randint(0, 0xFFFFFF):06x}'

def get_brightness(hex_color):
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    return (299 * r + 587 * g + 114 * b) / 1000

def generate_placeholder(username):
    first_letter = username[0].upper() if username else "U"
    bg_color = get_random_color()
    brightness = get_brightness(bg_color)
    text_color = "ffffff" if brightness < 125 else "000000"
    return f"https://ui-avatars.com/api/?name={first_letter}&background={bg_color}&color={text_color}"

def build_reset_url(token: str) -> str:
    frontend_base_url = os.environ['VITE_BACKEND_URL']
    reset_path = f"/reset-password/{token}"  # Cambia si tu ruta es diferente
    return urljoin(frontend_base_url, reset_path)

def send_email(to, subject, body):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    from_email = "receteaapi@gmail.com"  # tu email Gmail
    app_password = os.environ['EMAIL_PASSWORD']  # la contraseña de app que generaste

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to
    "vuwk tabs oyql akur"
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(from_email, app_password)
            server.sendmail(from_email, to, msg.as_string())
        print("Email sent successfully")

    except Exception as e:
        print("Error sending email:", e)