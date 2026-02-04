<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>สรุปยอดรายรับ-รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card class="balance-card">
        <ion-card-header>
          <ion-card-subtitle>ยอดเงินคงเหลือ</ion-card-subtitle>
          <ion-card-title class="balance-amount">{{ formatNumber(totalBalance) }} บาท</ion-card-title>
        </ion-card-header>
      </ion-card>

      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-card color="success" class="summary-card">
              <ion-card-header>
                <ion-card-subtitle>รายรับ</ion-card-subtitle>
                <ion-card-title>+{{ formatNumber(totalIncome) }}</ion-card-title>
              </ion-card-header>
            </ion-card>
          </ion-col>
          <ion-col size="6">
            <ion-card color="danger" class="summary-card">
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
        <ion-item v-for="item in transactions" :key="item.id">
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
import { ref, onMounted, computed } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel, IonNote, IonListHeader
} from '@ionic/vue';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

const transactions = ref<any[]>([]);

onMounted(() => {
  const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));
  
  onSnapshot(q, (snapshot) => {
    transactions.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
});

const totalIncome = computed(() => {
  return transactions.value
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
});

const totalExpense = computed(() => {
  return transactions.value
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
});

const totalBalance = computed(() => {
  return totalIncome.value - totalExpense.value;
});

const formatNumber = (num: number) => {
  return num.toLocaleString();
};
</script>

<style scoped>
.balance-card {
  text-align: center;
  margin-bottom: 10px;
  background: #f8f9fa;
}

.balance-amount {
  font-size: 2rem;
  font-weight: bold;
  color: #2dd36f;
}

.summary-card {
  margin: 0;
}

.summary-card ion-card-title {
  font-size: 1.2rem;
}
</style>