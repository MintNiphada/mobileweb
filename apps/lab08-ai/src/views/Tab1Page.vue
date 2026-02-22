<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Lab08: Gemini Vision โดย นิภาดา ญายะนันท์</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content class="ion-padding">
      <input ref="fileEl" type="file" accept="image/*" hidden @change="onFileChange" />
      
      <div class="button-group">
        <ion-button class="btn-upload" @click="fileEl?.click()">
          เลือกไฟล์ภาพ
        </ion-button>

        <ion-button class="btn-camera" @click="onTakePhoto">
          ถ่ายภาพ (Camera)
        </ion-button>

      </div>

<div class="preview-container">
  <ion-img v-if="previewUrl" :src="previewUrl" />
  <ion-spinner v-if="loading" />
</div>

      <div class="button-group">
        <ion-button class="btn-analyze" :disabled="!img || loading" @click="onAnalyze" > วิเคราะห์ภาพ </ion-button>
      </div>


      <ion-card v-if="result">
        <ion-card-header>
            <ion-card-title>ผลการวิเคราะห์</ion-card-title>
          </ion-card-header>

          <ion-card-content>

            <h2 style="display:flex; align-items:center; gap:6px;">
              <ion-icon :icon="documentTextOutline" />
              คำบรรยาย
            </h2>
            <p>{{ result.caption }}</p>

            <h2 class="section-title">
              <ion-icon :icon="pricetagsOutline" />
              แท็ก
            </h2>            
            <ion-chip
              v-for="(tag, index) in result.tags"
              :key="index"
              color="primary"
              style="margin:4px"
            >
              <ion-label>{{ tag }}</ion-label>
            </ion-chip>

            <div v-if="result.objects?.length">
            <h2 class="section-title">
              <ion-icon :icon="cubeOutline" />
                วัตถุที่พบ
            </h2>                 
            <ion-list>
                <ion-item v-for="(obj, index) in result.objects" :key="index">
                    <ion-label>
                      <h3>{{ obj.name }}</h3>
                      <p v-if="obj.confidence">
                      ความมั่นใจ: {{ (obj.confidence * 100).toFixed(1) }}%
                    </p>
                    </ion-label>
                  </ion-item>
              </ion-list>
            </div>

            <!-- Safety -->
            <div v-if="result.safety">
            <h2 class="section-title">
              <ion-icon :icon="shieldCheckmarkOutline" />
                ความปลอดภัย
            </h2>                 
            <ion-badge
                :color="result.safety.isSensitive ? 'danger' : 'success'"
              >
                {{ result.safety.isSensitive ? 'อาจมีเนื้อหาอ่อนไหว' : 'ปลอดภัย' }}
              </ion-badge>

              <p v-if="result.safety.notes">
                หมายเหตุ: {{ result.safety.notes }}
              </p>
              </div>

          </ion-card-content>
        </ion-card>    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import './Tab1Page.css'
import { ref } from "vue";
import {
  IonButton,
  IonContent,
  IonHeader, 
  IonImg, 
  IonPage, 
  IonSpinner, 
  IonTitle, 
  IonToolbar
} from "@ionic/vue";
import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image } from "../core/ai.interface"; ;
import type { ImageAnalysisResult } from "../core/ai.interface";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonLabel,
  IonList,
  IonItem,
  IonBadge
} from "@ionic/vue";
import { IonIcon } from "@ionic/vue";
import { documentTextOutline } from "ionicons/icons";
import { pricetagsOutline } from "ionicons/icons";
import { cubeOutline } from "ionicons/icons";
import { shieldCheckmarkOutline } from "ionicons/icons";

const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);


async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
  result.value = null;
}


async function onTakePhoto() {
  loading.value = true;
  try {
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  } finally {
    loading.value = false;
  }
}


async function onAnalyze() {
  if (!img.value) return;
  loading.value = true;
  try {
    result.value = await GeminiVisionService.analyze(img.value);
  } finally {
    loading.value = false;
  }
}
</script>

