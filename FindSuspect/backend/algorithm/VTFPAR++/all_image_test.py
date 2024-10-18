import os
import sys

import cv2
from random import sample
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms
from CLIP.clip import clip
from models.vit import *
import json

device= "cuda" if torch.cuda.is_available() else "cpu"

#预训练模型
ViT_model, ViT_preprocess = clip.load("ViT-B/16", device=device,download_root='/data/FindSuspect/algorithm/OpenPAR/VTFPAR++/model')
ViT_model.eval()
#attr_names
attr_words = [
    'top short', #top length 0
    'bottom short', #bottom length 1
    'shoulder bag','backpack',#shoulder bag #backpack 2 3
    'hat', 'hand bag', 'long hair', 'female',# hat/hand bag/hair/gender 4 5 6 7
    'bottom skirt', #bottom type 8
    'frontal', 'lateral-frontal', 'lateral', 'lateral-back', 'back', 'pose varies',#pose[9:15]
    'walking', 'running','riding', 'staying', 'motion varies',#motion[15:20]
    'top black', 'top purple', 'top green', 'top blue','top gray', 'top white', 'top yellow', 'top red', 'top complex',#top color [20 :29]
    'bottom white','bottom purple', 'bottom black', 'bottom green', 'bottom gray', 'bottom pink', 'bottom yellow','bottom blue', 'bottom brown', 'bottom complex',#bottom color[29:39]
    'young', 'teenager', 'adult', 'old'#age[39:43]
]


checkpoint=torch.load('./VTF-Pretrain.pth')
#print(checkpoint)


class TransformerClassifier(nn.Module):
    def __init__(self, attr_num, attr_words, dim=768, pretrain_path='./model/jx_vit_base_p16_224-80ecf9dd.pth'):
        super().__init__()
        super().__init__()
        self.attr_num = attr_num
        self.word_embed = nn.Linear(512, dim)
        self.visual_embed = nn.Linear(512, dim)
        self.vit = vit_base()
        self.vit.load_param(pretrain_path)
        self.blocks = self.vit.blocks[-1:]
        self.norm = self.vit.norm
        self.weight_layer = nn.ModuleList([nn.Linear(dim, 1) for i in range(self.attr_num)])
        self.bn = nn.BatchNorm1d(self.attr_num)
        self.text = clip.tokenize(attr_words).to(device)

    def forward(self, videos, ViT_model):
        ViT_features = []
        if len(videos.size()) < 5:
            videos=videos.unsqueeze(0)
        batch_size, num_frames, channels, height, width = videos.size()
        imgs = videos.view(-1, channels, height, width)
        # imgs=videos[:,0,:,:,:]
        # CLIP 提取视频帧特征
        for img in imgs:
            img = img.unsqueeze(0)
            ViT_features.append(ViT_model.encode_image(img).squeeze(0))
            # 图像特征
        ViT_image_features = torch.stack(ViT_features).to(device).float()

        _, token_num, visual_dim = ViT_image_features.size()
        ViT_image_features = ViT_image_features.view(batch_size, num_frames, token_num, visual_dim)

        ViT_image_features = self.visual_embed(torch.mean(ViT_image_features, dim=1))

        text_features = ViT_model.encode_text(self.text).to(device).float()
        textual_features = self.word_embed(text_features).expand(ViT_image_features.shape[0], text_features.shape[0],
                                                                 768)


        x = torch.cat([textual_features, ViT_image_features], dim=1)

        for b_c, blk in enumerate(self.blocks):
            x = blk(x)
        x = self.norm(x)
        logits = torch.cat([self.weight_layer[i](x[:, i, :]) for i in range(self.attr_num)], dim=1)

        #logits = self.bn(logits)
        return logits

#trainer



def main():
    model=TransformerClassifier(len(attr_words),attr_words=attr_words)
    if torch.cuda.is_available():
        model=model.cuda()
    checkpoint=torch.load('VTF-Pretrain.pth')
    model.load_state_dict(checkpoint['model_state_dict'],strict=False)
    start_epoch=1
    files = os.listdir('person_snapshots')

    trans = transforms.Compose([transforms.ToTensor(),
                                transforms.Resize(size=[224,224]),
                                transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])
    
    results_dict = {}  # 결과를 저장할 딕셔너리

    
    for file in files:
        imgs=[]
        i=os.path.join('person_snapshots', file)
        pil=Image.open(i)
        pil=trans(pil)
        imgs.append(pil)
        imgs=torch.stack(imgs)
        imgs=imgs.to(device)
        valid_logits=model(imgs,ViT_model)
        
        result=valid_logits.squeeze()
        result=torch.sigmoid(result)
        result=result.tolist()
        #포즈 제외하고 배열에 추가
        result=[value for index, value in enumerate(result) if index < 9 or index > 14]
        result=[round(value, 4) for value in result]
        
        results_dict[file] = result  # 파일 이름을 키로, 결과 리스트를 값으로 저장
        
    file_path = "features/"+sys.argv[1]+".json"

    # 파일이 존재하는지 확인하고, 있으면 삭제
    if os.path.exists(file_path):
        print(f"'{file_path}' 파일이 존재합니다. 삭제 후 다시 생성합니다.")
        os.remove(file_path)
    else:
        print(f"'{file_path}' 파일이 존재하지 않습니다. 새로 생성합니다.")

    if not results_dict:
        exit(-1)

    # 파일 생성 및 JSON 형식으로 저장
    with open(file_path, 'w') as f:
        json.dump(results_dict, f)  # JSON 형식으로 딕셔너리를 저장


if __name__ == '__main__':
    main()
