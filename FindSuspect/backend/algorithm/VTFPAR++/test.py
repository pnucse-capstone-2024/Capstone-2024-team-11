import os
import cv2
from random import sample
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms
from CLIP.clip import clip
from models.vit import *
import matplotlib.pyplot as plt  # Import matplotlib for plotting

device = "cuda" if torch.cuda.is_available() else "cpu"

# Pre-trained model
ViT_model, ViT_preprocess = clip.load("ViT-B/16", device=device, download_root='/data/FindSuspect/algorithm/OpenPAR/VTFPAR++/model')
ViT_model.eval()

# Attribute names
attr_words = [
    'top short',  # 0
    'bottom short',  # 1
    'shoulder bag',  # 2
    'backpack',  # 3
    'hat',  # 4
    'hand bag',  # 5
    'long hair',  # 6
    'female',  # 7
    'bottom skirt',  # 8
    'frontal',  # 9
    'lateral-frontal',  # 10
    'lateral',  # 11
    'lateral-back',  # 12
    'back',  # 13
    'pose varies',  # 14
    'walking',  # 15
    'running',  # 16
    'riding',  # 17
    'staying',  # 18
    'motion varies',  # 19
    'top black',  # 20
    'top purple',  # 21
    'top green',  # 22
    'top blue',  # 23
    'top gray',  # 24
    'top white',  # 25
    'top yellow',  # 26
    'top red',  # 27
    'top complex',  # 28
    'bottom white',  # 29
    'bottom purple',  # 30
    'bottom black',  # 31
    'bottom green',  # 32
    'bottom gray',  # 33
    'bottom pink',  # 34
    'bottom yellow',  # 35
    'bottom blue',  # 36
    'bottom brown',  # 37
    'bottom complex',  # 38
    'young',  # 39
    'teenager',  # 40
    'adult',  # 41
    'old'  # 42
]

checkpoint = torch.load('./VTF-Pretrain.pth')

class TransformerClassifier(nn.Module):
    def __init__(self, attr_num, attr_words, dim=768, pretrain_path='./model/jx_vit_base_p16_224-80ecf9dd.pth'):
        super().__init__()
        self.attr_num = attr_num
        self.word_embed = nn.Linear(512, dim)
        self.visual_embed = nn.Linear(512, dim)
        self.vit = vit_base()
        self.vit.load_param(pretrain_path)
        self.blocks = self.vit.blocks[-1:]
        self.norm = self.vit.norm
        self.weight_layer = nn.ModuleList([nn.Linear(dim, 1) for _ in range(self.attr_num)])
        self.bn = nn.BatchNorm1d(self.attr_num)
        self.text = clip.tokenize(attr_words).to(device)

    def forward(self, videos, ViT_model):
        ViT_features = []
        if len(videos.size()) < 5:
            videos = videos.unsqueeze(0)
        batch_size, num_frames, channels, height, width = videos.size()
        imgs = videos.view(-1, channels, height, width)
        for img in imgs:
            img = img.unsqueeze(0)
            ViT_features.append(ViT_model.encode_image(img).squeeze(0))
        ViT_image_features = torch.stack(ViT_features).to(device).float()
        _, token_num, visual_dim = ViT_image_features.size()
        ViT_image_features = ViT_image_features.view(batch_size, num_frames, token_num, visual_dim)
        ViT_image_features = self.visual_embed(torch.mean(ViT_image_features, dim=1))
        text_features = ViT_model.encode_text(self.text).to(device).float()
        textual_features = self.word_embed(text_features).expand(ViT_image_features.shape[0], text_features.shape[0], 768)
        x = torch.cat([textual_features, ViT_image_features], dim=1)
        for blk in self.blocks:
            x = blk(x)
        x = self.norm(x)
        logits = torch.cat([self.weight_layer[i](x[:, i, :]) for i in range(self.attr_num)], dim=1)
        return logits

def main():
    model = TransformerClassifier(len(attr_words), attr_words=attr_words)
    if torch.cuda.is_available():
        model = model.cuda()
    checkpoint = torch.load('VTF-Pretrain.pth')
    model.load_state_dict(checkpoint['model_state_dict'], strict=False)
    files = os.listdir('person_snapshots')

    trans = transforms.Compose([
        transforms.ToTensor(),
        transforms.Resize(size=[224, 224]),
        transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
    ])
    imgs = []
    my_sample = files
    for i in my_sample:
        i = os.path.join('person_snapshots', i)
        pil = Image.open(i)
        pil = trans(pil)
        imgs.append(pil)
    imgs = torch.stack(imgs)
    imgs = imgs.to(device)
    valid_logits = model(imgs, ViT_model)
    return valid_logits

if __name__ == '__main__':
    result = main()
    result = result.squeeze()
    result = torch.sigmoid(result)
    result = result.tolist()
    # Exclude indices from 9 to 15 (poses)
    result = [value for index, value in enumerate(result) if index < 9 or index > 15]
    result = [round(value, 4) for value in result]
    # Get the corresponding attribute names
    attr_indices = [index for index in range(len(attr_words)) if index < 9 or index > 15]
    attr_names = [attr_words[index] for index in attr_indices]
    # Plotting the scores

    # 글꼴 크기 전역 설정
    plt.rcParams.update({'font.size': 12})

    plt.figure(figsize=(14, 7))
    plt.bar(attr_names, result)
    plt.xticks(rotation=90, fontsize=14)  # x축 레이블 글꼴 크기 증가
    plt.yticks(fontsize=14)               # y축 눈금 글꼴 크기 증가
    plt.ylabel('Score', fontsize=16)      # y축 레이블 글꼴 크기 증가
    plt.title('Attribute Scores', fontsize=18)  # 제목 글꼴 크기 증가
    plt.tight_layout()
    # Save the plot to a file
    plt.savefig('attribute_scores.png')
    plt.close()
