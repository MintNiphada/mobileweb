<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding ion-text-center">
      <h2>Please login </h2>

      <ion-button expand="block" color="primary" @click="loginEmail">
        Login with Email
      </ion-button>
      
      <ion-button expand="block" color="danger" @click="loginGoogle">
        Login with Google
      </ion-button>
      
      <ion-button expand="block" color="success" @click="loginPhone">
        Login by Phone
      </ion-button>

      <div id="recaptcha-container"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { useRouter } from 'vue-router';
import './LoginPage.css';
import { ref } from 'vue';
import { FirebaseWebAuthService } from '@/auth/auth-web';

const router = useRouter();
const authService = new FirebaseWebAuthService();

const email = ref('');
const password = ref('');
const phone = ref('');

const loginEmail = async () => {
  try {
    await authService.loginWithEmailPassword({
      email: email.value,
      password: password.value,
    });
    router.push('/tabs');
  } catch (e) {
    alert('Login email ไม่สำเร็จ');
  }
};

const loginGoogle = async () => {
  try {
    await authService.loginWithGoogle();
    router.push('/tabs');
  } catch (e) {
    alert('Login Google ไม่สำเร็จ');
  }
};

const loginPhone = async () => {
  try {
    await authService.startPhoneLogin({
      phoneNumberE164: phone.value,
    });
    alert('ส่ง OTP แล้ว');
  } catch (e) {
    alert('ส่ง OTP ไม่สำเร็จ');
  }
};

</script>

