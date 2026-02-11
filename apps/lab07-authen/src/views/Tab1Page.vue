<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>User Info</h2>

      <div v-if="user" class="user-card">
        <!-- Avatar -->
        <div class="avatar-wrapper">
          <img
            v-if="user.photoUrl"
            :src="user.photoUrl"
            class="user-avatar"
          />
          <div v-else class="avatar-fallback">
            {{ getInitial(user.displayName || user.email || user.uid) }}
          </div>
        </div>

        <!-- Info -->
        <p><span>UID:</span> {{ user.uid }}</p>
        <p><span>Email:</span> {{ user.email ?? '-' }}</p>
        <p><span>Phone:</span> {{ user.phoneNumber ?? '-' }}</p>
        <p><span>Name:</span> {{ user.displayName ?? '-' }}</p>

        <ion-button expand="block" class="logout-btn" @click="logout">
          Logout
        </ion-button>
      </div>

      <p v-else class="not-login">Not logged in</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  onIonViewWillEnter
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { authService } from '@/auth/auth-service';
import type { AuthUser } from '@/auth/auth-interface';
import './Tab1Page.css';

const user = ref<AuthUser | null>(null);
const router = useRouter();

onIonViewWillEnter(async () => {
  user.value = await authService.getCurrentUser();
});

const logout = async () => {
  await authService.logout();
  router.replace('/login');
};

const getInitial = (text: string) => {
  return text.charAt(0).toUpperCase();
};
</script>
