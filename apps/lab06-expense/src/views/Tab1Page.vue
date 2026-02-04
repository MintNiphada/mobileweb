<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="my-header">
        <ion-title>สรุปยอดรายรับ-รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card class="balance-card">
        <ion-card-header>
          <ion-card-subtitle>ยอดเงินคงเหลือ</ion-card-subtitle>
          <ion-card-title class="balance-amount">
            {{ formatNumber(totalBalance) }} บาท
          </ion-card-title>
        </ion-card-header>
      </ion-card>

      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-card class="summary-card income">
              <ion-card-header>
                <ion-card-subtitle>รายรับ</ion-card-subtitle>
                <ion-card-title>+{{ formatNumber(totalIncome) }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
          <ion-col size="6">
            <ion-card class="summary-card expense">
              <ion-card-header>
                <ion-card-subtitle>รายจ่าย</ion-card-subtitle>
                <ion-card-title>-{{ formatNumber(totalExpense) }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-list-header>
        <ion-label>รายการล่าสุด</ion-label>
      </ion-list-header>

      <ion-list>
        <ion-item
          v-for="item in transactions"
          :key="item.id"
          button
          @click="goEdit(item.id)"
        >
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.category }}</p>
          </ion-label>
          <ion-note slot="end" :color="item.type === 'income' ? 'success' : 'danger'">
            {{ item.type === 'income' ? '+' : '-' }}{{ formatNumber(item.amount) }}
          </ion-note>
        </ion-item>

        <ion-item v-if="transactions.length === 0" lines="none">
          <ion-label class="ion-text-center">ยังไม่มีข้อมูล</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import './Tab1.css'
import { ref, onMounted, computed } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonNote, IonListHeader
} from '@ionic/vue'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

const goEdit = (id: string) => {
  router.push(`/tabs/edit/${id}`)
}

const transactions = ref<any[]>([])

onMounted(() => {
  const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'))

  onSnapshot(q, (snapshot) => {
    transactions.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  })
})

const totalIncome = computed(() =>
  transactions.value
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)
)

const totalExpense = computed(() =>
  transactions.value
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)
)

const totalBalance = computed(() =>
  totalIncome.value - totalExpense.value
)

const formatNumber = (num: number) => num.toLocaleString()
</script>
