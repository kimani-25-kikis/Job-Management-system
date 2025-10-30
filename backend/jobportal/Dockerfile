# Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install requirements as ROOT (default user) first
WORKDIR /main
COPY requirements.txt /main/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
# Cleanup to keep the image small
RUN rm -rf /root/.cache/pip

# 🔑 CRITICAL FIX: Create and switch to a non-root user *after* installation
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
RUN mkdir -p /home/appuser
RUN chown -R appuser:appgroup /home/appuser /main
USER appuser

COPY . /main/