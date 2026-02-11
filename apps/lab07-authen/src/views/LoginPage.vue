<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="login-card">
        <h2>Welcome to Lab07</h2>
        <p class="subtitle">Please choose a login method.</p>

        <ion-button expand="block" class="btn-primary" @click="method = 'email'">
          Login with Email
        </ion-button>

        <ion-button expand="block" class="btn-google"  @click="loginGoogle">
          Login with Google
        </ion-button>

        <ion-button expand="block" class="btn-phone"  @click="method = 'phone'">
          Login with Phone
        </ion-button>

        <!-- Email Form -->
        <div v-if="method === 'email'" class="form-box">
          <ion-input v-model="email" label="Email" type="email" fill="outline" />
          <ion-input v-model="password" label="Password" type="password" fill="outline" />
          <ion-button expand="block" class="btn-primary" @click="loginEmail">Login</ion-button>
        </div>

        <!-- Phone Form -->
        <div v-if="method === 'phone'" class="form-box">
          <ion-input v-model="phone" label="Phone (+66...)" fill="outline" />
          <ion-button expand="block" class="btn-phone"  @click="startPhone">
            Send OTP
          </ion-button>

          <ion-input
            v-if="verificationId"
            v-model="otp"
            label="OTP"
            fill="outline"
          />
          <ion-button v-if="verificationId" expand="block" class="btn-secondary" @click="confirmOtp">
            Confirm OTP
          </ion-button>
        </div>

        <div id="recaptcha-container"></div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput
} from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/auth/auth-service';
import './LoginPage.css'

const router = useRouter();

const method = ref<'email' | 'phone' | null>(null);

const email = ref('');
const password = ref('');
const phone = ref('');
const otp = ref('');
const verificationId = ref('');

const loginEmail = async () => {
  try {
    await authService.loginWithEmailPassword({
      email: email.value,
      password: password.value,
    });
    router.replace('/tabs/tab1');
  } catch {
    alert('Login email ไม่สำเร็จ');
  }
};

const loginGoogle = async () => {
  try {
    await authService.loginWithGoogle();
    router.replace('/tabs/tab1');
  } catch {
    alert('Login Google ไม่สำเร็จ');
  }
};

const startPhone = async () => {
  try {
    const r = await authService.startPhoneLogin({
      phoneNumberE164: phone.value,
    });
    verificationId.value = r.verificationId;
    alert('ส่ง OTP แล้ว');
  } catch {
    alert('ส่ง OTP ไม่สำเร็จ');
  }
};

const confirmOtp = async () => {
  try {
    await authService.confirmPhoneCode({
      verificationId: verificationId.value,
      verificationCode: otp.value,
    });
    router.replace('/tabs/tab1');
  } catch {
    alert('OTP ไม่ถูกต้อง');
  }
};
</script>

