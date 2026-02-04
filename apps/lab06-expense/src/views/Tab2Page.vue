<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="my-header">
        <ion-title>เพิ่มรายการรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list :inset="true">
        <ion-item>
          <ion-input 
            label="ชื่อรายการ" 
            label-placement="stacked" 
            v-model="title" 
            placeholder="ระบุชื่อรายการ เช่น ค่าอาหาร">
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-input 
            label="จำนวนเงิน" 
            label-placement="stacked" 
            type="number"
            inputmode="decimal"
            v-model="amount" 
            placeholder="0.00">
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-select label="ประเภท" label-placement="stacked" v-model="type">
            <ion-select-option value="income">รายรับ (Income)</ion-select-option>
            <ion-select-option value="expense">รายจ่าย (Expense)</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-select
            label="หมวดหมู่"
            label-placement="stacked"
            v-model="category"
            interface="alert"
            @ionChange="handleCategoryChange"
          >
            <ion-select-option value="อาหาร">อาหาร</ion-select-option>
            <ion-select-option value="เดินทาง">เดินทาง</ion-select-option>
            <ion-select-option value="ช้อปปิ้ง">ช้อปปิ้ง</ion-select-option>
            <ion-select-option value="อื่น ๆ">อื่น ๆ</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-textarea 
            label="หมายเหตุ" 
            label-placement="stacked" 
            v-model="note" 
            placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)">
          </ion-textarea>
        </ion-item>
      </ion-list>

      <div class="ion-padding">
        <ion-button expand="block" class="my-btn" :disabled="isSubmitting" @click="saveExpense">
          <ion-spinner v-if="isSubmitting" name="crescent"></ion-spinner>
          <span v-else>บันทึกข้อมูล</span>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import './Tab2.css'
import { ref } from "vue";
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonInput, IonSelect, IonSelectOption, IonTextarea, 
  IonButton, IonList, IonItem, IonSpinner, toastController 
} from "@ionic/vue";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();

// Form Data
const title = ref("");
const amount = ref("");
const type = ref("expense");
const category = ref("");
const note = ref("");
const isSubmitting = ref(false);

// Toast
const showToast = async (message: string, color: 'success' | 'danger') => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: 'top'
  });
  await toast.present();
};

const saveExpense = async () => {
  const numAmount = Number(amount.value);

  if (!title.value.trim()) {
    await showToast("กรุณากรอกชื่อรายการ", "danger");
    return;
  }

  if (isNaN(numAmount) || numAmount <= 0) {
    await showToast("กรุณากรอกจำนวนเงินที่มากกว่า 0", "danger");
    return;
  }

  isSubmitting.value = true;
  try {
    await addDoc(collection(db, "expenses"), {
      title: title.value,
      amount: numAmount,
      type: type.value,
      category: category.value,
      note: note.value,
      createdAt: serverTimestamp()
    });

    await showToast("บันทึกข้อมูลสำเร็จ!", "success");

    title.value = "";
    amount.value = "";
    type.value = "expense";
    category.value = "";
    note.value = "";

    router.push("/tabs/tab1");
  } catch (err) {
    console.error("Firebase Error:", err);
    await showToast("บันทึกไม่สำเร็จ กรุณาลองใหม่", "danger");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
