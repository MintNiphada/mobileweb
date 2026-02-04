<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="my-header">
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-input label="ชื่อรายการ" v-model="title"></ion-input>
      <ion-input label="หมวดหมู่" v-model="category"></ion-input>
      <ion-input label="จำนวนเงิน" type="number" v-model.number="amount"></ion-input>

      <ion-segment v-model="type">
        <ion-segment-button value="income">รายรับ</ion-segment-button>
        <ion-segment-button value="expense">รายจ่าย</ion-segment-button>
      </ion-segment>

      <ion-button expand="block" class="save-btn" @click="updateData">
        บันทึกการแก้ไข
      </ion-button>

      <ion-button expand="block" color="danger" class="delete-btn" @click="confirmDelete">
        ลบรายการ
      </ion-button>

      <ion-alert
        :is-open="showAlert"
        header="ยืนยันการลบ"
        message="คุณต้องการลบรายการนี้หรือไม่?"
        :buttons="alertButtons"
        @didDismiss="showAlert = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import './EditExpense.css'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonButton, IonSegment, IonSegmentButton, IonAlert
} from '@ionic/vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const title = ref('')
const category = ref('')
const amount = ref(0)
const type = ref('income')

const showAlert = ref(false)

onMounted(async () => {
  const snap = await getDoc(doc(db, 'expenses', id))
  if (snap.exists()) {
    const data = snap.data()
    title.value = data.title
    category.value = data.category
    amount.value = data.amount
    type.value = data.type
  }
})

const updateData = async () => {
  await updateDoc(doc(db, 'expenses', id), {
    title: title.value,
    category: category.value,
    amount: amount.value,
    type: type.value
  })
  router.push('/tabs/tab1')
}

const confirmDelete = () => {
  showAlert.value = true
}

const alertButtons = [
  {
    text: 'ยกเลิก',
    role: 'cancel'
  },
  {
    text: 'ลบ',
    role: 'destructive',
    handler: async () => {
      await deleteDoc(doc(db, 'expenses', id))
      router.push('/tabs/tab1')
    }
  }
]
</script>
